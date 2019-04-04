import React from 'react';
import { formatDate, formatNumber } from './utiles';

export default class PlayersList extends React.Component {
  constructor(props) {
    super(props);

    this.app = props.app;

    this.toggleView = this.toggleView.bind(this);

    this.state = {
      showPlayers: false,
      playersList: [],
    };
  }

  async toggleView() {
    if (this.state.showPlayers) {
        this.setState({showPlayers: false});
    } else {
        let list = await this.app.genericApi0('cl_get_players');
        list = list.map(function(player) {
          return {
            ...player, 
            lastDate: formatDate(player.lastDate),
          };
        });
        this.setState({showPlayers: true, playersList: list});
    }
  }

  render() {
    const s = this.state;
    const user = this.app.state.user;
    const isLoggedIn = user !== null;

    return <div className="container mt-2">
      {isLoggedIn && <button className="btn btn-info" onClick={this.toggleView}>Players List</button>}
      {s.showPlayers && <div className="card mt-2 px-3 py-2">
          <ul className="py-0 my-0">
          {s.playersList.map(player => (<li key={player.name}>
            <strong>{player.name}</strong>
            <ul>
              <li><span className="badge badge-primary">Bio</span> "{player.bio}"</li>
              <li><span className="badge badge-info">Last Seen</span> {formatDate(player.lastDate)}</li>
              <li><span className="badge badge-danger">Life Upgrade</span> {formatNumber(player.lifeUpgrade || 0)} L</li>
            </ul>
          </li>))}
        </ul>
      </div>}
    </div>;
  }
}
