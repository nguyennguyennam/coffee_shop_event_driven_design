import React, { useState } from "react"
import "../assets/styles/pages/cart.css"
import "../index.css"

interface CartItem {
  id: number
  name: string
  price: number
  quantity: number
  image: string
}

export default function CartPage() {
  const [cartItems, setCartItems] = useState<CartItem[]>(
    [
      {
        id: 1,
        name: "Coffee",
        price: 45000,
        quantity: 2,
        image:
          "/media/coffee.png",
      },
      {
        id: 2,
        name: "Tea",
        price: 55000,
        quantity: 1,
        image:
          "/media/tea.png",
      },
    ]
  )

  const handleQuantityChange = (id: number, delta: number) => {
    setCartItems((prev) =>
      prev
        .map(
          (item) =>
            item.id === id
              ? { ...item, quantity: item.quantity + delta }
              : item
        )
        .filter((item) => item.quantity > 0)
    )
  }

  const handleRemove = (id: number) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id))
  }

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  )
  const shippingFee = cartItems.length > 0 ? 25000 : 0
  const total = subtotal + shippingFee

  return (
    <div className="page" id="cart">
      <h1 className="page-title">🛒 Giỏ hàng của bạn</h1>
      <p className="text-center text-gray-500 mb-8">{cartItems.length} sản phẩm trong giỏ hàng</p>

      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "32px" }}>
        <div>
          {cartItems.map((item) => (
            <div
              key={item.id}
              className="cart-item"
            >
              <img
                src={item.image}
                alt={item.name}
                className="w-20 h-20 rounded object-cover"
              />
              <div className="cart-item-info">
                <div className="cart-item-name">{item.name}</div>
                <div className="text-gray-600">
                  {item.price.toLocaleString("vi-VN")}đ
                </div>
              </div>
              
              <div className="quantity-controls">
                <button
                  onClick={() => handleQuantityChange(item.id, -1)}
                  className="quantity-btn"
                >
                  -
                </button>
                <span className="font-bold">{item.quantity}</span>
                <button
                  onClick={() => handleQuantityChange(item.id, 1)}
                  className="quantity-btn"
                >
                  +
                </button>
              </div>

              <div style={{ marginLeft: 16, textAlign: "right" }}>
                <div style={{ fontWeight: 700, fontSize: "1.1rem" }}>
                  {(item.price * item.quantity).toLocaleString("vi-VN")}đ
                </div>
                <button
                  onClick={() => handleRemove(item.id)}
                  style={{ background: "none", border: "none", color: "#dc3545", cursor: "pointer" }}
                >
                  🗑️
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-white p-6 rounded-xl shadow-md h-fit">
          <h3 className="text-[#8B4513] mb-5 font-semibold">Tóm tắt đơn hàng</h3>
          <div className="flex justify-between mb-3">
            <span>Tạm tính:</span>
            <span>{subtotal.toLocaleString("vi-VN")}đ</span>
          </div>
          <div className="flex justify-between mb-3">
            <span>Phí vận chuyển:</span>
            <span>{shippingFee.toLocaleString("vi-VN")}đ</span>
          </div>
          <hr className="my-4" />
          <div className="flex justify-between font-bold text-lg mb-6">
            <span>Tổng cộng:</span>
            <span className="text-[#8B4513]">{total.toLocaleString("vi-VN")}đ</span>
          </div>
          <button className="w-full bg-[#8B4513] text-white py-3 rounded-lg mb-3 hover:bg-[#7A3F0D]">
            💳 Thanh toán
          </button>
          <button className="w-full border border-[#8B4513] text-[#8B4513] py-3 rounded-lg hover:bg-gray-50">
            Tiếp tục mua sắm
          </button>
        </div>
      </div>
    </div>
  )
}
