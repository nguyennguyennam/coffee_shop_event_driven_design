import { useState, useEffect } from "react";
import { Typography, Button, IconButton, Paper, TextField} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import Cookies from "js-cookie";
import "../../assets/styles/pages/cart.css"; // Import your CSS styles
import { OrderItem, Order } from "../../types";
import { useNavigate } from 'react-router-dom';


export default function CartPage() {
  const [cartItems, setCartItems] = useState<OrderItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [voucherCode, setVoucherCode] = useState<string>("");

  const navigate = useNavigate();

  // Load cart from localStorage on mount
  useEffect(() => {
    const cartStr = localStorage.getItem('cart');
    if (cartStr) {
      try {
        setCartItems(JSON.parse(cartStr));
      } catch {
        setCartItems([]);
      }
    }
  }, []);

  // Helper: update localStorage when cart changes
  const updateCart = (items: OrderItem[]) => {
    setCartItems(items);
    localStorage.setItem('cart', JSON.stringify(items));
  };

  const handleQuantityChange = (id: string, delta: number) => {
    updateCart(
      cartItems
        .map(item =>
          item.id === id ? { ...item, quantity: item.quantity + delta } : item
        )
        .filter(item => item.quantity > 0)
    );
  };

  const handleRemove = (id: string) => {
    updateCart(cartItems.filter(item => item.id !== id));
  };

  const handleCheckout = async () => {
    if (cartItems.length === 0) return;
    const userData = Cookies.get('user');
    const userId = userData ? JSON.parse(userData).id : null;
    if (!userId) {
      alert("Bạn cần đăng nhập để đặt hàng.");
      navigate('/login');
      return;
    }
    setIsLoading(true);
    setOrderSuccess(false);

    const totalPrice = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

    // Giả lập customerId và customerType
    const orderData = {
      customerId: userId, // Bạn có thể lấy từ localStorage hoặc auth context
      voucherCode: voucherCode || null, // Nếu có voucher thì gửi, nếu không thì null
      totalPrice,
      customerType: 0, // Ví dụ: 0 = Regular
      items: cartItems.map(item => ({
        drinkId: item.drinkId,  // <- dùng `drinkId` thay vì `id` vì DTO yêu cầu là drinkId
        quantity: item.quantity,
        drinkName: item.drinkName
      }))
    };

    try {
      const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/order`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderData)
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.message || "Đặt hàng thất bại");
      }

      const createdOrder = await response.json();
      updateCart([]);
      setOrderSuccess(true);
      alert("Đặt hàng thành công! Mã đơn hàng: " + createdOrder.id);

      // Đảm bảo id là string khi truyền cho navigate
      if (createdOrder.id) {
        navigate(`/checkout/${String(createdOrder.id)}`, { state: { orderId: createdOrder.id } });
      } else {
        alert("Không lấy được mã đơn hàng từ server.");
      }

    } catch (err: any) {
      alert("Lỗi khi đặt hàng: " + err.message);
    } finally {
      setIsLoading(false);
    }
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
                alt={item.drinkName || ""}
                style={{ width: 80, height: 80, borderRadius: 8, objectFit: "cover" }}
              />
              <div className="cart-item-info">
                <div className="cart-item-name">{item.drinkName}</div>
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

            <div style={{ marginBottom: 12 }}>
              <TextField
                label="Nhập Voucher"
                variant="outlined"
                size="small"
                fullWidth
                value={voucherCode}
                onChange={(e) => setVoucherCode(e.target.value)}
              />
            </div>
            <button
              className="btn-login"
              onClick={handleCheckout}
              disabled={isLoading || cartItems.length === 0}
            >
              {isLoading ? "Đang xử lý..." : "Mua hàng"}
            </button>
            <button className="btn-continue">Tiếp tục mua sắm</button>
            {orderSuccess && (
              <div style={{ color: "green", marginTop: 12 }}>Đặt hàng thành công!</div>
            )}
        </div>
      </div>
    </div>
  );
}
