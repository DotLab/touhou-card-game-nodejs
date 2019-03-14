import React from 'react';

import {onChange} from './utiles';

import Slot from './Slot';

import debug from 'debug';
const log = debug('tcg:Game');

class Game extends React.Component {
  constructor(props) {
    super(props);

    this.app = props.app;

    this.onChange = onChange.bind(this);

    this.confirmAction = this.confirmAction.bind(this);

    this.state = {
      me: null,
      selectedCard: null,
      selectedCardI: null,
      selectedAction: null,
      selectedParams: [],

      err: null,

      display: 'HIDDEN',
      pose: 'DEFENSE',
    };
  }

  async confirmAction() {
    const s = this.state;
    log(s);

    let err = '';
    try {
      await this.app.genericApi1('cl_game_action', {
        name: s.selectedAction.name,
        in: s.selectedSlot.props.in,
        i: s.selectedSlot.props.i,
        params: s.selectedParams,
        display: s.display,
        pose: s.pose,
      });
    } catch (e) {
      log(e);
      err = e;
    }

    this.setState({
      selectedCard: null,
      selectedSlot: null,
      selectedAction: null,
      selectedParams: [],

      err,
    });
  }

  componentDidMount() {
    const socket = this.app.socket;
    socket.on('sv_game_update', (snapshot) => {
      log('sv_game_update', snapshot);
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
      log('me', me);
      this.setState({me});
    });
  }

  componentWillUnmount() {
    const socket = this.app.socket;
    socket.off('sv_game_update');
  }

  render() {
    const s = this.state;
    const me = s.me;
    if (!me) {
      return <div>Waiting for game snapshot...</div>;
    }

    const field = me.field;
    let message;
    if (s.selectedAction && s.selectedParams.length >= s.selectedAction.params.length) {
      message = `all parameters selected for action '${s.selectedAction.name}' of '${s.selectedCard.name}'!`;
    } else if (s.selectedAction) {
      message = `choose parameter ${s.selectedParams.length} for action '${s.selectedAction.name}' of '${s.selectedCard.name}'`;
    } else if (s.selectedCard) {
      message = 'choose an action or a different card';
    } else {
      switch (s.me.stage) {
        case Game.MY_TURN: message = 'your turn, choose a card'; break;
        case Game.SUSPENDED: message = 'game is suspended'; break;
        case Game.WATCHING: message = 'wait for your turn'; break;
      }
    }

    return <div>
      <div>
        <Slot game={this} me={me} in={Game.ENVIRONMENT_SLOT} i={0} card={field.environmentSlot} />
        <Slot game={this} me={me} in={Game.MONSTER_SLOTS} i={0} card={field.monsterSlots[0]} />
        <Slot game={this} me={me} in={Game.MONSTER_SLOTS} i={1} card={field.monsterSlots[1]} />
        <Slot game={this} me={me} in={Game.MONSTER_SLOTS} i={2} card={field.monsterSlots[2]} />
        <Slot game={this} me={me} in={Game.MONSTER_SLOTS} i={3} card={field.monsterSlots[3]} />
      </div>
      <div>
        <Slot game={this} me={me} in={Game.GRAVEYARD} i={0} card={field.graveyard[0]} />
        <Slot game={this} me={me} in={Game.SPELL_SLOTS} i={0} card={field.spellSlots[0]} />
        <Slot game={this} me={me} in={Game.SPELL_SLOTS} i={1} card={field.spellSlots[1]} />
        <Slot game={this} me={me} in={Game.SPELL_SLOTS} i={2} card={field.spellSlots[2]} />
        <Slot game={this} me={me} in={Game.SPELL_SLOTS} i={3} card={field.spellSlots[3]} />
      </div>
      <div>
        {me.hand.map((c, i) => (<Slot game={this} me={me} in={Game.HAND} i={i} card={c} />))}
        <span className="Mstart(5px)">
          {s.selectedAction && s.selectedParams.length >= s.selectedAction.params.length && <span>
            <button onClick={this.confirmAction}>confirm action</button>
          </span>}
          - {message} -
          {s.err && <span className="C(red)"> [{s.err}] </span>}
          {s.selectedAction && <span>
            {(s.selectedAction.name === 'summon' || s.selectedAction.name === 'changeDisplay') && <select name="display" value={s.display} onChange={this.onChange}>
              <option value="HIDDEN">HIDDEN</option>
              <option value="REVEALED">REVEALED</option>
            </select>}
            {(s.selectedAction.name === 'summon' || s.selectedAction.name === 'changePose') && <select name="pose" value={s.pose} onChange={this.onChange}>
              <option value="ATTACK">ATTACK</option>
              <option value="DEFENSE">DEFENSE</option>
            </select>}
          </span>}
        </span>
      </div>
      <div><b>{me.userName} ({me.life} Li)</b></div>
    </div>;
  }
}

Game.MY_TURN = 'MY_TURN';
Game.WATCHING = 'WATCHING';
Game.SUSPENDED = 'SUSPENDED';

Game.CARD = 'CARD';
Game.SLOT = 'SLOT';

Game.SELF = 'SELF';
Game.OPPONENT = 'OPPONENT';
Game.ALL = 'ALL';

Game.HAND = 'HAND';
Game.GRAVEYARD = 'GRAVEYARD';
Game.ENVIRONMENT_SLOT = 'ENVIRONMENT_SLOT';
Game.MONSTER_SLOTS = 'MONSTER_SLOTS';
Game.SPELL_SLOTS = 'SPELL_SLOTS';

export default Game;
