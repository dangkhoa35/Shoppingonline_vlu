const express = require('express');
const path = require('path');
const cors = require('cors'); 
require('./utils/MongooseUtil');
const app = express();


// --- 1. MIDDLEWARE ---
app.use(cors()); 
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Phục vụ ảnh tĩnh
app.use('/images', express.static(path.join(__dirname, '../client-customer/public/images')));

// --- 2. MOUNT API ROUTES (Luôn đặt trên cùng) ---
app.use('/api/customer', require('./api/customer.js'));
app.use('/api/admin', require('./api/admin.js')); 

// --- 3. PHỤC VỤ CÁC FILE ĐÃ BUILD (FRONT-END) ---

// Cấu hình cho trang Admin
app.use('/admin', express.static(path.join(__dirname, '../client-admin/build')));

// SỬA TẠI ĐÂY: Dùng RegExp trực tiếp /^\/admin\/.*/ để khớp mọi đường dẫn bắt đầu bằng /admin/
app.get(/^\/admin\/.*/, (req, res) => {
  res.sendFile(path.join(__dirname, '../client-admin/build', 'index.html'));
});

// Cấu hình cho trang Khách hàng (Trang chủ)
app.use('/', express.static(path.join(__dirname, '../client-customer/build')));

// SỬA TẠI ĐÂY: Dùng RegExp /.*/ để khớp với tất cả các đường dẫn còn lại
app.get(/.*/, (req, res) => {
  res.sendFile(path.join(__dirname, '../client-customer/build', 'index.html'));
});

app.use('/admin', express.static(path.resolve(__dirname, '../client-admin/build')));
app.get('admin/*', (req, res) => {
  res.sendFile(path.resolve(__dirname, '../client-admin/build', 'index.html'))
});
app.use('/', express.static(path.resolve(__dirname, '../client-customer/build')));
app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, '../client-customer/build', 'index.html'));
});

// --- 4. START SERVER ---
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

