import React, { useContext, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import MyContext from '../contexts/MyContext'; // Nhớ kiểm tra đường dẫn này nhé Vũ

import Menu from './MenuComponent';
import Inform from './InformComponent';
import Home from './HomeComponent';
import Product from './ProductComponent';
import ProductDetail from './ProductDetailComponent';
import Login from './LoginComponent';
import Signup from './SignupComponent';
import Myprofile from './MyprofileComponent';
import Mycart from './MycartComponent';
import Myorders from './MyordersComponent';

function Main() {
  // Lấy hàm setCustomer và setToken từ Context
  const { setCustomer, setToken } = useContext(MyContext);

  useEffect(() => {
    // --- BƯỚC QUAN TRỌNG: Lấy lại "trí nhớ" khi F5 ---
    const savedCustomer = localStorage.getItem('customer');
    const savedToken = localStorage.getItem('token');

    if (savedCustomer && savedToken) {
      // Nếu có dữ liệu trong máy, nạp ngược lại vào Context
      setCustomer(JSON.parse(savedCustomer));
      setToken(savedToken);
      console.log("Đã khôi phục phiên đăng nhập cho:", JSON.parse(savedCustomer).name);
    }
  }, [setCustomer, setToken]); // Chạy duy nhất 1 lần khi ứng dụng khởi chạy

  return (
    <div className="body-customer">
      <Menu />
      <Inform />
      <Routes>
        <Route path='/' element={<Navigate replace to='/home' />} />
        <Route path='/home' element={<Home />} />
        <Route path='/login' element={<Login />} />
        <Route path='/signup' element={<Signup />} />
        <Route path='/profile' element={<Myprofile />} />
        <Route path='/product/search/:keyword' element={<Product />} />
        <Route path='/product/:id' element={<ProductDetail />} />
        <Route path='/product/category/:cid' element={<Product />} />
        <Route path='/mycart' element={<Mycart />} />
        <Route path='/myorders' element={<Myorders />} />
      </Routes>
    </div>
  );
}

export default Main;