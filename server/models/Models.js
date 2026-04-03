const mongoose = require('mongoose');

// 1. Admin Schema
const AdminSchema = mongoose.Schema({
  username: { type: String, required: true },
  password: { type: String, required: true }
}, { versionKey: false });

// 2. Category Schema
const CategorySchema = mongoose.Schema({
  name: { type: String, required: true }
}, { versionKey: false });

// 3. Customer Schema
const CustomerSchema = mongoose.Schema({
  username: { type: String, required: true },
  password: { type: String, required: true },
  name: { type: String, required: true },
  phone: { type: String, required: true },
  email: { type: String, required: true },
  active: { type: Number, default: 0 },
  token: String
}, { versionKey: false });

// 4. Product Schema
const ProductSchema = mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  image: String,
  cdate: { type: Number, default: Date.now },
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' }
}, { versionKey: false });

// 5. Item Schema
const ItemSchema = mongoose.Schema({
  product_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  quantity: { type: Number, required: true }
}, { versionKey: false, _id: false });

// 6. Order Schema
const OrderSchema = mongoose.Schema({
  cdate: { type: Number, default: Date.now },
  total: { type: Number, required: true },
  status: { type: String, default: 'PENDING' },
  customer_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer', required: true },
  items: [ItemSchema]
}, { versionKey: false });

// Tạo Models
const Admin = mongoose.models.Admin || mongoose.model('Admin', AdminSchema);
const Category = mongoose.models.Category || mongoose.model('Category', CategorySchema);
const Customer = mongoose.models.Customer || mongoose.model('Customer', CustomerSchema);
const Product = mongoose.models.Product || mongoose.model('Product', ProductSchema);
const Order = mongoose.models.Order || mongoose.model('Order', OrderSchema);

module.exports = { Admin, Category, Customer, Product, Order };