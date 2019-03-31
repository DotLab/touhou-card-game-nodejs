import React from 'react';

import {formatDate, formatTime} from './utiles';

export default class Statistics extends React.Component {
  constructor(props) {
    super(props);

    this.app = props.app;

    this.toggleStats = this.toggleStats.bind(this);

    this.state = {
      showStats: false,
    };
  }

  toggleStats() {
    this.setState({showStats: !this.state.showStats});
  }

  render() {
    const s = this.state;
    const user = this.app.state.user;
    const isLoggedIn = user !== null;
    return <div>
      {isLoggedIn && <button onClick={this.toggleStats}>Statistics</button>}
      {s.showStats && <div>
        Joined: {formatDate(user.joinDate)}<br/>
        Last Seen: {formatDate(user.lastDate)}<br/>
        Time Online: {formatTime(user.onlineTime)}<br/>
        Games Played: {user.gameCount}<br/>
        Games Won: {user.winCount}<br/>
      </div>}
    </div>;
  }
}
