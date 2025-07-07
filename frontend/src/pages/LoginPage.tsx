import React, { useState } from 'react';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom'; // 👈 import useNavigate
import jwt_decode from 'jwt-decode';
import '../assets/styles/pages/login.css';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const navigate = useNavigate(); // 👈 khởi tạo navigator

  const handleLogin = async () => {
    try {
      const response = await fetch('https://coffee-shop-1-qiwh.onrender.com/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      console.log('Response data:', data); // 👈 log dữ liệu trả về

      if (response.ok) {
        console.log('Đăng nhập thành công!', data);
        Cookies.set('user', JSON.stringify({
          id: data.id,
          name: data.name,
          email: data.email,
          token: data.token // Lưu cả token để gọi API sau này
        }), { expires: 1/12 }); // 2 tiếng


        // 👉 Chuyển hướng sang trang profile
        navigate('/profile');
      } else {
        setErrorMsg(data.message || 'Đăng nhập thất bại');
      }
    } catch (error) {
      setErrorMsg('Lỗi kết nối đến máy chủ');
      console.error('Lỗi đăng nhập:', error);
    }
  };

  return (
    <div className="page" id="login">
      <h1 className="page-title">Đăng nhập</h1>
      <div className="login-form">
        <h3 className="text-center mb-6 text-gray-500">Chào mừng trở lại!</h3>
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            placeholder="Nhập email của bạn"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Mật khẩu</label>
          <input
            type="password"
            id="password"
            placeholder="Nhập mật khẩu"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        {errorMsg && <p className="text-red-500 text-sm mb-4">{errorMsg}</p>}

        <div className="flex justify-between items-center mb-6 text-sm">
          <label className="flex items-center">
            <input type="checkbox" className="mr-2" /> Ghi nhớ đăng nhập
          </label>
          <a href="#" className="text-[#8B4513]">Quên mật khẩu?</a>
        </div>

        <button className="btn-login" onClick={handleLogin}>Đăng nhập</button>

        <div className="text-center my-6 text-gray-500">── Hoặc ──</div>

        <div className="flex gap-3">
          <button className="flex-1 border border-[#db4437] text-[#db4437] rounded-lg p-3">📧 Google</button>
          <button className="flex-1 border border-[#4267B2] text-[#4267B2] rounded-lg p-3">📘 Facebook</button>
        </div>

        <p className="text-center mt-6 text-gray-600 text-sm">
          Chưa có tài khoản? <a href="#" className="text-[#8B4513]">Đăng ký ngay</a>
        </p>
      </div>
    </div>
  );
}
