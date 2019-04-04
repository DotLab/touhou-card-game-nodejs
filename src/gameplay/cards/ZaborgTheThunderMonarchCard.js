const MonsterCard = require('./MonsterCard');

/**
 * ZaborgTheThunderMonarch Card
 * @extends MonsterCard
 */
class ZaborgTheThunderMonarchCard extends MonsterCard {
  constructor() {
    super(ZaborgTheThunderMonarchCard.Name, ZaborgTheThunderMonarchCard.Desc, ZaborgTheThunderMonarchCard.ImgUrl, 5, 2400, 1000);
    this.activated = false;
  }

  canInvoke(game, player, invokeParams) {
    return !this.activated;
  }

  /**
   * invoke power
   * @param {object } game
   * @param {object} player
   * @param {array} invokeParams - an array of 2 numbers
   * 1st number is the opponent player's index
   * 2nd number is the opponent player's monster card index
   * set value to null if choose nothing
   */
  invoke(game, player, invokeParams) {
    if (invokeParams[0]===null) return;
    const target = game.players[invokeParams[0]];
    const targetCard = target.field.monsterSlots[invokeParams[1]];
    target.field.graveyard.push(targetCard);
    target.field.monsterSlots[invokeParams[1]] = null;
    this.activated = true;
  }
}

ZaborgTheThunderMonarchCard.Name = 'Zaborg the Thunder Monarch';
ZaborgTheThunderMonarchCard.Desc = 'If this card is Tribute Summoned: Target 1 monster on the field; destroy that target.';
ZaborgTheThunderMonarchCard.ImgUrl = '/imgs/card-zaborgTheThunderMonarch.png';

module.exports = ZaborgTheThunderMonarchCard;
