import React, { useState } from "react";
import { Container, Box, Typography, Button, IconButton, Paper, Grid } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import "../index.css"; // Import global styles
import "../assets/styles/pages/cart.css"; // Import your CSS styles


interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

export default function CartPage() {
  const [cartItems, setCartItems] = useState<CartItem[]>([
    {
      id: 1,
      name: "Coffee",
      price: 45000,
      quantity: 2,
      image: "/media/coffee.png",
    },
    {
      id: 2,
      name: "Tea",
      price: 55000,
      quantity: 1,
      image: "/media/tea.png",
    },
  ]);

  const handleQuantityChange = (id: number, delta: number) => {
    setCartItems(prev =>
      prev
        .map(item =>
          item.id === id ? { ...item, quantity: item.quantity + delta } : item
        )
        .filter(item => item.quantity > 0)
    );
  };

  const handleRemove = (id: number) => {
    setCartItems(prev => prev.filter(item => item.id !== id));
  };

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const total = subtotal;

  return (
    <div>
      <Typography variant="h4" className="page-title">
        🛒 Giỏ hàng của bạn
      </Typography>
      <p style={{ textAlign: "center", color: "#666", marginBottom: "32px" }}>
        {cartItems.length} sản phẩm trong giỏ hàng
      </p>

      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "32px" }}>
        <div>
          {cartItems.map(item => (
            <Paper key={item.id} >
          <div className="cart-item">
              <img
                src={item.image}
                alt={item.name}
                style={{ width: 80, height: 80, borderRadius: 8, objectFit: "cover" }}
              />
              <div className="cart-item-info">
                <div className="cart-item-name">{item.name}</div>
                <div className="cart-item-price">{item.price.toLocaleString("vi-VN")}đ</div>
              </div>
              <div className="quantity-controls">
                <button className="quantity-btn" onClick={() => handleQuantityChange(item.id, -1)}>
                  -
                </button>
                <Typography variant="body1" sx={{ mx: 1 }}>
                  {item.quantity}
                </Typography>
                <button className="quantity-btn" onClick={() => handleQuantityChange(item.id, 1)}>
                  +
                </button>
              </div>

              <div style={{ marginLeft: 16, textAlign: "right" }}>
                <Typography variant="subtitle1" fontWeight="bold">
                  {(item.price * item.quantity).toLocaleString("vi-VN")}đ
                </Typography>
                <IconButton onClick={() => handleRemove(item.id)} color="error">
                    <DeleteIcon />
                </IconButton>
              </div>
            </div>
          </Paper>
        ))}
      </div>

        <div style={{ background: "white", padding: "24px", borderRadius: "16px", height: "fit-content", boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}>
          <h3 style={{marginBottom: 20, color: "#8B4513"}}>Chi tiết đơn hàng</h3>
            <div style={{display: "flex", justifyContent: "space-between", marginBottom: 12}}>
              <span>Tạm tính:</span>
              <span>{subtotal.toLocaleString("vi-VN")}đ</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
            </div>
            <hr style={{ margin: "16px 0" }} />

            <div style={{ display: "flex", justifyContent: "space-between", fontWeight: "bold", marginBottom: "16px" }}>
              <span>Tổng cộng:</span>
              <span style={{ color: "#1976d2" }}>{total.toLocaleString("vi-VN")}đ</span>
            </div>
            <button className="btn-login">💳 Thanh toán</button>
            <button className="btn-continue">Tiếp tục mua sắm</button>
        </div>
      </div>
    </div>
  );
}
        