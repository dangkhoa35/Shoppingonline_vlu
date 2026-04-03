// require('../utils/MongooseUtil'); // Dòng này có thể bỏ nếu bác đã kết nối DB ở file index.js tổng
const Models = require('./index'); // QUAN TRỌNG: Phải trỏ đúng vào file index.js trong thư mục models
const mongoose = require('mongoose');

const CategoryDAO = {
  // Lấy tất cả danh mục để hiện lên Menu (iPhone, iPad, MacBook)
  async selectAll() {
    const query = {};
    const categories = await Models.Category.find(query).exec();
    return categories;
  },

  // Thêm danh mục mới
  async insert(category) {
    const result = await Models.Category.create(category);
    return result;
  },

  // Cập nhật tên danh mục
  async update(category) {
    const newvalues = { name: category.name };
    // Dùng _id thay vì id để đảm bảo khớp với MongoDB
    const result = await Models.Category.findByIdAndUpdate(category._id, newvalues, { new: true });
    return result;
  },

  // Xóa danh mục
  async delete(_id) {
    const result = await Models.Category.findByIdAndDelete(_id);
    return result;
  }
};

module.exports = CategoryDAO;