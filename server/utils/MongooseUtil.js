const mongoose = require('mongoose');
const MyConstants = require('./MyConstants');

// Sử dụng encodeURIComponent để mã hóa User và Pass nếu có ký tự đặc biệt
const user = encodeURIComponent(MyConstants.DB_USER);
const pass = encodeURIComponent(MyConstants.DB_PASS);
const host = MyConstants.DB_SERVER;
const db = MyConstants.DB_DATABASE;

const uri = `mongodb+srv://${user}:${pass}@${host}/${db}`;

mongoose.connect(uri)
  .then(() => { 
    console.log('Connected to ' + MyConstants.DB_SERVER + '/' + MyConstants.DB_DATABASE); 
  })
  .catch((err) => { 
    console.error('Lỗi kết nối MongoDB:', err); 
  });