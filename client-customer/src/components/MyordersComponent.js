import axios from 'axios';
import React, { Component } from 'react';
import { Navigate } from 'react-router-dom';
import MyContext from '../contexts/MyContext';

class Myorders extends Component {
  static contextType = MyContext;

  constructor(props) {
    super(props);
    this.state = { orders: [], order: null };
  }

  render() {
    if (this.context.token === '') return <Navigate replace to="/login" />;

    const ordersData = Array.isArray(this.state.orders) ? this.state.orders : [];
    const ordersList = ordersData.map((item) => (
      <tr 
        key={item._id} 
        className="datatable" 
        onClick={() => this.trItemClick(item)} 
        style={{ 
          cursor: 'pointer', 
          backgroundColor: this.state.order?._id === item._id ? '#e9ecef' : 'transparent',
          transition: 'background-color 0.2s'
        }}
      >
        <td>{item._id}</td>
        <td>{item.cdate ? new Date(item.cdate).toLocaleString() : 'N/A'}</td>
        <td>{item.customer?.name || 'N/A'}</td>
        <td>{item.customer?.phone || 'N/A'}</td>
        <td>{item.total ? item.total.toLocaleString() : '0'}</td>
        <td>
          <span style={{ color: item.status === 'APPROVED' ? 'green' : 'orange', fontWeight: 'bold' }}>
            {item.status}
          </span>
        </td>
      </tr>
    ));

    let itemsDetail = null;
    if (this.state.order && Array.isArray(this.state.order.items)) {
      itemsDetail = this.state.order.items.map((item, index) => {
        const product = item.product || {};
        
        // --- LOGIC XỬ LÝ ẢNH "THÔNG MINH" ---
        let imageSrc = "";
        if (product.image) {
          if (product.image.startsWith('data:')) {
            imageSrc = product.image;
          } else {
            // Loại bỏ các tiền tố dư thừa như "/images/" hoặc "images/" nếu lỡ lưu trong DB
            const fileName = product.image.replace(/^\/?(images\/)?/, "");
            // Trỏ thẳng vào thư mục public/images của Frontend (Cổng 3002)
            imageSrc = `/images/${fileName}`;
          }
        }

        return (
          <tr key={product._id || index} className="datatable">
            <td>{index + 1}</td>
            <td>{product._id || 'N/A'}</td>
            <td>{product.name || 'N/A'}</td>
            <td style={{ textAlign: 'center' }}>
              {imageSrc ? (
                <img 
                  src={imageSrc} 
                  width="70px" 
                  height="70px" 
                  alt={product.name} 
                  style={{ objectFit: 'contain', borderRadius: '4px', border: '1px solid #ddd', padding: '2px' }}
                  onError={(e) => { 
                    // Nếu không thấy ở Frontend, thử tìm ở Server (Cổng 3000)
                    const fileName = product.image.replace(/^\/?(images\/)?/, "");
                    if (!e.target.src.includes('localhost:3000')) {
                      e.target.src = `http://localhost:3000/images/${fileName}`;
                    } else {
                      e.target.src = "https://via.placeholder.com/70?text=NotFound";
                    }
                  }} 
                />
              ) : "No Image"}
            </td>
            <td>{product.price ? product.price.toLocaleString() : '0'} VNĐ</td>
            <td>{item.quantity}</td>
            <td>{((product.price || 0) * item.quantity).toLocaleString()} VNĐ</td>
          </tr>
        );
      });
    }

    return (
      <div className="align-center">
        <div style={{ width: '90%' }}>
          <h2 className="text-center">DANH SÁCH ĐƠN HÀNG</h2>
          <table className="datatable" border="1" style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr className="datatable">
                <th>Mã đơn</th><th>Ngày đặt</th><th>Tên khách</th><th>Số điện thoại</th><th>Tổng tiền</th><th>Trạng thái</th>
              </tr>
            </thead>
            <tbody>{ordersList}</tbody>
          </table>
        </div>

        {this.state.order && (
          <div style={{ marginTop: '40px', width: '90%' }}>
            <h2 className="text-center">CHI TIẾT ĐƠN HÀNG</h2>
            <table className="datatable" border="1" style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr className="datatable">
                  <th>STT</th><th>Mã SP</th><th>Tên sản phẩm</th><th>Hình ảnh</th><th>Giá đơn vị</th><th>Số lượng</th><th>Thành tiền</th>
                </tr>
              </thead>
              <tbody>{itemsDetail}</tbody>
            </table>
          </div>
        )}
      </div>
    );
  }

  componentDidMount() {
  // Ưu tiên lấy từ Context, nếu Context trống (do F5) thì lấy từ localStorage
  const cust = this.context.customer || JSON.parse(localStorage.getItem('customer'));
  const token = this.context.token || localStorage.getItem('token');

  if (cust && cust._id) {
    this.apiGetOrdersByCustID(cust._id, token);
  } else {
    console.warn("Không tìm thấy thông tin người dùng để tải đơn hàng!");
  }
}

  trItemClick(item) { this.setState({ order: item }); }

  apiGetOrdersByCustID(cid) {
    const config = { headers: { 'x-access-token': this.context.token } };
    axios.get('/api/customer/orders/customer/' + cid, config).then((res) => {
      const result = Array.isArray(res.data) ? res.data : (res.data.data || []);
      this.setState({ orders: result, order: result.length > 0 ? result[0] : null });
    });
  }
}

export default Myorders;