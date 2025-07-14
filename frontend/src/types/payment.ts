export interface Payment {
  id: string;
  orderId: string;
  amount: number;
  method: PaymentMethod;
  status: PaymentStatus;
  vnPayTransactionId?: string;
  vnPayResponseCode?: string;
  createdAt: string;
  processedAt?: string;
  returnUrl?: string;
  ipAddress?: string;
}

export enum PaymentMethod {
  VNPay = 1,
  Cash = 2
}

export enum PaymentStatus {
  Pending = 1,
  Success = 2,
  Failed = 3,
  Cancelled = 4
}

export interface CreatePaymentRequest {
  orderId: string;
  amount: number;
  returnUrl: string;
}

export interface PaymentResponse {
  paymentUrl: string;
}

export interface VNPayCallback {
  vnp_Amount: string;
  vnp_BankCode: string;
  vnp_BankTranNo: string;
  vnp_CardType: string;
  vnp_OrderInfo: string;
  vnp_PayDate: string;
  vnp_ResponseCode: string;
  vnp_TmnCode: string;
  vnp_TransactionNo: string;
  vnp_TransactionStatus: string;
  vnp_TxnRef: string;
  vnp_SecureHashType: string;
  vnp_SecureHash: string;
}