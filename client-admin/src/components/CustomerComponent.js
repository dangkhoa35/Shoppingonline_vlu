import axios from 'axios';
import React, { Component } from 'react';
import MyContext from '../contexts/MyContext';

class Customer extends Component {
  static contextType = MyContext;

  constructor(props) {
    super(props);
    this.state = {
      customers: [],
      orders: [],
      order: null
    };
  }

  render() {
    // 1. Render danh sách Khách hàng
    const customers = this.state.customers.map((item) => {
      return (
        <tr 
          key={item._id} 
          className="datatable" 
          onClick={() => this.trCustomerClick(item)}
          style={{ 
            cursor: 'pointer',
            backgroundColor: this.state.orders[0]?.customer?._id === item._id ? '#f8f9fa' : 'transparent' 
          }}
        >
          <td>{item._id}</td>
          <td>{item.username}</td>
          <td>{item.password}</td>
          <td>{item.name}</td>
          <td>{item.phone}</td>
          <td>{item.email}</td>
          <td>{item.active}</td>
          <td>
            {item.active === 0 ? (
              <span 
                className="link" 
                onClick={(e) => { e.stopPropagation(); this.lnkEmailClick(item); }}
              >
                EMAIL
              </span>
            ) : (
              <span 
                className="link" 
                onClick={(e) => { e.stopPropagation(); this.lnkDeactiveClick(item); }}
              >
                DEACTIVE
              </span>
            )}
          </td>
        </tr>
      );
    });

    // 2. Render danh sách Đơn hàng (ORDER LIST)
    const orders = this.state.orders.map((item) => {
      return (
        <tr 
          key={item._id} 
          className="datatable" 
          onClick={() => this.trOrderClick(item)}
          style={{ 
            cursor: 'pointer',
            backgroundColor: this.state.order?._id === item._id ? '#fff3cd' : 'transparent'
          }}
        >
          <td>{item._id}</td>
          <td>{new Date(item.cdate).toLocaleString()}</td>
          <td>{item.customer?.name || 'N/A'}</td>
          <td>{item.customer?.phone || 'N/A'}</td>
          <td>{item.total.toLocaleString()} VNĐ</td>
          <td>
            <span style={{ fontWeight: 'bold', color: item.status === 'APPROVED' ? 'green' : 'orange' }}>
              {item.status}
            </span>
          </td>
        </tr>
      );
    });

    // 3. Render chi tiết Đơn hàng (ORDER DETAIL)
    let items = null;
    if (this.state.order) {
      items = this.state.order.items.map((item, index) => {
        const product = item.product || {};
        
        // --- LOGIC HIỂN THỊ ẢNH CHỐNG LỖI ---
        let imageSrc = "https://via.placeholder.com/70?text=No+Image";
        if (product.image) {
          if (product.image.startsWith('data:')) {
            imageSrc = product.image;
          } else {
            // Loại bỏ /images/ dư thừa và trỏ về Server cổng 3000
            const fileName = product.image.replace(/^\/?(images\/)?/, "");
            imageSrc = `http://localhost:3000/images/${fileName}`;
          }
        }

        return (
          <tr key={product._id || index} className="datatable">
            <td>{index + 1}</td>
            <td>{product._id}</td>
            <td>{product.name}</td>
            <td style={{ textAlign: 'center' }}>
              <img 
                src={imageSrc} 
                width="70px" 
                height="70px" 
                alt="" 
                style={{ objectFit: 'contain', border: '1px solid #ddd', borderRadius: '4px' }}
                onError={(e) => { e.target.src = "https://via.placeholder.com/70?text=Error"; }}
              />
            </td>
            <td>{product.price?.toLocaleString()} VNĐ</td>
            <td>{item.quantity}</td>
            <td>{(product.price * item.quantity).toLocaleString()} VNĐ</td>
          </tr>
        );
      });
    }

    return (
      <div className="align-center">
        {/* BẢNG 1: CUSTOMER LIST */}
        <div style={{ width: '90%' }}>
          <h2 className="text-center">CUSTOMER LIST</h2>
          <table className="datatable" border="1" style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr className="datatable">
                <th>ID</th><th>Username</th><th>Password</th><th>Name</th><th>Phone</th><th>Email</th><th>Active</th><th>Action</th>
              </tr>
            </thead>
            <tbody>{customers}</tbody>
          </table>
        </div>

        {/* BẢNG 2: ORDER LIST */}
        {this.state.orders.length > 0 && (
          <div style={{ marginTop: '40px', width: '90%' }}>
            <h2 className="text-center">ORDER LIST</h2>
            <table className="datatable" border="1" style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr className="datatable">
                  <th>ID</th><th>Creation date</th><th>Cust.name</th><th>Cust.phone</th><th>Total</th><th>Status</th>
                </tr>
              </thead>
              <tbody>{orders}</tbody>
            </table>
          </div>
        )}

        {/* BẢNG 3: ORDER DETAIL */}
        {this.state.order && (
          <div style={{ marginTop: '40px', width: '90%' }}>
            <h2 className="text-center">ORDER DETAIL</h2>
            <table className="datatable" border="1" style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr className="datatable">
                  <th>No.</th><th>Prod.ID</th><th>Prod.name</th><th>Image</th><th>Price</th><th>Quantity</th><th>Amount</th>
                </tr>
              </thead>
              <tbody>{items}</tbody>
            </table>
          </div>
        )}
      </div>
    );
  }

  componentDidMount() {
    this.apiGetCustomers();
  }

  // --- Sự kiện click ---
  trCustomerClick(item) {
    this.setState({ orders: [], order: null });
    this.apiGetOrdersByCustID(item._id);
  }

  trOrderClick(item) {
    this.setState({ order: item });
  }

  lnkDeactiveClick(item) {
    if (window.confirm('Bạn có chắc muốn Deactive khách hàng này?')) {
        this.apiPutCustomerDeactive(item._id, item.token);
    }
  }

  lnkEmailClick(item) {
    this.apiGetCustomerSendmail(item._id);
  }

  // --- API Calls ---
  apiGetCustomers() {
    const config = { headers: { 'x-access-token': this.context.token } };
    axios.get('/api/admin/customers', config).then((res) => {
      this.setState({ customers: res.data });
    });
  }

  apiGetOrdersByCustID(cid) {
    const config = { headers: { 'x-access-token': this.context.token } };
    axios.get('/api/admin/orders/customer/' + cid, config).then((res) => {
      this.setState({ orders: res.data });
    });
  }

  apiPutCustomerDeactive(id, token) {
    const body = { token: token };
    const config = { headers: { 'x-access-token': this.context.token } };
    axios.put('/api/admin/customers/deactive/' + id, body, config).then((res) => {
      if (res.data) this.apiGetCustomers();
      else alert('Thao tác thất bại!');
    });
  }

  apiGetCustomerSendmail(id) {
    const config = { headers: { 'x-access-token': this.context.token } };
    axios.get('/api/admin/customers/sendmail/' + id, config).then((res) => {
      alert(res.data.message);
    });
  }
}

export default Customer;