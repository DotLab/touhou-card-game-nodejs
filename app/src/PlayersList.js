import React from 'react';
import { formatDate } from './utiles';

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
    return <div>
      {isLoggedIn && <button onClick={this.toggleView}>Players List</button>}
      {s.showPlayers && <div>
        {s.playersList.map(player => {
            return ( <div key={player.name}>
              {player.name}
              <ul>
                <li>"{player.bio}"</li>
                <li>Last Seen: {player.lastDate}</li>
                <li>Life Upgrade: {player.lifeUpgrade}</li>
              </ul>
            </div> )
          })
        }
      </div>}
    </div>;
  }
}
