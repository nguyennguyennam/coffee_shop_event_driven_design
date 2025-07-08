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
      const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/login`, {
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
    <div>
      <h1 className="page-title">Đăng nhập</h1>
      <div className="login-form">
        <h3 style={{ textAlign: 'center', marginBottom: '24px', color: '#8B4513' }}>Chào mừng trở lại!</h3>
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

        <div className="remember-info">
          <label className="label-remember">
            <input type="checkbox" className="mr-2" /> Ghi nhớ đăng nhập
          </label>
          <a href="#" style={{color: '#8B4513', textDecoration: 'none', fontSize: '14px' }}>Quên mật khẩu?</a>
        </div>

        <button className="btn-login" onClick={handleLogin}>Đăng nhập</button>

        <p className="signup-info">
          Chưa có tài khoản? <a href="#">Đăng ký ngay</a>
        </p>
      </div>
    </div>
  );
}
