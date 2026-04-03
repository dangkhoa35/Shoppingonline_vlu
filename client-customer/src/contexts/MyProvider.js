import React, { Component } from 'react';
import MyContext from './MyContext';

class MyProvider extends Component {
  constructor(props) {
    super(props);
    this.state = {
      token: '',
      customer: null,
      mycart: [],
      setToken: this.setToken,
      setCustomer: this.setCustomer,
      setMycart: this.setMycart
    };
  }

  componentDidMount() {
    // Restore session/cart from local storage on reload
    try {
      const stored = JSON.parse(window.localStorage.getItem('shoppingApp')); 
      if (stored) {
        this.setState({
          token: stored.token || '',
          customer: stored.customer || null,
          mycart: stored.mycart || []
        });
      }
    } catch (err) {
      console.warn('Failed to restore storage:', err);
    }
  }

  persist = (newState) => {
    try {
      window.localStorage.setItem('shoppingApp', JSON.stringify({
        token: newState.token,
        customer: newState.customer,
        mycart: newState.mycart
      }));
    } catch (err) {
      console.warn('Failed to persist storage:', err);
    }
  }

  setToken = (value) => {
    this.setState({ token: value }, () => {
      this.persist(this.state);
    });
  }

  setCustomer = (value) => {
    this.setState({ customer: value }, () => {
      this.persist(this.state);
    });
  }

  setMycart = (value) => {
    this.setState({ mycart: value }, () => {
      this.persist(this.state);
    });
  }

  render() {
    return (
      <MyContext.Provider value={this.state}>
        {this.props.children}
      </MyContext.Provider>
    );
  }
}
export default MyProvider;