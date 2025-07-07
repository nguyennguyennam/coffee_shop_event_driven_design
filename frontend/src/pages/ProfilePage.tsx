import React from 'react';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';
import '../assets/styles/pages/profile.css';

export default function ProfilePage() {
  const navigate = useNavigate();
  
  // Lấy thông tin user từ cookie
  const userCookie = Cookies.get('user');
  const user = userCookie ? JSON.parse(userCookie) : null;

  const handleLogout = () => {
    Cookies.remove('user'); // Xóa cả user và token
    navigate('/login');
  };

  if (!user) {
    return (
      <div className="error">
        <p>Bạn chưa đăng nhập!</p>
        <button onClick={() => navigate('/login')}>Đến trang đăng nhập</button>
      </div>
    );
  }

  return (
    <div className="profile-container">
      <h1>Trang Cá Nhân</h1>
      <div className="profile-card">
        <div className="avatar">
          <img 
            src={`https://img.freepik.com/premium-vector/cartoon-coffee-cup-with-glasses_811482-178.jpg`} 
            alt="Avatar" 
          />
        </div>
        <div className="user-info">
          <p><strong>ID:</strong> {user.id}</p>
          <p><strong>Tên:</strong> {user.name}</p>
          <p><strong>Email:</strong> {user.email}</p>
        </div>
        <button onClick={handleLogout} className="logout-btn">
          Đăng Xuất
        </button>
      </div>
    </div>
  );
}