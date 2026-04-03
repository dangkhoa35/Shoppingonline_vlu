require('../utils/MongooseUtil');
const Models = require('./index');
const ProductDAO = require('./ProductDAO');
const CustomerDAO = require('./CustomerDAO');
const mongoose = require('mongoose');

// Hàm bổ trợ populate
async function populateOrder(order) {
  if (order.customer_id) {
    try {
      const customer = await CustomerDAO.selectByID(order.customer_id);
      order.customer = customer || { name: 'N/A', phone: 'N/A' };
    } catch (e) {
      order.customer = { name: 'N/A', phone: 'N/A' };
    }
  }

  if (order.items && Array.isArray(order.items)) {
    order.items = await Promise.all(
      order.items.map(async (item) => {
        const p_id = item.product_id || (item.product ? item.product._id : null);
        if (p_id) {
          try {
            const product = await ProductDAO.selectByID(p_id);
            return {
              ...item,
              product: product || { _id: p_id, name: 'Sản phẩm đã xóa', price: 0, image: '' }
            };
          } catch (e) {
            return { ...item, product: { _id: p_id, name: 'Lỗi tải SP', price: 0, image: '' } };
          }
        }
        return item;
      })
    );
  }
  return order;
}

const OrderDAO = {
  async insert(order) {
    try {
      order._id = new mongoose.Types.ObjectId();
      const result = await Models.Order.create(order);
      console.log("===> ĐÃ LƯU ĐƠN HÀNG MỚI VÀO DB:", result._id);
      return result;
    } catch (err) {
      console.error("LỖI KHI INSERT ORDER:", err);
      return null;
    }
  },

  async selectAll() {
    try {
      const orders = await Models.Order.find({}).sort({ cdate: -1 }).lean();
      return await Promise.all(orders.map(ord => populateOrder(ord)));
    } catch (error) {
      return [];
    }
  },

  async selectByCustID(_cid) {
    try {
      console.log("------------------------------------------");
      console.log(" ĐANG TÌM ĐƠN HÀNG CHO CID:", _cid);

      // Chuyển đổi ID sang ObjectId để query cho chuẩn
      let custId = _cid;
      if (mongoose.Types.ObjectId.isValid(_cid)) {
        custId = new mongoose.Types.ObjectId(_cid);
      }

      // THỬ NGHIỆM: Tìm mọi đơn hàng để debug
      const allOrdersCount = await Models.Order.countDocuments({});
      console.log(" Tổng số đơn hàng hiện có trong DB:", allOrdersCount);

      // Query tìm đơn hàng theo customer_id
      const query = { customer_id: custId };
      const orders = await Models.Order.find(query).lean();
      
      console.log(` KẾT QUẢ: Tìm thấy ${orders.length} đơn hàng khớp với ID này.`);
      console.log("------------------------------------------");

      const populatedOrders = await Promise.all(orders.map(ord => populateOrder(ord)));
      return populatedOrders;
    } catch (error) {
      console.error("LỖI TẠI selectByCustID:", error);
      return [];
    }
  },

  async update(_id, newStatus) {
    const result = await Models.Order.findByIdAndUpdate(_id, { status: newStatus }, { new: true });
    return result;
  }
};

module.exports = OrderDAO;