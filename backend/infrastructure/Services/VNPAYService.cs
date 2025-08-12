using System.Globalization;
using System.Net;
using System.Security.Cryptography;
using System.Text;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;

namespace Infrastructure.Services
{
    public class VNPayService
    {
        private readonly IConfiguration _configuration;

        public VNPayService(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        public string CreatePaymentUrl(VNPayRequest request)
        {
            var vnpay = new VNPayLibrary();
            
            vnpay.AddRequestData("vnp_Version",
                _configuration.GetValue("VNPay:Version", string.Empty));
            vnpay.AddRequestData("vnp_Command",
                _configuration.GetValue("VNPay:Command", string.Empty));
            vnpay.AddRequestData("vnp_TmnCode",
                _configuration.GetValue("VNPay:TmnCode", string.Empty));
            vnpay.AddRequestData("vnp_Amount", (request.Amount * 100).ToString());
            vnpay.AddRequestData("vnp_CreateDate", request.CreatedDate.ToString("yyyyMMddHHmmss"));
            vnpay.AddRequestData("vnp_CurrCode",
                _configuration.GetValue("VNPay:CurrCode", string.Empty));
            vnpay.AddRequestData("vnp_IpAddr", request.IpAddress);
            vnpay.AddRequestData("vnp_Locale",
                _configuration.GetValue("VNPay:Locale", string.Empty));
            vnpay.AddRequestData("vnp_OrderInfo", request.OrderInfo);
            vnpay.AddRequestData("vnp_OrderType", "other");
            vnpay.AddRequestData("vnp_ReturnUrl", request.ReturnUrl);
            vnpay.AddRequestData("vnp_TxnRef", request.OrderId.ToString());

            var paymentUrl = vnpay.CreateRequestUrl(
                _configuration["VNPay:PaymentUrl"] ?? string.Empty,
                _configuration["VNPay:HashSecret"] ?? string.Empty
            );
            return paymentUrl;
        }

        public VNPayResponse ProcessCallback(IQueryCollection queryParams)
        {
            var vnpay = new VNPayLibrary();
            
            foreach (var param in queryParams)
            {
                vnpay.AddResponseData(param.Key, param.Value.ToString());
            }

            var orderId = Guid.Parse(vnpay.GetResponseData("vnp_TxnRef"));
            var vnPayTranId = vnpay.GetResponseData("vnp_TransactionNo");
            var vnpResponseCode = vnpay.GetResponseData("vnp_ResponseCode");
            var vnpSecureHash = queryParams["vnp_SecureHash"];
            var amount = Convert.ToDecimal(vnpay.GetResponseData("vnp_Amount")) / 100;

            bool checkSignature = vnpay.ValidateSignature(
                queryParams["vnp_SecureHash"].ToString(),
                _configuration["VNPay:HashSecret"] ?? string.Empty
            );

            return new VNPayResponse
            {
                OrderId = orderId,
                TransactionId = vnPayTranId,
                ResponseCode = vnpResponseCode,
                Amount = amount,
                IsValidSignature = checkSignature,
                IsSuccess = checkSignature && vnpResponseCode == "00"
            };
        }

        public async Task<VNPayRefundResponse> ProcessRefund(VNPayRefundRequest request)
        {
            var vnpay = new VNPayLibrary();
            
            vnpay.AddRequestData("vnp_Version", _configuration.GetValue("VNPay:Version", string.Empty));
            vnpay.AddRequestData("vnp_Command", "refund");
            vnpay.AddRequestData("vnp_TmnCode", _configuration.GetValue("VNPay:TmnCode", string.Empty));
            vnpay.AddRequestData("vnp_TransactionType", request.TransactionType);
            vnpay.AddRequestData("vnp_TxnRef", request.OrderId.ToString());
            vnpay.AddRequestData("vnp_Amount", (request.Amount * 100).ToString());
            vnpay.AddRequestData("vnp_OrderInfo", request.RefundInfo);
            vnpay.AddRequestData("vnp_TransactionNo", request.TransactionId);
            vnpay.AddRequestData("vnp_TransactionDate", request.TransactionDate.ToString("yyyyMMddHHmmss"));
            vnpay.AddRequestData("vnp_CreateBy", request.CreatedBy);
            vnpay.AddRequestData("vnp_CreateDate", DateTime.Now.ToString("yyyyMMddHHmmss"));
            vnpay.AddRequestData("vnp_IpAddr", request.IpAddress);
            vnpay.AddRequestData("vnp_RequestId", request.RequestId.ToString());

            var refundUrl = vnpay.CreateRefundUrl(
                _configuration["VNPay:RefundUrl"] ?? string.Empty,
                _configuration["VNPay:HashSecret"] ?? string.Empty
            );

            // Send HTTP request to VNPay refund API
            using var client = new HttpClient();
            var response = await client.PostAsync(refundUrl, null);
            var responseContent = await response.Content.ReadAsStringAsync();

            // Parse response (simplified - you may need to parse actual VNPay response format)
            return new VNPayRefundResponse
            {
                OrderId = request.OrderId,
                TransactionId = request.TransactionId,
                RefundAmount = request.Amount,
                ResponseCode = "00", // This should be parsed from actual response
                IsSuccess = response.IsSuccessStatusCode,
                Message = responseContent
            };
        }
    }
    

