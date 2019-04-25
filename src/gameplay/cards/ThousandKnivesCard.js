const SpellCard = require('./SpellCard');
const DarkMagicianCard = require('./DarkMagicianCard');
const Game = require('../Game');

/** @typedef {import('../Player')} Player */

/**
 * ThousandKnivesCard
 * @extends SpellCard
 */
class ThousandKnivesCard extends SpellCard {
  constructor() {
    super(ThousandKnivesCard.Name, ThousandKnivesCard.Desc, ThousandKnivesCard.ImgUrl);
  }

  /**
   * @param {Game} game
   * @param {Player} player
   * @param {Array<String>} invokeParams
   * @return {Boolean}
   */
  canInvoke(game, player, invokeParams) {
    for (let i = 0; i < player.field.monsterSlots.length; i += 1) {
      if (player.field.monsterSlots[i] !== null && player.field.monsterSlots[i].name === DarkMagicianCard.Name) return true;
    }
    return false;
  }

  // invokeParams: [opponentId, opponent's monsterSLot index]
  /**
   * @param {Game} game
   * @param {Player} player
   * @param {Array<String>} invokeParams
   */
  invoke(game, player, invokeParams) {
    const cardId = invokeParams[0];

    player.field.killSpellById(this.id);

    const target = game.findCardOwnerById(cardId);
    target.field.killMonsterById(cardId);
  }

  /**
   * Take snapshot
   * @return {Object}
   */
  takeSnapshot() {
    const shot = super.takeSnapshot();
    return {
      ...shot,
      actions: [
        ...shot.actions,
        {
          name: 'invokeSpell',
          desc: 'invoke the effects of this spell',
          in: Game.SPELL_SLOTS,
          params: [
            {select: Game.CARD, in: Game.MONSTER_SLOTS, of: Game.OPPONENT, desc: 'select the target card'},
          ],
        },
      ],
    };
  }
}

ThousandKnivesCard.Name = 'Thousand Knives';
ThousandKnivesCard.Desc = 'If you control "Dark Magician": Target 1 monster your opponent controls; destroy that target.';
ThousandKnivesCard.ImgUrl = '/imgs/cards/ThousandKnivesCard.png';

module.exports = ThousandKnivesCard;
