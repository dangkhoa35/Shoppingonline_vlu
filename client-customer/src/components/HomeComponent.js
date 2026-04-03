import axios from 'axios';
import React, { Component } from 'react';
import { Link } from 'react-router-dom';

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      newprods: [],
      hotprods: []
    };
  }
  render() {
    const newprods = this.state.newprods.filter(item => item).map((item) => {
      return (
        <div key={item._id} className="inline">
          <figure>
            <Link to={'/product/' + item._id}>
              <img
                src={item.image && (item.image.startsWith('data:') || item.image.startsWith('/')) ? item.image : 'data:image/png;base64,' + item.image}
                width="300px"
                height="300px"
                alt={item.name}
                onError={(e) => { e.target.onerror = null; e.target.src = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="300" height="300"><rect width="100%" height="100%" fill="#f3f3f3"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="#aaa" font-size="20">No Image</text></svg>'; }}
              />
            </Link>
            <figcaption className="text-center">{item.name}<br />Price: {item.price}</figcaption>
          </figure>
        </div>
      );
    });
    const hotprods = this.state.hotprods.filter(item => item).map((item) => {
      return (
        <div key={item._id} className="inline">
          <figure>
            <Link to={'/product/' + item._id}>
              <img
                src={item.image && (item.image.startsWith('data:') || item.image.startsWith('/')) ? item.image : 'data:image/png;base64,' + item.image}
                width="300px"
                height="300px"
                alt={item.name}
                onError={(e) => { e.target.onerror = null; e.target.src = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="300" height="300"><rect width="100%" height="100%" fill="#f3f3f3"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="#aaa" font-size="20">No Image</text></svg>'; }}
              />
            </Link>
            <figcaption className="text-center">{item.name}<br />Price: {item.price}</figcaption>
          </figure>
        </div>
      );
    });
    return (
      <div>
        <div className="align-center">
          <h2 className="text-center">NEW PRODUCTS</h2>
          {newprods}
        </div>
        {this.state.hotprods.length > 0 ?
          <div className="align-center">
            <h2 className="text-center">HOT PRODUCTS</h2>
            {hotprods}
          </div>
          : <div />}
      </div>
    );
  }
  componentDidMount() {
  this.apiGetNewProducts();
  this.apiGetHotProducts();
}

apiGetNewProducts() {
    axios.get('/api/customer/products/new').then((res) => {
    const result = res.data;
    this.setState({ newprods: result });
  });
}

apiGetHotProducts() {
    axios.get('/api/customer/products/hot').then((res) => {
    const result = res.data;
    this.setState({ hotprods: result });
  });
  }
}
export default Home;