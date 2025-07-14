// Payment API service for VNPay integration

const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:8080/api";

export interface CreatePaymentRequest {
  orderId: string;
  amount: number;
  returnUrl: string;
}

export interface PaymentResponse {
  paymentUrl: string;
}

export interface PaymentStatus {
  paymentId: string;
  orderId: string;
  status: string;
  transactionId?: string;
  amount: number;
  createdAt: string;
  processedAt?: string;
}

class PaymentApiService {
  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    const config: RequestInit = {
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
      ...options,
    };

    const response = await fetch(url, config);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  async createPayment(request: CreatePaymentRequest): Promise<PaymentResponse> {
    return this.request("/payment/create", {
      method: "POST",
      body: JSON.stringify(request),
    });
  }

  async getPaymentStatus(paymentId: string): Promise<PaymentStatus> {
    return this.request(`/payment/${paymentId}/status`);
  }

  async getPaymentByOrderId(orderId: string): Promise<PaymentStatus> {
    return this.request(`/payment/order/${orderId}`);
  }

  async getAllPayments(): Promise<PaymentStatus[]> {
    return this.request("/payment");
  }
}

export const paymentApiService = new PaymentApiService();