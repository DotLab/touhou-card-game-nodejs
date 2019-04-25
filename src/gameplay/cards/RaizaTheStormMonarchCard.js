const MonsterCard = require('./MonsterCard');

const Game = require('../Game');

/**
 * RaizaTheStormMonarchCard
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
   * @param {Array<String>} invokeParams - an array of 1 numbers
   * cardId
   */
  invoke(game, player, invokeParams) {
    if (!invokeParams[0]) return;

    // find the card
    const cardId = invokeParams[0];
    // find the owner of that card
    const target = game.findCardOwnerById(cardId);
    const targetCard = target.field.findCardById(cardId);
    // put that card to top of the deck
    target.deck.push(targetCard);
    // remove the card from the field
    target.field.removeCardById(cardId);

    // monster's effect could only apply once
    this.activated = true;
  }

  /**
   * take snapshot of the current card
   * @return {Object} the snapshot of the game
   */
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
