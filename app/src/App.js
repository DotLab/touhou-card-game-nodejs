import React from 'react';

import Account from './Account';
import Statistics from './Statistics';
import Lobby from './Lobby';
import Game from './Game';

export default class App extends React.Component {
  constructor(props) {
    super(props);

    this.socket = props.socket;

    this.state = {
      message: '',
      user: null,
    };

    // this.login({loginName: 'aaa', loginPassword: 'aaa'});
  }

  error(err) {
    alert(JSON.stringify(err));
  }

  genericApi0(event) {
    return new Promise((resolve, reject) => {
      this.socket.emit(event, (res) => {
        if (res.success === true) return resolve(res.data);
        this.error(res.err);
        if (typeof reject === 'function') reject(res.err);
      });
    });
  }

  genericApi1(event, arg1) {
    return new Promise((resolve, reject) => {
      this.socket.emit(event, arg1, (res) => {
        if (res.success === true) return resolve(res.data);
        this.error(res.err);
        if (typeof reject === 'function') reject(res.err);
      });
    });
  }

  async register({registerName, registerPassword}) {
    await this.genericApi1('cl_register', {name: registerName, password: registerPassword});
    this.setState({message: 'Registered!'});
  }

  async login({loginName, loginPassword}) {
    const user = await this.genericApi1('cl_login', {name: loginName, password: loginPassword});
    this.setState({message: `Welcome ${user.name}!`, user});
  }

  async update({updateName, updateBio}) {
    const user = await this.genericApi1('cl_update', {newName: updateName, newBio: updateBio});
    this.setState({
      message: 'Account updated successfully!',
      user: {
        ...this.state.user,
        name: user.name, bio: user.bio,
      }});
  }

  render() {
    const s = this.state;
    return <div>
      <div className="container">
        <h1 className="mt-2 mb-0">Touhou Card Game</h1>
      </div>
      <Account app={this} />
      {s.message && <div className="container-fluid">
        <div className="alert alert-info alert-dismissible fade show mt-2 mb-0">
          <strong>{s.message}</strong>
          <button className="close" data-dismiss="alert">&times;</button>
        </div>
      </div>}
      <Statistics app={this} />
      <Lobby app={this} />
      <Game app={this} />
    </div>;
  }
}
