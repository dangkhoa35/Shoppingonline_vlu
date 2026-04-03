const mongoose = require('mongoose');
const Models = require('./models/index');

const uri = "mongodb+srv://khoa030577_db_user:Dangkhoa3525@cluster.yc1srse.mongodb.net/shoppingonline";

async function seedDB() {
  try {
    await mongoose.connect(uri);
    console.log("Đã kết nối thành công để cập nhật DB...");

    // 1. Xóa sạch dữ liệu cũ
    await Models.Category.deleteMany({});
    await Models.Product.deleteMany({});
    console.log("Đã dọn dẹp dữ liệu cũ.");

    // 2. Tạo 3 danh mục chính
    const cats = await Models.Category.insertMany([
      { name: 'iPhone' },
      { name: 'iPad' },
      { name: 'MacBook' }
    ]);
    console.log("Đã tạo 3 danh mục: iPhone, iPad, MacBook.");

    const iphoneId = cats.find(c => c.name === 'iPhone')._id;
    const ipadId = cats.find(c => c.name === 'iPad')._id;
    const macbookId = cats.find(c => c.name === 'MacBook')._id;

    // 3. Tạo 9 sản phẩm (mỗi danh mục 3 sản phẩm)
    const products = [
      // Danh mục iPhone
      { name: 'iPhone 15 Pro Max', price: 34990000, image: '/images/iphone15-Photoroom.png', category: iphoneId, cdate: Date.now() },
      { name: 'iPhone 16 Pro Max', price: 27500000, image: '/images/iphone16-Photoroom.png', category: iphoneId, cdate: Date.now() },
      { name: 'iPhone 13 Mini', price: 15900000, image: '/images/iphone15-Photoroom.png', category: iphoneId, cdate: Date.now() },
      
      // Danh mục iPad
      { name: 'iPad Pro M2 12.9', price: 31000000, image: '/images/iphone15-Photoroom.png', category: ipadId, cdate: Date.now() },
      { name: 'iPad Air 5 M1', price: 16500000, image: '/images/iphone15-Photoroom.png', category: ipadId, cdate: Date.now() },
      { name: 'iPad Gen 10', price: 10900000, image: '/images/iphone15-Photoroom.png', category: ipadId, cdate: Date.now() },

      // Danh mục MacBook
      { name: 'MacBook Pro 14 M3', price: 49900000, image: '/images/iphone15-Photoroom.png', category: macbookId, cdate: Date.now() },
      { name: 'MacBook Air M2', price: 26500000, image: '/images/iphone15-Photoroom.png', category: macbookId, cdate: Date.now() },
      { name: 'MacBook Air M1', price: 18900000, image: '/images/iphone15-Photoroom.png', category: macbookId, cdate: Date.now() }
    ];

    const insertedProducts = await Models.Product.insertMany(products);
    console.log("Đã nạp thành công 9 sản phẩm mẫu!");

    // Thêm một số orders để có hot products
    const iphone15 = insertedProducts.find(p => p.name === 'iPhone 15 Pro Max');
    const iphone16 = insertedProducts.find(p => p.name === 'iPhone 16 Pro Max');
    const ipadPro = insertedProducts.find(p => p.name === 'iPad Pro M2 12.9');

    const orders = [
      {
        customer_id: null, // Không cần customer cho hot products
        items: [
          { product_id: iphone15._id, quantity: 5 },
          { product_id: iphone16._id, quantity: 3 }
        ],
        status: 'APPROVED',
        cdate: Date.now()
      },
      {
        customer_id: null,
        items: [
          { product_id: ipadPro._id, quantity: 4 },
          { product_id: iphone15._id, quantity: 2 }
        ],
        status: 'APPROVED',
        cdate: Date.now()
      }
    ];

    await Models.Order.insertMany(orders);
    console.log("Đã nạp thành công orders mẫu cho hot products!");

    mongoose.connection.close();
    console.log("Đã ngắt kết nối. Bác hãy kiểm tra giao diện nhé!");
  } catch (err) {
    console.error("Lỗi khi cập nhật dữ liệu:", err);
  }
}

seedDB();