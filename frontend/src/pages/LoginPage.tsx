// src/pages/LoginPage.tsx
import React from 'react';
import '../assets/styles/pages/login.css';

export default function LoginPage() {
  return (
    <div className="page" id="login">
      <h1 className="page-title">Đăng nhập</h1>
      <div className="login-form">
        <h3 className="text-center mb-6 text-gray-500">Chào mừng trở lại!</h3>
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input type="email" id="email" placeholder="Nhập email của bạn" />
        </div>
        <div className="form-group">
          <label htmlFor="password">Mật khẩu</label>
          <input type="password" id="password" placeholder="Nhập mật khẩu" />
        </div>
        <div className="flex justify-between items-center mb-6 text-sm">
          <label className="flex items-center">
            <input type="checkbox" className="mr-2" /> Ghi nhớ đăng nhập
          </label>
          <a href="#" className="text-[#8B4513]">Quên mật khẩu?</a>
        </div>
        <button className="btn-login">Đăng nhập</button>
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
