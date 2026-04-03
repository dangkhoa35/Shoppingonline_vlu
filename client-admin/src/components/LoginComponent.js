import axios from 'axios';
import React, { Component } from 'react';
import MyContext from '../contexts/MyContext';

class Login extends Component {
  static contextType = MyContext;
  constructor(props) {
    super(props);
    this.state = { txtUsername: '', txtPassword: '' };
  }

  btnLoginClick(e) {
    e.preventDefault();
    const { txtUsername, txtPassword } = this.state;
    if (txtUsername && txtPassword) {
      axios.post('/api/admin/login', { username: txtUsername, password: txtPassword })
        .then((res) => {
          const result = res.data;
          if (result.success === true) {
            this.context.setToken(result.token);
            this.context.setUsername(txtUsername);
          } else {
            alert(result.message);
          }
        });
    } else {
      alert('Please input username and password');
    }
  }

  render() {
    if (this.context.token !== '') return (<div />);
    return (
      <div className="align-valign-center">
        <h2 className="text-center">ADMIN LOGIN</h2>
        <form>
          <table className="align-center">
            <tbody>
              <tr>
                <td>Username</td>
                <td><input type="text" value={this.state.txtUsername} onChange={(e) => this.setState({ txtUsername: e.target.value })} /></td>
              </tr>
              <tr>
                <td>Password</td>
                <td><input type="password" value={this.state.txtPassword} onChange={(e) => this.setState({ txtPassword: e.target.value })} /></td>
              </tr>
              <tr>
                <td></td>
                <td><input type="submit" value="LOGIN" onClick={(e) => this.btnLoginClick(e)} /></td>
              </tr>
            </tbody>
          </table>
        </form>
      </div>
    );
  }
}
export default Login;