"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { Box, Container, Typography, Divider, Chip } from "@mui/material"
import type { Drink, OrderItem } from "../../types"
import "../../assets/styles/pages/products.css"
import "../../assets/styles/pages/cart.css"
import "../../assets/styles/components/button.css"
import Button from "../../components/Button"
import Cookies from "js-cookie"

const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const [drink, setDrink] = useState<Drink | null>(null)
  const [quantity, setQuantity] = useState(1)
  const navigate = useNavigate()

  const userCookie = Cookies.get("user")
  const user = userCookie ? JSON.parse(userCookie) : null
  const userId = user ? user.id : null

  useEffect(() => {
    const fetchDrink = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/drinks/${id}`)
        if (!response.ok) throw new Error("Drink not found")
        const data = await response.json()
        setDrink(data)
      } catch (error) {
        console.error("Error fetching drink:", error)
      }
    }

    fetchDrink()
  }, [id])

  if (!drink) {
    return (
      <Container maxWidth={false}>
        <Typography variant="h5" align="center">
          Loading...
        </Typography>
      </Container>
    )
  }

  // Tính giá theo kiểu VN: nhân với 23000 và làm tròn xuống
  const unitPrice = Math.floor(drink.price * 23000)
  const totalPrice = unitPrice * quantity

  // Thêm vào giỏ hàng với số lượng đã chọn
  const addToCart = () => {
    if (!userId) {
      navigate("/login")
      return
    }

    const cartStr = localStorage.getItem("cart")
    let cart: OrderItem[] = []

    if (cartStr) {
      try {
        cart = JSON.parse(cartStr)
      } catch {
        cart = []
      }
    }

    const existing = cart.find((item) => item.drinkId === drink.id)
    if (existing) {
      cart = cart.map((item) =>
        item.drinkId === drink.id ? { ...item, quantity: item.quantity + quantity, price: unitPrice } : item,
      )
    } else {
      cart.push({
        id: userId || "1",
        drinkId: drink.id,
        price: unitPrice,
        quantity: quantity,
        drinkName: drink.name || "",
        image: drink.image,
      })
    }

    localStorage.setItem("cart", JSON.stringify(cart))
    setQuantity(1)
    alert("Sản phẩm đã được thêm vào giỏ hàng thành công")
  }

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity >= 1) {
      setQuantity(newQuantity)
    }
  }

  return (
    <Container maxWidth={false} sx={{ py: 3 }}>
      {/* Back Button */}
      <Box sx={{ mb: 3 }}>
        <Button
          onClick={() => navigate(-1)}
          label="btn-back"
          name="Back"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            background: "#d2b48c",
            color: "white",
            border: "none",
            padding: "8px 16px",
            borderRadius: "20px",
            cursor: "pointer",
          }}
        />
      </Box>

      {/* Main Content */}
      <Box
        sx={{
          width: "100%",
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          gap: 4,
          bgcolor: "white",
          borderRadius: 2,
          p: 3,
          boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
        }}
      >
        {/* Product Image */}
        <Box
          sx={{
            width: { xs: "100%", md: "50%" },
            borderRadius: 2,
            overflow: "hidden",
            bgcolor: "#000",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Box
            component="img"
            src={drink.image}
            alt={drink.name}
            sx={{
              width: "100%",
              height: "auto",
              maxHeight: "500px",
              objectFit: "cover",
            }}
          />
        </Box>

        {/* Product Details */}
        <Box sx={{ flex: 1 }}>
          {/* Product Name */}
          <Typography
            variant="h3"
            gutterBottom
            sx={{
              fontWeight: "bold",
              color: "#333",
              fontSize: { xs: "2rem", md: "2.5rem" },
            }}
          >
            {drink.name}
          </Typography>

          {/* Product Info */}
          <Box sx={{ mb: 2, display: "flex", gap: 1, flexWrap: "wrap" }}>
            <Chip label={`Type: ${drink.type}`} variant="outlined" size="small" sx={{ color: "#666" }} />
            <Chip label={`Size: ${drink.size}`} variant="outlined" size="small" sx={{ color: "#666" }} />
          </Box>

          {/* Description */}
          <Typography
            variant="body1"
            paragraph
            sx={{
              color: "#666",
              lineHeight: 1.6,
              mb: 3,
            }}
          >
            {drink.description}
          </Typography>

          <Divider sx={{ my: 2 }} />

          {/* Pricing Section */}
          <Box sx={{ mb: 3 }}>
            {/* Unit Price */}
            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" sx={{ color: "#666", mb: 0.5 }}>
                Giá đơn vị:
              </Typography>
              <Typography
                variant="h5"
                sx={{
                  color: "#ff8c00",
                  fontWeight: "bold",
                }}
              >
                {unitPrice.toLocaleString("vi-VN")} VND
              </Typography>
            </Box>

            {/* Total Price (only show if quantity > 1) */}
            {quantity > 1 && (
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" sx={{ color: "#666", mb: 0.5 }}>
                  Tổng tiền ({quantity} sản phẩm):
                </Typography>
                <Typography
                  variant="h4"
                  sx={{
                    color: "#ff6b35",
                    fontWeight: "bold",
                  }}
                >
                  {totalPrice.toLocaleString("vi-VN")} VND
                </Typography>
              </Box>
            )}
          </Box>

          {/* Quantity Controls */}
          <Box sx={{ mb: 3 }}>
            <Typography variant="body2" sx={{ color: "#666", mb: 1 }}>
              Số lượng:
            </Typography>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 2,
                bgcolor: "#f5f5f5",
                borderRadius: "25px",
                padding: "8px 16px",
                width: "fit-content",
              }}
            >
              <Box
                component="button"
                onClick={() => handleQuantityChange(quantity - 1)}
                sx={{
                  width: "36px",
                  height: "36px",
                  borderRadius: "50%",
                  border: "none",
                  bgcolor: quantity > 1 ? "#ff8c00" : "#ccc",
                  color: "white",
                  cursor: quantity > 1 ? "pointer" : "not-allowed",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "18px",
                  fontWeight: "bold",
                  transition: "all 0.2s ease",
                  "&:hover": {
                    bgcolor: quantity > 1 ? "#e67c00" : "#ccc",
                    transform: quantity > 1 ? "scale(1.05)" : "none",
                  },
                }}
                disabled={quantity <= 1}
              >
                -
              </Box>

              <Typography
                variant="h6"
                sx={{
                  minWidth: "40px",
                  textAlign: "center",
                  fontWeight: "bold",
                  color: "#333",
                }}
              >
                {quantity}
              </Typography>

              <Box
                component="button"
                onClick={() => handleQuantityChange(quantity + 1)}
                sx={{
                  width: "36px",
                  height: "36px",
                  borderRadius: "50%",
                  border: "none",
                  bgcolor: "#ff8c00",
                  color: "white",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "18px",
                  fontWeight: "bold",
                  transition: "all 0.2s ease",
                  "&:hover": {
                    bgcolor: "#e67c00",
                    transform: "scale(1.05)",
                  },
                }}
              >
                +
              </Box>
            </Box>
          </Box>

          {/* Price Summary */}
          <Box
            sx={{
              bgcolor: "#fff8f0",
              border: "2px solid #ff8c00",
              borderRadius: 2,
              p: 2,
              mb: 3,
            }}
          >
            <Typography variant="body2" sx={{ color: "#666", mb: 1 }}>
              Tóm tắt đơn hàng:
            </Typography>
            <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
              <Typography variant="body2">
                {drink.name} x {quantity}
              </Typography>
              <Typography variant="body2" sx={{ fontWeight: "bold" }}>
                {totalPrice.toLocaleString("vi-VN")} VND
              </Typography>
            </Box>
            <Divider sx={{ my: 1 }} />
            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
              <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                Tổng cộng:
              </Typography>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: "bold",
                  color: "#ff6b35",
                }}
              >
                {totalPrice.toLocaleString("vi-VN")} VND
              </Typography>
            </Box>
          </Box>

          {/* Add to Cart Button */}
          <Button
            label="btn-card"
            name="Thêm vào giỏ"
            onClick={addToCart}
            style={{
              width: "100%",
              background: "#8b4513",
              color: "white",
              border: "none",
              padding: "16px 24px",
              borderRadius: "25px",
              fontSize: "16px",
              fontWeight: "bold",
              cursor: "pointer",
              transition: "all 0.3s ease",
              boxShadow: "0 4px 15px rgba(139, 69, 19, 0.3)",
            }}
          />
        </Box>
      </Box>
    </Container>
  )
}

export default ProductDetail
