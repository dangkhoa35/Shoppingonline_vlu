const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

// DAOs
const CategoryDAO = require('../models/CategoryDAO');
const ProductDAO = require('../models/ProductDAO');
const CustomerDAO = require('../models/CustomerDAO');
const OrderDAO = require('../models/OrderDAO');

// Utils
const CryptoUtil = require('../utils/CryptoUtil');
const JwtUtil = require('../utils/JwtUtil');
// Bỏ EmailUtil ở đây nếu bạn không dùng đến để tránh nặng máy

// ==========================================
// 1. ROUTE CHO TRANG CHỦ (Home & Menu)
// ==========================================

router.get('/categories', async function (req, res) {
  const categories = await CategoryDAO.selectAll();
  res.json(categories);
});

router.get('/products/new', async function (req, res) {
  const products = await ProductDAO.selectTopNew(3);
  res.json(products);
});

router.get('/products/hot', async function (req, res) {
  const products = await ProductDAO.selectTopHot(3);
  res.json(products);
});

router.get('/products/category/:cid', async function (req, res) {
  const cid = req.params.cid;
  const products = await ProductDAO.selectByCatID(cid);
  res.json(products);
});

router.get('/products/search/:keyword', async function (req, res) {
  const keyword = req.params.keyword;
  const products = await ProductDAO.selectByKeyword(keyword);
  res.json(products);
});

router.get('/products/:id', async function (req, res) {
  const id = req.params.id;
  const product = await ProductDAO.selectByID(id);
  res.json(product);
});

// ==========================================
// 2. ROUTE CHO KHÁCH HÀNG (Signup, Login, Active)
// ==========================================

// Đăng ký - FIX TRIỆT ĐỂ LỖI 500 SMTP
router.post('/signup', async function (req, res) {
  try {
    const { username, password, name, phone, email } = req.body;
    
    // Kiểm tra tồn tại (Lưu ý: Nếu CustomerDAO của bạn dùng '0' thì sửa Or thành 0r)
    const dbCust = await CustomerDAO.selectByUsernameOrEmail(username, email);
    
    if (dbCust) {
      return res.json({ success: false, message: 'Username hoặc Email đã tồn tại!' });
    }

    const now = new Date().getTime();
    const token = CryptoUtil.md5(now.toString());
    
    // Tự động kích hoạt (active: 1) để không cần gửi mail thật
    const newCust = { 
      username, 
      password, 
      name, 
      phone, 
      email, 
      active: 1, 
      token: token 
    }; 
    
    const result = await CustomerDAO.insert(newCust);
    
    if (result) {
      // Trả về JSON chuẩn, không gọi bất kỳ hàm gửi mail nào ở đây
      return res.json({ success: true, message: 'Đăng ký thành công! Bạn có thể đăng nhập ngay.' });
    } else {
      return res.json({ success: false, message: 'Lỗi khi lưu vào cơ sở dữ liệu!' });
    }
  } catch (error) {
    console.error("Signup Error:", error);
    // Trả về 200 kèm success: false thay vì 500 để tránh hiện popup lỗi SMTP ở Frontend
    res.json({ success: false, message: 'Lỗi hệ thống: ' + error.message });
  }
});

router.post('/active', async function (req, res) {
  const { id, token } = req.body;
  const result = await CustomerDAO.active(id, token, 1);
  res.json(result);
});

router.post('/login', async function (req, res) {
  const { username, password } = req.body;
  const customer = await CustomerDAO.selectByUsernameAndPassword(username, password);
  if (customer) {
    if (customer.active === 1) {
      const token = JwtUtil.genToken(customer.username, customer.password);
      res.json({ success: true, message: 'Đăng nhập thành công!', token: token, customer: customer });
    } else {
      res.json({ success: false, message: 'Tài khoản chưa được kích hoạt!' });
    }
  } else {
    res.json({ success: false, message: 'Sai Username hoặc Password!' });
  }
});

router.put('/customers/:id', JwtUtil.checkToken, async function (req, res) {
  const id = req.params.id;
  const { username, password, name, phone, email } = req.body;
  const result = await CustomerDAO.update(id, { username, password, name, phone, email });
  res.json(result);
});

// ==========================================
// 3. THANH TOÁN & ĐƠN HÀNG
// ==========================================

router.post('/checkout', JwtUtil.checkToken, async function (req, res) {
  try {
    const now = new Date().getTime();
    const { total, customer, items } = req.body;

    // Ép kiểu ID khách hàng về ObjectId để tìm kiếm được trong My Orders
    let custId = customer?._id;
    if (mongoose.Types.ObjectId.isValid(custId)) {
      custId = new mongoose.Types.ObjectId(custId);
    }

    const order = {
      cdate: now,
      total: total,
      status: 'PENDING',
      customer_id: custId,
      items: (items || []).map((item) => ({
        product_id: new mongoose.Types.ObjectId(item.product?._id || item.product_id),
        quantity: item.quantity
      }))
    };

    const result = await OrderDAO.insert(order);
    res.json(result ? { success: true } : { success: false });
  } catch (err) {
    res.json({ success: false, message: err.message });
  }
});

router.get('/orders/customer/:cid', JwtUtil.checkToken, async function (req, res) {
  const _cid = req.params.cid;
  const orders = await OrderDAO.selectByCustID(_cid);
  res.json(orders);
});

module.exports = router;