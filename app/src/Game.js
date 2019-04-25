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
    this.cancelAction = this.cancelAction.bind(this);
    this.hideGame = this.hideGame.bind(this);

    this.draw = this.draw.bind(this);
    this.endTurn = this.endTurn.bind(this);

    this.state = {
      me: null,
      players: null,

      selectedCard: null,
      availableActions: [],

      selectedAction: null,
      selectedParams: [],

      err: null,

      display: 'HIDDEN',
      pose: 'DEFENSE',
    };
  }

  hideGame() {
    this.setState({
      me: null,
      players: null,
    });
  }

  onCardActionSelected(action) {
    this.setState({selectedAction: action});
  }

  appendParam(param) {
    this.setState({
      selectedParams: [
        ...this.state.selectedParams,
        param
      ]
    });
  }

  async confirmAction() {
    const s = this.state;
    console.log({name: s.selectedAction.name, params: s.selectedParams});

    let err = '';
    try {
      await this.app.genericApi1('cl_game_action', {
        name: s.selectedAction.name,
        cardId: s.selectedCard.id,
        params: s.selectedParams
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

  cancelAction() {
    this.setState({
      selectedAction: null,
      selectedParams: [],
    });
  }

  async draw() {
    let err = '';
    try {
      await this.app.genericApi1('cl_game_action', {name: 'draw'});
    } catch (e) {
      log(e);
      err = e;
    }

    this.setState({err});
  }

  async endTurn() {
    let err = '';
    try {
      await this.app.genericApi1('cl_game_action', {name: 'endTurn'});
    } catch (e) {
      log(e);
      err = e;
    }

    this.setState({err});
  }

  componentDidMount() {
    const socket = this.app.socket;

    socket.on('sv_game_update', (snapshot) => {
      log('sv_game_update', snapshot);
      const players = snapshot.players;
      const opponents = [];
      let me = null;

      for (let i = 0; i < players.length; i += 1) {
        players[i].i = i;
        if (players[i].userId === this.app.state.user.id) {
          me = players[i];
        } else {
          opponents.push(players[i]);
        }
      }

      if (me) {
        me.opponents = opponents;
        log('me', me);
        this.setState({hasEnded: snapshot.hasEnded, me, players: null});
      } else { // watcher
        this.setState({hasEnded: snapshot.hasEnded, me: null, players});
      }
    });
  }

  componentWillUnmount() {
    const socket = this.app.socket;
    socket.off('sv_game_update');
  }

  render() {
    const s = this.state;
    if (!s.me && !s.players) {
      return <div></div>;
    }

    if (!s.me) {  // watching
      return <div className="mt-2">
        <h4>you are watching the game</h4>
        {s.hasEnded && <div className="alert alert-primary">game has ended, <span className="Cur(p) alert-link" onClick={this.hideGame}>hide game</span></div>}
        {s.players.map((player) => (<div className="Mb(20px)">
          <div><b>{player.userName}</b> ({player.life} Li) <span>{player.stage === Game.MY_TURN ? "player's turn" : "waiting..."}</span></div>
          {player.life > 0 ? <div>
            <div>{player.hand.map((c, i) => (<Slot key={i} game={this} me={player} in={Game.HAND} i={i} card={c} />))}</div>
            <div>
              <Slot game={this} me={player} in={Game.SPELL_SLOTS} i={3} card={player.field.spellSlots[3]} />
              <Slot game={this} me={player} in={Game.SPELL_SLOTS} i={2} card={player.field.spellSlots[2]} />
              <Slot game={this} me={player} in={Game.SPELL_SLOTS} i={1} card={player.field.spellSlots[1]} />
              <Slot game={this} me={player} in={Game.SPELL_SLOTS} i={0} card={player.field.spellSlots[0]} />
              <Slot game={this} me={player} in={Game.GRAVEYARD} i={0} card={player.field.graveyard[player.field.graveyard.length - 1]} />
            </div>
            <div>
              <Slot game={this} me={player} in={Game.MONSTER_SLOTS} i={3} card={player.field.monsterSlots[3]} />
              <Slot game={this} me={player} in={Game.MONSTER_SLOTS} i={2} card={player.field.monsterSlots[2]} />
              <Slot game={this} me={player} in={Game.MONSTER_SLOTS} i={1} card={player.field.monsterSlots[1]} />
              <Slot game={this} me={player} in={Game.MONSTER_SLOTS} i={0} card={player.field.monsterSlots[0]} />
              <Slot game={this} me={player} in={Game.ENVIRONMENT_SLOT} i={0} card={player.field.environmentSlot} />
            </div>
          </div> : <div>player is dead, rest in peace</div>}
        </div>))}
      </div>;
    }

    const me = s.me;
    const field = me.field;

    const currentParam = s.selectedAction && s.selectedParams.length < s.selectedAction.params.length && s.selectedAction.params[s.selectedParams.length];

    return <div className="Lh(1) mt-2 Bgc(snow)">
      {s.hasEnded && <div className="alert alert-primary">game has ended, <span className="Cur(p) alert-link" onClick={this.hideGame}>hide game</span></div>}
      {/* opponents */}
      <div className="W(100%) Ovy(h) Ovx(s) Whs(nw)">
        {me.opponents.map((opponent, i) => (<div key={i} className="D(ib) Mend(20px)">
          <div><b>{opponent.userName}</b> ({opponent.life} Li) <span>{opponent.stage === Game.MY_TURN ? "opponent's turn" : "waiting..."}</span> {s.selectedAction && currentParam.select === Game.PLAYER && <button className="Bdw(0) Lh(1) btn-primary p-0 m-0 rounded" onClick={() => this.appendParam(opponent.userId)}>select</button>}</div>
          {opponent.life > 0 ? <div>
            <div>{opponent.hand.map((c, i) => (<Slot key={i} game={this} me={opponent} in={Game.HAND} i={i} card={c} />))}</div>
            <div>
              <Slot game={this} me={opponent} in={Game.SPELL_SLOTS} i={3} card={opponent.field.spellSlots[3]} />
              <Slot game={this} me={opponent} in={Game.SPELL_SLOTS} i={2} card={opponent.field.spellSlots[2]} />
              <Slot game={this} me={opponent} in={Game.SPELL_SLOTS} i={1} card={opponent.field.spellSlots[1]} />
              <Slot game={this} me={opponent} in={Game.SPELL_SLOTS} i={0} card={opponent.field.spellSlots[0]} />
              <Slot game={this} me={opponent} in={Game.GRAVEYARD} i={0} card={opponent.field.graveyard[opponent.field.graveyard.length - 1]} />
            </div>
            <div>
              <Slot game={this} me={opponent} in={Game.MONSTER_SLOTS} i={3} card={opponent.field.monsterSlots[3]} />
              <Slot game={this} me={opponent} in={Game.MONSTER_SLOTS} i={2} card={opponent.field.monsterSlots[2]} />
              <Slot game={this} me={opponent} in={Game.MONSTER_SLOTS} i={1} card={opponent.field.monsterSlots[1]} />
              <Slot game={this} me={opponent} in={Game.MONSTER_SLOTS} i={0} card={opponent.field.monsterSlots[0]} />
              <Slot game={this} me={opponent} in={Game.ENVIRONMENT_SLOT} i={0} card={opponent.field.environmentSlot} />
            </div>
          </div> : <div>opponent is dead, rest in peace</div>}
        </div>))}
      </div>
      {/* me */}
      {me.life > 0 ? <div className="Cf">
        <div className="Fl(start) Bgc(ghostwhite)">
          <div>
            <Slot game={this} me={me} in={Game.ENVIRONMENT_SLOT} i={0} card={field.environmentSlot} />
            <Slot game={this} me={me} in={Game.MONSTER_SLOTS} i={0} card={field.monsterSlots[0]} slotId={field.slotIds[0]}/>
            <Slot game={this} me={me} in={Game.MONSTER_SLOTS} i={1} card={field.monsterSlots[1]} slotId={field.slotIds[1]}/>
            <Slot game={this} me={me} in={Game.MONSTER_SLOTS} i={2} card={field.monsterSlots[2]} slotId={field.slotIds[2]}/>
            <Slot game={this} me={me} in={Game.MONSTER_SLOTS} i={3} card={field.monsterSlots[3]} slotId={field.slotIds[3]}/>
          </div>
          <div>
            <Slot game={this} me={me} in={Game.GRAVEYARD} i={0} card={field.graveyard[field.graveyard.length - 1]} />
            <Slot game={this} me={me} in={Game.SPELL_SLOTS} i={0} card={field.spellSlots[0]} slotId={field.slotIds[4]} />
            <Slot game={this} me={me} in={Game.SPELL_SLOTS} i={1} card={field.spellSlots[1]} slotId={field.slotIds[5]} />
            <Slot game={this} me={me} in={Game.SPELL_SLOTS} i={2} card={field.spellSlots[2]} slotId={field.slotIds[6]} />
            <Slot game={this} me={me} in={Game.SPELL_SLOTS} i={3} card={field.spellSlots[3]} slotId={field.slotIds[7]} />
          </div>
          <div>
            {me.hand.map((c, i) => (<Slot key={i} game={this} me={me} in={Game.HAND} i={i} card={c} />))}
          </div>
          <div><b>{me.userName} ({me.life} Li)</b></div>
        </div>
        <div>
          {s.me.stage === Game.MY_TURN ? <div>
            <h5>it is your turn, you can:</h5>
            <button className="btn btn-secondary mr-2" onClick={this.draw}>draw one card</button>
            <button className="btn btn-secondary mr-2" onClick={this.endTurn}>end turn</button>

            {/* card */}
            {s.selectedCard ? <div>
              <h5>card: {s.selectedCard.name} ({s.selectedCard.id.substring(0, 8)})</h5>
              <img className="H(100px) Mx(a) D(b) shadow" src={s.selectedCard.imgUrl} alt=""/>
              <div className="Bgc(azure)! card p-2">
                {s.selectedCard.lv && <div className="Fw(b)">LV {s.selectedCard.lv} ATK {s.selectedCard.atk} DFS {s.selectedCard.dfs}</div>}
                <div>{s.selectedCard.desc}</div>
              </div>
              
              {/* action */}
              {s.selectedAction ? <div>
                <h5>action {s.selectedAction.name}: {s.selectedAction.desc}</h5>
                <button className="btn btn-danger mr-2" onClick={this.cancelAction}>cancel action</button>

                {/* params */}
                {s.selectedParams.length < s.selectedAction.params.length ? <div>
                  <h5>parameter #{s.selectedParams.length}: {currentParam.desc}</h5>
                  {currentParam.select === Game.DISPLAY ? <div>
                    <button className="btn btn-info mr-2" onClick={() => this.appendParam('REVEALED')}>REVEALED</button>
                    <button className="btn btn-info mr-2" onClick={() => this.appendParam('HIDDEN')}>HIDDEN</button>
                  </div> : currentParam.select === Game.POSE ? <div>
                    <button className="btn btn-info mr-2" onClick={() => this.appendParam('ATTACK')}>ATTACK</button>
                    <button className="btn btn-info mr-2" onClick={() => this.appendParam('DEFENSE')}>DEFENSE</button>
                  </div> : <div>
                    click the "select" button on the slot or card
                  </div>}
                </div> : <button className="btn btn-success mr-2" onClick={this.confirmAction}>
                  confirm action
                </button>}
              </div> : <div>
                <h5>choose an action or select a different card</h5>
                {s.availableActions.map(x => <button 
                  key={x.name}
                  className="btn btn-info mr-2 mb-2"
                  onClick={() => this.onCardActionSelected(x)}
                >{x.name}</button>)}
              </div>}
            </div> : <h5>select a card to see actions</h5>}
          </div> : <h5>please wait for your turn</h5>}
        </div>
      </div> : <div>you are dead, rest in peace</div>}
    </div>;
  }
}

Game.MY_TURN = 'MY_TURN';
Game.WATCHING = 'WATCHING';
Game.SUSPENDED = 'SUSPENDED';

Game.CARD = 'CARD';
Game.SLOT = 'SLOT';
Game.DISPLAY = 'DISPLAY';
Game.POSE = 'POSE';
Game.PLAYER = 'PLAYER';

Game.SELF = 'SELF';
Game.OPPONENT = 'OPPONENT';
Game.ALL = 'ALL';

Game.HAND = 'HAND';
Game.GRAVEYARD = 'GRAVEYARD';
Game.ENVIRONMENT_SLOT = 'ENVIRONMENT_SLOT';
Game.MONSTER_SLOTS = 'MONSTER_SLOTS';
Game.SPELL_SLOTS = 'SPELL_SLOTS';

export default Game;
