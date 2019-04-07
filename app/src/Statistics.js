import React from 'react';

import {formatDate, formatTime, formatNumber} from './utiles';

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
    console.log(user);
    return <div className="container mt-2">
      {isLoggedIn && <button className="btn btn-info" name="toggleStats" onClick={this.toggleStats}>Toggle Statistics</button>}
      {s.showStats && <div className="card mt-2 px-3 py-2">
        <dl className="row mt-1 mb-0">
          <dt className="col-sm-3">Joined Time</dt>
          <dd className="col-sm-9">{formatDate(user.joinDate)}</dd>
          <dt className="col-sm-3">Last Seen Time</dt>
          <dd className="col-sm-9">{formatDate(user.lastDate)}</dd>
          <dt className="col-sm-3">Time Online</dt>
          <dd className="col-sm-9">{formatTime(user.onlineTime)}</dd>
          <dt className="col-sm-3">Games Played</dt>
          <dd className="col-sm-9">{formatNumber(user.gameCount)}</dd>
          <dt className="col-sm-3">Games Won</dt>
          <dd className="col-sm-9">{formatNumber(user.winCount)}</dd>
          <dt className="col-sm-3">Spirit Points</dt>
          <dd className="col-sm-9">{formatNumber(user.spiritPointsCount)} SP</dd>
          <dt className="col-sm-3">Magic Points</dt>
          <dd className="col-sm-9">{formatNumber(user.magicPointsCount)} MP</dd>
          <dt className="col-sm-3">Life Upgrade</dt>
          <dd className="col-sm-9">{formatNumber(user.lifeUpgrade)} L</dd>
          <dt className="col-sm-3" name="following">Following</dt>
          <dd className="col-sm-9" name="followingList">{(user.following.toString())}</dd>
          <dt className="col-sm-3" name="follower">Followers</dt>
          <dd className="col-sm-9" name="followerList">{(user.followers.toString())}</dd>
        </dl>
      </div>}
    </div>;
  }
}
