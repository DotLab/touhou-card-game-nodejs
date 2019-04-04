const MonsterCard = require('./MonsterCard');

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
   * @param {object } game
   * @param {object} player
   * @param {array} invokeParams - an array of 3 numbers
   * 1st number is the opponent player's index
   * 2nd number is the opponent player card type
   * 0 - being monster, 1 - being spell
   * 3rd number is the opponent card index
   * set value to null if choose nothing
   */
  invoke(game, player, invokeParams) {
    if (invokeParams[0] === null) return;
    const target = game.players[invokeParams[0]];
    const type = invokeParams[1] === 0 ? 'monsterSlots' : 'spellSlots';
    const targetDeck = target.deck;
    const targetCard = target.field[type][invokeParams[2]];
    targetDeck.push(targetCard);
    target.field[type][invokeParams[2]] = null;

    this.activated = true;
  }
}

RaizaTheStormMonarchCard.Name = 'Raiza the Storm Monarch';
RaizaTheStormMonarchCard.Desc = 'If this card is Tribute Summoned: Target 1 card on the field; place that target on the top of the Deck';
RaizaTheStormMonarchCard.ImgUrl = '/imgs/card-raizaTheStormMonarch.png';

module.exports = RaizaTheStormMonarchCard;
