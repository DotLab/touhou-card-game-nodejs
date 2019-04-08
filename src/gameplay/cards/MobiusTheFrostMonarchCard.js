const MonsterCard = require('./MonsterCard');
const Game = require('../Game');

/**
 * MobiusTheFrostMonarch Card
 * @extends MonsterCard
 */
class MobiusTheFrostMonarchCard extends MonsterCard {
  constructor() {
    super(MobiusTheFrostMonarchCard.Name, MobiusTheFrostMonarchCard.Desc, MobiusTheFrostMonarchCard.ImgUrl, 6, 2400, 1000);
    this.activated = false;
  }

  /**
   * Check whether the monster can invoke his ability
   * @param {Object} game
   * @param {Object} player
   * @param {Object} invokeParams - should be null
   * @return {boolean} whether it can activate its ability
   */
  canInvoke(game, player, invokeParams) {
    // once it activates, it can no more activate
    return !this.activated;
  }

  /**
   * invoke power
   * @param {Game} game
   * @param {Player} player
   * @param {Array<String>} invokeParams - an array of 4 numbers
   * [0]: first cardId
   * [1]: second cardId
   */
  invoke(game, player, invokeParams) {
    for (let i = 0; i < invokeParams.length; i++) {
      if (!invokeParams[i]) continue;

      const spellId = invokeParams[i];
      const target = game.findCardOwnerById(spellId);
      target.field.killSpellById(spellId);
    }
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
          in: Game.SPELL_SLOTS,
          params: [
            {select: Game.CARD, in: Game.SPELL_SLOTS, of: Game.OPPONENT, desc: 'select the first spell to destroy'},
            {select: Game.CARD, in: Game.SPELL_SLOTS, of: Game.OPPONENT, desc: 'select the second spell to destroy'},
          ],
        },
      ],
    };
  }
}

MobiusTheFrostMonarchCard.Name = 'Mobius the Frost Monarch';
MobiusTheFrostMonarchCard.Desc = 'When this card is Tribute Summoned: You can target up to 2 Spell/Trap Cards on the field; destroy those targets.';
MobiusTheFrostMonarchCard.ImgUrl = '/imgs/cards/MobiusTheFrostMonarchCard.png';

module.exports = MobiusTheFrostMonarchCard;
