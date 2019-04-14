import React from 'react';

import Game from './Game';

export default class Slot extends React.Component {
  constructor(props) {
    super(props);

    this.app = props.app;

    this.onClick = this.onClick.bind(this);
    this.onCardSelected = this.onCardSelected.bind(this);
  }

  onClick() {
    const p = this.props;
    if (!p.game.state.me) return;

    /** @type {Game} */
    const game = p.game;
    const card = p.card;

    if (p.me.userId === game.state.me.userId) {  // if is self card / slot
      if (!game.state.selectedCard || !card || game.state.selectedCard.id !== card.id) {
        if (card) {
          game.setState({
            selectedCard: card,
            availableActions: card.actions.filter(x => this.checkActionAvailable(x)),
            selectedAction: null,
            selectedParams: [],
          });
        } else {
          game.setState({
            selectedCard: null,
            availableActions: [],
            selectedAction: null,
            selectedParams: [],
          });
        }
      }
    }
  }

  onCardSelected() {
    const p = this.props;

    /** @type {Game} */
    const game = p.game;
    const card = p.card;

    const currentParam = game.state.selectedAction.params[game.state.selectedParams.length];
    // append cardId or slotId
    game.appendParam(currentParam.select === Game.SLOT ? p.slotId : card.id);
  }

  onAction(action) {
    const game = this.props.game;
    if (!game.state.selectedAction) {
      game.setState({selectedAction: action});
    }
  }

  checkActionAvailable(action) {
    switch (action.stage) {
      case Game.MY_TURN: if (this.props.game.state.me.stage !== Game.MY_TURN) return false; break;
      default: break;
    }

    switch (action.in) {
      case Game.HAND: if (this.props.in !== Game.HAND) return false; break;
      case Game.MONSTER_SLOTS: if (this.props.in !== Game.MONSTER_SLOTS) return false; break;
      case Game.SPELL_SLOTS: if (this.props.in !== Game.SPELL_SLOTS) return false; break;
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
      default: return false;
    }

    switch (curParam.in) {
      case Game.HAND: if (p.in !== Game.HAND) return false; break;
      case Game.MONSTER_SLOTS: if (p.in !== Game.MONSTER_SLOTS) return false; break;
      case Game.SPELL_SLOTS: if (p.in !== Game.SPELL_SLOTS) return false; break;
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
    const p = this.props;

    const height = p.in === Game.HAND ? 'H(100px)' : 'H(200px)';

    /** @type {Game} */
    const game = p.game;
    const card = p.card;

    const shouldShowActionSelect = game.state.selectedAction && this.canBeSelected();

    return <div 
      className="Trsp(a) Trsdu(.2s) D(ib) Pos(r) Lh(0) Z(1):h Scale(1.2):h Brightness(1.1):h" 
      onClick={!game.state.selectedAction ? this.onClick : undefined}
    >
      {shouldShowActionSelect && <div className="Pos(a) T(0) Start(0) Z(1)">
        <button className="Bdw(0) Lh(1) btn-primary p-0 m-0 rounded" onClick={this.onCardSelected}>select</button>
      </div>}
      <img 
        className={'D(i) Bxsh($box-shadow):h Miw(50px) ' + height + (card && card.pose === 'DEFENSE' ? ' Rotate($-90deg)' : '')} 
        src={!card ? 
            '/imgs/card-placeholder.png' : 
            ((card.display === 'HIDDEN' || ((!p.game.state.me || p.me.userId !== p.game.state.me.userId) && p.in === 'HAND')) ? 
              '/imgs/card-back.png' : 
              card.imgUrl)}
        alt={!card ? 'Slot' : card.name}
      />
    </div>;
  }
}
