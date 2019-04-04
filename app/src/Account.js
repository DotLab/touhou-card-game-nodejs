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

    return <div className="container pt-2">
      {isLoggedIn ? <div>
        <h2 className="h3">Welcome back, <em>{user.name}</em>.</h2>
        <dl className="row mb-2">
          <dt className="col-sm-3">Current Name</dt>
          <dd className="col-sm-9">{user.name}</dd>

          <dt className="col-sm-3">Current Bio</dt>
          <dd className="col-sm-9">{user.bio}</dd>
        </dl>

        <form className="form-inline" onSubmit={this.onSubmitUpdate}>
          <label className="mr-2">New Name</label>
          <input className="mr-2 form-control" type="text" name="updateName" defaultValue={user.name} onChange={this.onChange}/>
          <label className="mr-2">New Bio</label>
          <input className="mr-2 form-control" type="text" name="updateBio" defaultValue={user.bio} onChange={this.onChange}/>
          <button className="btn btn-outline-warning" type="submit">Update</button>
        </form>
      </div> : <div>
        <h2 className="h3">First, please <span className="text-secondary">register</span> or <span className="text-primary">login</span>:</h2>
        <form className="form-inline" onSubmit={this.onSubmitRegister}>
          <input className="form-control mr-2" type="text" name="registerName" onChange={this.onChange}/>
          <input className="form-control mr-2" type="password" name="registerPassword" onChange={this.onChange}/>
          <button className="btn btn-secondary" type="submit">Register</button>
        </form>
        <form className="form-inline mt-2" onSubmit={this.onSubmitLogin}>
          <input className="form-control mr-2" type="text" name="loginName" onChange={this.onChange}/>
          <input className="form-control mr-2" type="password" name="loginPassword" onChange={this.onChange}/>
          <button className="btn btn-primary" type="submit">Login</button>
        </form>
      </div>}
    </div>;
  }
}
