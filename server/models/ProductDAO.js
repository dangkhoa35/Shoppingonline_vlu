const Models = require('./index'); // Import Models chứa Product và Order

const ProductDAO = {
  // Lấy chi tiết một sản phẩm theo ID
  async selectByID(_id) {
    // Populate category so frontend can access product.category.name
    const product = await Models.Product.findById(_id).populate('category').exec();
    return product;
  },

  // Lấy danh sách sản phẩm theo ID danh mục (iPhone, iPad...)
  async selectByCatID(_cid) {
    const query = { category: _cid };
    // Populate category so frontend can access category fields if needed
    const products = await Models.Product.find(query).populate('category').exec();
    return products;
  },

  // Lấy danh sách sản phẩm mới nhất (New Products)
  async selectTopNew(top) {
    const query = {};
    const mysort = { cdate: -1 }; // Sắp xếp giảm dần theo ngày tạo
    const products = await Models.Product.find(query).sort(mysort).limit(top).populate('category').exec();
    return products;
  },

  // Lấy danh sách sản phẩm bán chạy nhất (Hot Products)
  async selectTopHot(top) {
    const items = await Models.Order.aggregate([
      { $match: { status: 'APPROVED' } }, // Chỉ lấy các đơn hàng đã duyệt
      { $unwind: '$items' },
      { $group: { _id: '$items.product_id', sum: { $sum: '$items.quantity' } } },
      { $sort: { sum: -1 } },
      { $limit: top }
    ]).exec();
    
    let products = [];
    for (const item of items) {
      const product = await ProductDAO.selectByID(item._id);
      products.push(product);
    }
    return products;
  },

  // Tìm kiếm sản phẩm theo từ khóa
  async selectByKeyword(keyword) {
    const query = { name: { $regex: new RegExp(keyword, "i") } }; // Tìm kiếm không phân biệt hoa thường
    const products = await Models.Product.find(query).populate('category').exec();
    return products;
  }
};

module.exports = ProductDAO;