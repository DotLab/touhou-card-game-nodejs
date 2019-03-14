import React from 'react';

// import {formatDate, formatTime} from './utiles';

import Card from './Card';

import debug from 'debug';
const log = debug('tcg:Game');

export default class Game extends React.Component {
  constructor(props) {
    super(props);

    this.app = props.app;

    this.state = {
    };
  }

  componentDidMount() {
    const socket = this.app.socket;
    socket.on('sv_game_start', (snapshot) => {
      log('sv_game_start', snapshot);
      const players = snapshot.players;
      const opponents = [];
      let me = null;

      for (let i = 0; i < players.length; i += 1) {
        if (players[i].userId === 'abc') {// user.id) {
          me = players[i];
        } else {
          opponents.push(players[i]);
        }
      }

      me.opponents = opponents;
      this.setState(me);
    });
  }

  componentWillUnmount() {
    const socket = this.app.socket;
    socket.off('sv_game_start');
  }

  render() {
    // const s = this.state;

    return <div>
      <div>
        <Card />
        <Card />
        <Card />
        <Card />
        <Card />
      </div>
      <div>
        <Card />
        <Card />
        <Card />
        <Card />
        <Card />
      </div>
    </div>;
  }
}
