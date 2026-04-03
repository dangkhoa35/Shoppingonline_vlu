const express = require('express');
const router = express.Router();
const JwtUtil = require('../utils/JwtUtil');

const AdminDAO = require('../models/AdminDAO');
const CategoryDAO = require('../models/CategoryDAO');
const ProductDAO = require('../models/ProductDAO');
const OrderDAO = require('../models/OrderDAO');
const CustomerDAO = require('../models/CustomerDAO');
const EmailUtil = require('../utils/EmailUtil');

// ===================== LOGIN & TOKEN =====================
router.post('/login', async function (req, res) {
  const { username, password } = req.body;
  if (username && password) {
    const admin = await AdminDAO.selectByUsernameAndPassword(username, password);
    if (admin) {
      const token = JwtUtil.genToken(username, password);
      res.json({ success: true, message: 'Authentication successful', token: token });
    } else {
      res.json({ success: false, message: 'Incorrect username or password' });
    }
  } else {
    res.json({ success: false, message: 'Please input username and password' });
  }
});

router.get('/token', JwtUtil.checkToken, function (req, res) {
  const token = req.headers['x-access-token'] || req.headers['authorization'];
  res.json({ success: true, message: 'Token is valid', token: token });
});

// ===================== CATEGORY =====================
router.get('/categories', JwtUtil.checkToken, async function (req, res) {
  const categories = await CategoryDAO.selectAll();
  res.json(categories);
});

router.post('/categories', JwtUtil.checkToken, async function (req, res) {
  const name = req.body.name;
  const result = await CategoryDAO.insert({ name: name });
  res.json(result);
});

router.put('/categories/:id', JwtUtil.checkToken, async function (req, res) {
  const id = req.params.id;
  const name = req.body.name;
  const result = await CategoryDAO.update({ _id: id, name: name });
  res.json(result);
});

router.delete('/categories/:id', JwtUtil.checkToken, async function (req, res) {
  const id = req.params.id;
  const result = await CategoryDAO.delete(id);
  res.json(result);
});

// ===================== PRODUCT (Bổ sung cho đủ bộ Lab) =====================
router.get('/products', JwtUtil.checkToken, async function (req, res) {
  const products = await ProductDAO.selectAll();
  res.json(products);
});

router.post('/products', JwtUtil.checkToken, async function (req, res) {
  const result = await ProductDAO.insert(req.body);
  res.json(result);
});

router.put('/products/:id', JwtUtil.checkToken, async function (req, res) {
  const result = await ProductDAO.update(req.body);
  res.json(result);
});

router.delete('/products/:id', JwtUtil.checkToken, async function (req, res) {
  const result = await ProductDAO.delete(req.params.id);
  res.json(result);
});

// ===================== ORDER (Lab 08) =====================
router.get('/orders', JwtUtil.checkToken, async function (req, res) {
  const orders = await OrderDAO.selectAll();
  res.json(orders);
});

router.put('/orders/status/:id', JwtUtil.checkToken, async function (req, res) {
  const _id = req.params.id;
  const newStatus = req.body.status;
  const result = await OrderDAO.update(_id, newStatus);
  res.json(result);
});

// ===================== CUSTOMER (Lab 09) =====================
router.get('/customers', JwtUtil.checkToken, async function (req, res) {
  const customers = await CustomerDAO.selectAll();
  res.json(customers);
});

// ĐÂY LÀ ROUTE QUAN TRỌNG ĐỂ HIỆN 2 BẢNG CÒN LẠI
router.get('/orders/customer/:cid', JwtUtil.checkToken, async function (req, res) {
  const _cid = req.params.cid;
  const orders = await OrderDAO.selectByCustID(_cid);
  res.json(orders);
});

router.put('/customers/deactive/:id', JwtUtil.checkToken, async function (req, res) {
  const _id = req.params.id;
  const token = req.body.token;
  const result = await CustomerDAO.active(_id, token, 0);
  res.json(result);
});

router.get('/customers/sendmail/:id', JwtUtil.checkToken, async function (req, res) {
  const _id = req.params.id;
  const cust = await CustomerDAO.selectByID(_id);
  if (cust) {
    const send = await EmailUtil.send(cust.email, cust._id, cust.token);
    res.json({ success: !!send, message: send ? 'Please check email' : 'Email failure' });
  } else {
    res.json({ success: false, message: 'Not exists customer' });
  }
});

module.exports = router;