import React from 'react';

import {onChange, onSubmit} from './utiles';

export default class Account extends React.Component {
  constructor(props) {
    super(props);
    this.app = props.app;

    this.onChange = onChange.bind(this);
    this.onSubmitUpdate = onSubmit(this.update.bind(this));
    this.onSubmitRegister = onSubmit(this.register.bind(this));
    this.onSubmitLogin = onSubmit(this.login.bind(this));

    this.state = {
      isLoggedIn: false,
    };
  }

  update() {
    this.app.update(this.state);
  }

  register() {
    this.app.register(this.state);
  }

  login() {
    this.app.login(this.state);
  }

  render() {
    const user = this.app.state.user;
    const isLoggedIn = user !== null;

    return <div>
      {isLoggedIn ? <div>
        <ul>
          <li>Name: {user.name}</li>
          <li>Bio: {user.bio}</li>
        </ul>
        <form onSubmit={this.onSubmitUpdate}>
          <label>New name:</label>
          <input type="text" name="updateName" onChange={this.onChange}/>
          <label>New bio:</label>
          <input type="text" name="updateBio" onChange={this.onChange}/>
          <button type="submit">Update</button>
        </form>
      </div> : <div>
        <form onSubmit={this.onSubmitRegister}>
          <input type="text" name="registerName" onChange={this.onChange}/>
          <input type="password" name="registerPassword" onChange={this.onChange}/>
          <button type="submit">Register</button>
        </form>
        <form onSubmit={this.onSubmitLogin}>
          <input type="text" name="loginName" onChange={this.onChange}/>
          <input type="password" name="loginPassword" onChange={this.onChange}/>
          <button type="submit">Login</button>
        </form>
      </div>}
    </div>;
  }
}
