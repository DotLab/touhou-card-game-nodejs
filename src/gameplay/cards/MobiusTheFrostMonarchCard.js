const MonsterCard = require('./MonsterCard');

/**
 * MobiusTheFrostMonarch Card
 * @extends MonsterCard
 */
class MobiusTheFrostMonarchCard extends MonsterCard {
  constructor() {
    super(MobiusTheFrostMonarchCard.Name, MobiusTheFrostMonarchCard.Desc, MobiusTheFrostMonarchCard.ImgUrl, 6, 2400, 1000);
    this.activated = false;
  }

  canInvoke(game, player, invokeParams) {
    return !this.activated;
  }

  /**
   * invoke power
   * @param {object } game
   * @param {object} player
   * @param {array} invokeParams - an array of 4 numbers
   * 1st number is the first player's index
   * 2nd number is the first player's spell card index
   * 3rd number is the second player's index
   * 4th number is the second player's spell card index
   * set value to null if choose nothing
   */
  invoke(game, player, invokeParams) {
    for (let i = 0; i <invokeParams.length; i+=2) {
      if (invokeParams[i]===null) continue;
      const target = game.players[invokeParams[i]];
      // console.log(target);
      const targetCard = target.field.spellSlots[invokeParams[i+1]];
      target.field.graveyard.push(targetCard);
      target.field.spellSlots[invokeParams[i+1]] = null;
    }
    this.activated = true;
  }
}

MobiusTheFrostMonarchCard.Name = 'Mobius the Frost Monarch';
MobiusTheFrostMonarchCard.Desc = 'When this card is Tribute Summoned: You can target up to 2 Spell/Trap Cards on the field; destroy those targets.';
MobiusTheFrostMonarchCard.ImgUrl = '/imgs/card-mobiusThe FrostMonarch.png';

module.exports = MobiusTheFrostMonarchCard;
