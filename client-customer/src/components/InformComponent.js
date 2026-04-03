import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import MyContext from '../contexts/MyContext';

class Inform extends Component {
  static contextType = MyContext;

  render() {
    return (
      <div className="border-bottom">
        <div className="float-left">
          {this.context.token === '' ? (
            // Giao diện khi chưa đăng nhập
            <div>
              <Link to='/login'>Login</Link> | <Link to='/signup'>Sign-up</Link> | <Link to='/active'>Active</Link>
            </div>
          ) : (
            // Giao diện khi đã đăng nhập
            <div>
              Hello <b>{this.context.customer?.name || JSON.parse(localStorage.getItem('customer'))?.name || 'Khách'}</b> |
              <Link to='/home' onClick={() => this.lnkLogoutClick()}>Logout</Link> | 
            <Link to='/profile'>My profile</Link>
            </div>
          )}
        </div>
        <div className="float-right">
          <Link to='/mycart'>My cart</Link> have <b>{this.context.mycart.length}</b> items | <Link to='/myorders'>My orders</Link>
        </div>
        <div className="float-clear" />
      </div>
    );
  }

  lnkLogoutClick() {
    this.context.setToken('');
    this.context.setCustomer(null);
    this.context.setMycart([]);
  }
}

export default Inform;