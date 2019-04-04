import React from 'react';

import Game from './Game';

// import debug from 'debug';
// const log = debug('tcg:Slot');

// import {formatDate, formatTime} from './utiles';

export default class Slot extends React.Component {
  constructor(props) {
    super(props);

    this.app = props.app;

    this.onClick = this.onClick.bind(this);

    this.state = {
    };
  }

  onClick() {
    const p = this.props;
    if (!p.game.state.me) return;

    const game = p.game;
    const card = p.card;
    if (!game.state.selectedAction) {
      if (p.me.userId === p.game.state.me.userId && card && (!p.game.state.selectedCard || game.state.selectedCard.id !== card.id)) {
        game.setState({selectedCard: card, selectedSlot: this});
      }
    } else if (this.canBeSelected()) {
      game.setState({selectedParams: [
        ...game.state.selectedParams,
        p.me.i,
        p.i,
      ]});
    }
  }

  onAction(action) {
    const game = this.props.game;
    if (!game.state.selectedAction) {
      game.setState({selectedAction: action});
    }
  }

  shouldShowAction(action) {
    if (!this.props.game.state.me) return false;
    // log(this.props.game.state.me.stage, this.props.in);

    switch (action.stage) {
      case Game.MY_TURN: if (this.props.game.state.me.stage !== Game.MY_TURN) return false; break;
      default: break;
    }

    switch (action.in) {
      case Game.HAND: if (this.props.in !== Game.HAND) return false; break;
      case Game.MONSTER_SLOTS: if (this.props.in !== Game.MONSTER_SLOTS) return false; break;
      default: break;
    }

    return true;
  }

  canBeSelected() {
    if (!this.props.game.state.me) return false;

    const p = this.props;
    const action = p.game.state.selectedAction;
    const params = p.game.state.selectedParams;
    const curParam = action.params[params.length];

    if (!curParam) return false;

    // log(curParam.select, !p.card, curParam.in, p.in, curParam.of, p.me.userId !== p.game.state.me.userId);

    switch (curParam.select) {
      case Game.SLOT: if (p.card) return false; break;
      case Game.CARD: if (!p.card) return false; break;
      default: break;
    }

    switch (curParam.in) {
      case Game.HAND: if (p.in !== Game.HAND) return false; break;
      case Game.MONSTER_SLOTS: if (p.in !== Game.MONSTER_SLOTS) return false; break;
      default: break;
    }

    switch (curParam.of) {
      case Game.SELF: if (p.me.userId !== p.game.state.me.userId) return false; break;
      case Game.OPPONENT: if (p.me.userId === p.game.state.me.userId) return false; break;
      default: break;
    }

    return true;
  }

  render() {
    // const s = this.state;
    const p = this.props;

    const height = p.in === Game.HAND ? 'H(100px)' : 'H(200px)';

    const card = p.card;
    const shouldShowActions = card && p.game.state.selectedCard && p.game.state.selectedCard.id === card.id;
    const shouldShowActionSelect = p.game.state.selectedAction && this.canBeSelected();

    return <div className="Trsp(a) Trsdu(.2s) D(ib) Pos(r) Lh(0) Scale(1.2):h Brightness(1.1):h" onClick={this.onClick}>
      {shouldShowActionSelect && <div className="Pos(a) T(0) Start(0) Z(1)">
        <button className="Bdw(0) Lh(1) btn-primary p-0 m-0 rounded">select</button>
      </div>}
      {!p.game.state.selectedAction && shouldShowActions && <div className="Pos(a) T(0) Start(0) Z(1)">
        {card.actions.filter((a) => 
          this.shouldShowAction(a)).map((a, i) => (<button key={i} className="Bdw(0) Lh(1) btn-secondary p-0 m-0 rounded" onClick={() => this.onAction(a)}>{a.name}</button>))}
      </div>}
      <img className={'D(i) Bxsh($box-shadow):h ' + height + (card && card.pose === 'DEFENSE' ? ' Rotate($-90deg)' : '')} src={!card ? '/imgs/card-placeholder.png' : ((card.display === 'HIDDEN' || ((!p.game.state.me || p.me.userId !== p.game.state.me.userId) && p.in === 'HAND')) ? '/imgs/card-back.png' : card.imgUrl)} alt=""/>
    </div>;
  }
}