    public class VNPayRequest
    {
        public Guid OrderId { get; set; }
        public decimal Amount { get; set; }
        public string OrderInfo { get; set; } = string.Empty;
        public string ReturnUrl { get; set; } = string.Empty;

        public Guid UserId { get; set; } // Optional user ID for tracking
        public string IpAddress { get; set; } = string.Empty;
        public DateTime CreatedDate { get; set; } = DateTime.Now;
    }

    public class VNPayResponse
    {
        public Guid OrderId { get; set; }
        public string TransactionId { get; set; } = string.Empty;
        public string ResponseCode { get; set; } = string.Empty;
        public decimal Amount { get; set; }
        public bool IsValidSignature { get; set; }
        public bool IsSuccess { get; set; }
    }

     public class VNPayRefundRequest
    {
        public Guid OrderId { get; set; }
        public string TransactionId { get; set; } = string.Empty;
        public decimal Amount { get; set; }
        public string RefundInfo { get; set; } = string.Empty;
        public string TransactionType { get; set; } = "02"; // 02: Hoàn trả toàn phần, 03: Hoàn trả một phần
        public DateTime TransactionDate { get; set; }
        public string CreatedBy { get; set; } = string.Empty;
        public string IpAddress { get; set; } = string.Empty;
        public Guid RequestId { get; set; } = Guid.NewGuid();
    }

    public class VNPayRefundResponse
    {
        public Guid OrderId { get; set; }
        public string TransactionId { get; set; } = string.Empty;
        public decimal RefundAmount { get; set; }
        public string ResponseCode { get; set; } = string.Empty;
        public bool IsSuccess { get; set; }
        public string Message { get; set; } = string.Empty;
        public DateTime ProcessedDate { get; set; } = DateTime.Now;
    }

    public class VNPayLibrary
    {
        private readonly SortedList<string, string> _requestData = new();
        private readonly SortedList<string, string> _responseData = new();

        public void AddRequestData(string key, string? value)
        {
            if (!string.IsNullOrEmpty(value))
            {
                _requestData.Add(key, value);
            }
        }

        public void AddResponseData(string key, string? value)
        {
            if (!string.IsNullOrEmpty(value))
            {
                _responseData.Add(key, value);
            }
        }

        public string GetResponseData(string key)
        {
            return _responseData.TryGetValue(key, out var value) ? value : string.Empty;
        }

        public string CreateRequestUrl(string baseUrl, string vnpHashSecret)
        {
            var data = new StringBuilder();
            foreach (var kv in _requestData)
            {
                if (!string.IsNullOrEmpty(kv.Value))
                {
                    data.Append(WebUtility.UrlEncode(kv.Key) + "=" + WebUtility.UrlEncode(kv.Value) + "&");
                }
            }

            var queryString = data.ToString();

            baseUrl += "?" + queryString;
            var signData = queryString;
            if (signData.Length > 0)
            {
                signData = signData.Remove(data.Length - 1, 1);
            }

            var vnpSecureHash = HmacSHA512(vnpHashSecret, signData);
            baseUrl += "vnp_SecureHash=" + vnpSecureHash;

            return baseUrl;
        }

         public string CreateRefundUrl(string baseUrl, string vnpHashSecret)
        {
            var data = new StringBuilder();
            foreach (var kv in _requestData)
            {
                if (!string.IsNullOrEmpty(kv.Value))
                {
                    data.Append(WebUtility.UrlEncode(kv.Key) + "=" + WebUtility.UrlEncode(kv.Value) + "&");
                }
            }

            var queryString = data.ToString();
            if (queryString.Length > 0)
            {
                queryString = queryString.Remove(queryString.Length - 1, 1);
            }

            var vnpSecureHash = HmacSHA512(vnpHashSecret, queryString);
            
            return baseUrl + "?" + queryString + "&vnp_SecureHash=" + vnpSecureHash;
        }

        public bool ValidateSignature(string inputHash, string secretKey)
        {
            var rspRaw = GetResponseData();
            var myChecksum = HmacSHA512(secretKey, rspRaw);
            return myChecksum.Equals(inputHash, StringComparison.InvariantCultureIgnoreCase);
        }

        private string GetResponseData()
        {
            var data = new StringBuilder();
            if (_responseData.ContainsKey("vnp_SecureHashType"))
            {
                _responseData.Remove("vnp_SecureHashType");
            }

            if (_responseData.ContainsKey("vnp_SecureHash"))
            {
                _responseData.Remove("vnp_SecureHash");
            }

            foreach (var kv in _responseData)
            {
                if (!string.IsNullOrEmpty(kv.Value))
                {
                    data.Append(WebUtility.UrlEncode(kv.Key) + "=" + WebUtility.UrlEncode(kv.Value) + "&");
                }
            }

            if (data.Length > 0)
            {
                data.Remove(data.Length - 1, 1);
            }

            return data.ToString();
        }

        private static string HmacSHA512(string key, string inputData)
        {
            var hash = new StringBuilder();
            var keyBytes = Encoding.UTF8.GetBytes(key);
            var inputBytes = Encoding.UTF8.GetBytes(inputData);
            using (var hmac = new HMACSHA512(keyBytes))
            {
                var hashValue = hmac.ComputeHash(inputBytes);
                foreach (var theByte in hashValue)
                {
                    hash.Append(theByte.ToString("x2"));
                }
            }

            return hash.ToString();
        }

        
    }
}