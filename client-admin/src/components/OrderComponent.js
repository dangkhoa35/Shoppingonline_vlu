import axios from 'axios';
import React, { Component } from 'react';
import MyContext from '../contexts/MyContext';

class Order extends Component {
  static contextType = MyContext;

  constructor(props) {
    super(props);
    this.state = {
      orders: [],
      order: null
    };
  }

  // Hàm helper xử lý hiển thị hình ảnh thông minh
  getImageSrc(image) {
    if (!image) return '';
    if (image.startsWith('data:')) {
      return image; // Đã là Base64 đầy đủ, không thay đổi
    } else if (image.startsWith('/') || image.startsWith('http')) {
      // Là URL hoặc đường dẫn tệp tĩnh (ví dụ: phục vụ từ server /images/)
      // Nếu bắt đầu bằng /, nó là đường dẫn tương đối trên server cổng 3000
      return image.startsWith('/') ? `http://localhost:3000${image}` : image;
    } else {
      // Giả sử là dữ liệu Base64 chỉ bao gồm dữ liệu ảnh (không tiền tố), hãy ghép tiền tố
      return `data:image/jpg;base64,${image}`;
    }
  }

  render() {
    // 1. Render danh sách đơn hàng (ORDER LIST)
    const orders = this.state.orders.map((item) => {
      // Kiểm tra xem dòng này có đang được chọn hay không để đổi màu nền
      const isSelected = this.state.order && this.state.order._id === item._id;
      return (
        <tr 
          key={item._id} 
          className="datatable" 
          onClick={() => this.trItemClick(item)}
          style={{ cursor: 'pointer', backgroundColor: isSelected ? '#e3f2fd' : 'transparent' }}
        >
          <td>{item._id}</td>
          <td>{new Date(item.cdate).toLocaleString()}</td>
          <td>{item.customer ? item.customer.name : 'N/A'}</td>
          <td>{item.customer ? item.customer.phone : 'N/A'}</td>
          <td>{item.total.toLocaleString()}</td>
          <td>{item.status}</td>
          <td>
            {item.status === 'PENDING' ?
              <div>
                <span className="link" onClick={(e) => { e.stopPropagation(); this.lnkApproveClick(item._id); }}>APPROVE</span> || 
                <span className="link" onClick={(e) => { e.stopPropagation(); this.lnkCancelClick(item._id); }}>CANCEL</span> 
              </div>
              : <div />}
          </td>
        </tr>
      );
    });

    // 2. Render chi tiết đơn hàng (ORDER DETAIL)
    let items = null;
    if (this.state.order && this.state.order.items) {
      items = this.state.order.items.map((item, index) => {
        const product = item.product;
        // Sử dụng hàm helper getImageSrc để xử lý ảnh bị hỏng
        const imageSrc = this.getImageSrc(product?.image);

        return (
          <tr key={product ? product._id : index} className="datatable">
            <td>{index + 1}</td>
            <td>{product ? product._id : 'N/A'}</td>
            <td>{product ? product.name : 'N/A'}</td>
            <td>
              {product?.image ? 
                <img src={imageSrc} width="70px" height="70px" alt="" /> 
                : <div style={{width:'70px', height:'70px', backgroundColor:'#eee'}}>No image</div>}
            </td>
            <td>{product ? product.price.toLocaleString() : 0}</td>
            <td>{item.quantity}</td>
            <td>{(product ? product.price * item.quantity : 0).toLocaleString()}</td>
          </tr>
        );
      });
    }

    return (
      <div>
        <div className="align-center">
          <h2 className="text-center">ORDER LIST</h2>
          <table className="datatable" border="1">
            <tbody>
              <tr className="datatable">
                <th>ID</th><th>Creation date</th><th>Cust.name</th><th>Cust.phone</th><th>Total</th><th>Status</th><th>Action</th>
              </tr>
              {orders}
            </tbody>
          </table>
        </div>

        {/* Hiển thị ORDER DETAIL khi có đơn hàng được chọn */}
        {this.state.order ?
          <div className="align-center" style={{ marginTop: '30px' }}>
            <h2 className="text-center">ORDER DETAIL</h2>
            <table className="datatable" border="1">
              <tbody>
                <tr className="datatable">
                  <th>No.</th><th>Prod. ID</th><th>Prod.name</th><th>Image</th><th>Price</th><th>Quantity</th><th>Amount</th>
                </tr>
                {items}
              </tbody>
            </table>
          </div>
          : <div />}
      </div>
    );
  }

  componentDidMount() {
    this.apiGetOrders();
  }

  // Cập nhật đơn hàng đang xem
  trItemClick(item) {
    this.setState({ order: item });
  }

  lnkApproveClick(id) {
    this.apiPutOrderStatus(id, 'APPROVED');
  }

  lnkCancelClick(id) {
    this.apiPutOrderStatus(id, 'CANCELED');
  }

  // APIs
  apiGetOrders() {
    const config = { headers: { 'x-access-token': this.context.token } };
    axios.get('/api/admin/orders', config).then((res) => {
      const result = res.data;
      // Khi lấy dữ liệu xong, tự động chọn đơn hàng đầu tiên (nếu có) để hiện DETAIL
      this.setState({ 
        orders: result,
        order: (result.length > 0 && this.state.order === null) ? result[0] : this.state.order
      });
    }).catch((err) => {
      console.error(err);
    });
  }

  apiPutOrderStatus(id, status) {
    const body = { status: status }; 
    const config = { headers: { 'x-access-token': this.context.token } };
    axios.put('/api/admin/orders/status/' + id, body, config).then((res) => {
      const result = res.data; 
      if (result) {
        // Sau khi cập nhật, gọi lại list và cập nhật state order hiện tại
        this.apiGetOrders();
        if (this.state.order && this.state.order._id === id) {
           const newOrder = {...this.state.order, status: status};
           this.setState({ order: newOrder });
        }
      } else {
        alert('Cập nhật trạng thái thất bại!');
      }
    }).catch((err) => {
      console.error(err);
    });
  }
}

export default Order;