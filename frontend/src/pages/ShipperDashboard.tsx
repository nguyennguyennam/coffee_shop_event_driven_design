// src/pages/ShipperDashboard.js

import React, { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import '../assets/styles/pages/shipper.css';

type OrderItem = {
  DrinkName: string;
  Quantity: number;
};

type Order = {
  OrderId: string;
  CustomerId: string;
  OrderItems: OrderItem[];
  Price: number;
  Status: string;
};

export default function ShipperDashboard() {
  const [orders, setOrders] = useState<Order[]>([]);

  // Giả lập gọi API (sẽ thay bằng WebSocket hoặc Kafka listener sau)
useEffect(() => {
  const fetchOrders = async () => {
    try {
      const userCookie = Cookies.get('user');
      const token = userCookie ? JSON.parse(userCookie).token : '';
      const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/shipper/orders`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        setOrders(data);
      }
    } catch (err) {
      console.error('Lỗi lấy danh sách đơn hàng:', err);
    }
  };

  fetchOrders(); // <-- GỌI fetchOrders ở đây
}, []);

  // Function to handle shipping an order
  const handleShip = async (orderId: string) => {
    try {
      const userCookie = Cookies.get('user');
      const token = userCookie ? JSON.parse(userCookie).token : '';
      const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/shipper/ship/${orderId}`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        setOrders((prev) =>
          prev.map((o) =>
            o.OrderId === orderId ? { ...o, Status: 'Shipped' } : o
          )
        );
      }
    } catch (err) {
      console.error('Lỗi giao hàng:', err);
    }
  };



  return (
    <div className="shipper-dashboard">
      <h2>📦 Đơn hàng cần giao</h2>
      {orders.length === 0 ? (
        <p>Chưa có đơn hàng.</p>
      ) : (
        <ul>
          {orders.map((order) => (
            <li key={order.OrderId} className="order-card">
              <p><strong>Khách hàng:</strong> {order.CustomerId}</p>
              <p><strong>Món:</strong> {order.OrderItems.map(i => `${i.DrinkName} (x${i.Quantity})`).join(', ')}</p>
              <p><strong>Giá:</strong> ${order.Price}</p>
              <p><strong>Trạng thái:</strong> {order.Status}</p>
              {order.Status === 'Pending' && (
                <button onClick={() => handleShip(order.OrderId)}>🚚 Giao hàng</button>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
