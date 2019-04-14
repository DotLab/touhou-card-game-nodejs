const SpellCard = require('./SpellCard');
const DarkMagicianCard = require('./DarkMagicianCard');

const Game = require('../Game');
/** @typedef {import('../Player')} Player */

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
    const cardId = invokeParams[0];
    const target = game.findCardOwnerById(cardId);

    if (!target.field.findCardById(cardId)) return false;
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

    // const target = game.players[game.playerIndexById[invokeParams[0]]];
    // push this to graveyard
    // for (let i = 0; i < player.field.spellSlots.length; i += 1) {
    //   if (player.field.spellSlots[i] !== null && player.field.spellSlots[i] === this) {
    //     player.field.graveyard.push(this);
    //     player.field.spellSlots[i] = null;
    //   }
    // }
    player.field.killSpellById(this.id);

    const target = game.findCardOwnerById(cardId);
    target.field.killMonsterById(cardId);
    // target.field.graveyard.push(target.field.monsterSlots[invokeParams[1]]);
    // target.field.monsterSlots[invokeParams[1]] = null;
  }

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
