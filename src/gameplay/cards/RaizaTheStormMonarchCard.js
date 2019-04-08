const MonsterCard = require('./MonsterCard');

const Game = require('../Game');

/**
 * RaizaTheStormMonarch Card
 * @extends MonsterCard
 */
class RaizaTheStormMonarchCard extends MonsterCard {
  constructor() {
    super(RaizaTheStormMonarchCard.Name, RaizaTheStormMonarchCard.Desc, RaizaTheStormMonarchCard.ImgUrl, 6, 2400, 1000);
    this.activated = false;
  }

  canInvoke(game, player, invokeParams) {
    return !this.activated;
  }

  /**
   * invoke power
   * @param {Game} game
   * @param {Player} player
   * @param {Array<String>} invokeParams - an array of 3 numbers
   * cardId
   */
  invoke(game, player, invokeParams) {
    if (!invokeParams[0]) return;

    const cardId = invokeParams[0];
    const target = game.findCardOwnerById(cardId);
    const targetCard = target.field.findCardById(cardId);
    target.deck.push(targetCard);
    target.field.removeCardById(cardId);

    // const target = game.players[invokeParams[0]];
    // const type = invokeParams[1] === 0 ? 'monsterSlots' : 'spellSlots';
    // const targetDeck = target.deck;
    // const targetCard = target.field[type][invokeParams[2]];
    // targetDeck.push(targetCard);
    // target.field[type][invokeParams[2]] = null;

    this.activated = true;
  }

  takeSnapshot() {
    const shot = super.takeSnapshot();
    return {
      ...shot,
      actions: [
        ...shot.actions,
        {
          name: 'invokeMonsterEffect',
          desc: 'invoke the effects of this monster',
          in: Game.MONSTER_SLOTS,
          params: [
            {select: Game.CARD, desc: 'select the target card'},
          ],
        },
      ],
    };
  }
}

RaizaTheStormMonarchCard.Name = 'Raiza the Storm Monarch';
RaizaTheStormMonarchCard.Desc = 'If this card is Tribute Summoned: Target 1 card on the field; place that target on the top of the Deck';
RaizaTheStormMonarchCard.ImgUrl = '/imgs/cards/RaizaTheStormMonarchCard.png';

module.exports = RaizaTheStormMonarchCard;
