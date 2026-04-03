import axios from 'axios';
import React, { Component } from 'react';
import MyContext from '../contexts/MyContext';

class Active extends Component {
  static contextType = MyContext;

  constructor(props) {
    super(props);
    this.state = {
      txtToken: ''
    };
  }

  render() {
    return (
      <div className="align-center">
        <h2 className="text-center">ACCOUNT ACTIVATION</h2>
        <form>
          <table className="datatable" border="0" style={{ margin: 'auto' }}>
            <tbody>
              <tr>
                <td>Token</td>
                <td>
                  <input 
                    type="text" 
                    value={this.state.txtToken} 
                    onChange={(e) => this.setState({ txtToken: e.target.value })} 
                    placeholder="Paste token from email here"
                    style={{ width: '300px' }}
                  />
                </td>
              </tr>
              <tr>
                <td></td>
                <td>
                  <input 
                    type="button" 
                    value="ACTIVE ACCOUNT" 
                    onClick={() => this.apiActive()} 
                  />
                </td>
              </tr>
            </tbody>
          </table>
        </form>
      </div>
    );
  }

  apiActive() {
    const token = this.state.txtToken.trim();
    if (!token) {
      alert('Vui lòng nhập Token từ email!');
      return;
    }

    const config = { headers: { 'x-access-token': this.context.token } };

    axios.get('/api/customer/active/' + token, config)
      .then((res) => {
        const result = res.data;
        alert(result.message);
        if (result.success) {
          window.location.href = '/login';
        }
      })
      .catch((err) => {
        console.error(err);
        alert('Kích hoạt thất bại! Token không hợp lệ hoặc đã hết hạn.');
      });
  }
}

export default Active;