// API service layer for clean architecture integration

const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:8080/api"

class ApiService {
  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`
    const config: RequestInit = {
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
      ...options,
    }

    const response = await fetch(url, config)

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    return response.json()
  }

  // Auth Service
  async login(username: string, password: string) {
    return this.request("/auth/login", {
      method: "POST",
      body: JSON.stringify({ username, password }),
    })
  }

  async register(userData: any) {
    return this.request("/auth/register", {
      method: "POST",
      body: JSON.stringify(userData),
    })
  }

  // Product Service
  async getProducts(search?: string, category?: string) {
    const params = new URLSearchParams()
    if (search) params.append("search", search)
    if (category) params.append("category", category)

    return this.request(`/products?${params.toString()}`)
  }

  async getProduct(id: number) {
    return this.request(`/products/${id}`)
  }

  // Order Service
  async createOrder(orderData: any) {
    return this.request("/orders", {
      method: "POST",
      body: JSON.stringify(orderData),
    })
  }

  async getOrders() {
    return this.request("/orders")
  }

  async getOrder(id: number) {
    return this.request(`/orders/${id}`)
  }
}

export const apiService = new ApiService()
