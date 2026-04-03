const mongoose = require('mongoose');

// 1. Định nghĩa Schemas (giữ nguyên cấu trúc)
const CategorySchema = new mongoose.Schema({
  name: { type: String, required: true }
}, { versionKey: false });

const ProductSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  image: { type: String, required: true },
  cdate: { type: Number, default: Date.now() },
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' }
}, { versionKey: false });

const OrderSchema = new mongoose.Schema({
  customer_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer' },
  cdate: { type: Number, default: Date.now },
  total: { type: Number, default: 0 },
  status: { type: String, default: 'PENDING' },
  items: [{
    product_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    quantity: { type: Number, required: true }
  }]
}, { versionKey: false });

// 2. Kiểm tra nếu model đã tồn tại thì dùng lại, nếu chưa thì mới tạo mới
const Category = mongoose.models.Category || mongoose.model('Category', CategorySchema);
const Product = mongoose.models.Product || mongoose.model('Product', ProductSchema);
const Order = mongoose.models.Order || mongoose.model('Order', OrderSchema);

module.exports = { Category, Product, Order };