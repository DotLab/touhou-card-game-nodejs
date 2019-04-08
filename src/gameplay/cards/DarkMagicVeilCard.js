const SpellCard = require('./SpellCard');
const DarkMagicianCard = require('./DarkMagicianCard');
const Game = require('../Game');

/** @typedef {import('../Player')} Player */

class DarkMagicVeilCard extends SpellCard {
  constructor() {
    super(DarkMagicVeilCard.Name, DarkMagicVeilCard.Desc, DarkMagicVeilCard.ImgUrl);
  }

  canInvoke(game, player, invokeParams) {
    if (player.life <= DarkMagicVeilCard.LifeInvoke) return false;
    if (player.field.monsterSlots[invokeParams[0]] !== null) return false;
    for (let i = 0; i < player.hand.length; i += 1) {
      if (player.hand[i].name === DarkMagicianCard.Name) return true;
    }
    return false;
  }

  // [0]: monster index
  /**
   * @param {Game} game
   * @param {Player} player
   * @param {[String]} invokeParams [slotId]
   */
  invoke(game, player, invokeParams) {
    const slotId = invokeParams[0];

    for (let i = 0; i < player.hand.length; i += 1) {
      if (player.hand[i].name === DarkMagicVeilCard.Name) {
        for (let j = 0; j < player.field.spellSlots.length; j += 1) {
          if (player.field.spellSlots[j] === this) {
            player.life -= DarkMagicVeilCard.LifeInvoke;
            player.field.spellSlots[j] = null;
            player.field.graveyard.push(this);
            player.field.setSlot(slotId, player.hand[i]);
            player.removeCardInHand(i);
            return;
          }
        }
      }
    }
  }

  takeSnapshot() {
    const shot = super.takeSnapshot();
    return {
      ...shot,
      actions: [
        ...shot.actions,
        {
          name: 'invoke',
          decs: 'invoke the effects of this spell',
          stage: Game.MY_TURN,
          in: Game.SPELL_SLOTS,
          params: [
            {select: Game.SLOT, in: Game.MONSTER_SLOTS, of: Game.SELF, desc: 'select an empty slot in the monster slots to summon'},
          ],
        },
      ],
    };
  }
}

DarkMagicVeilCard.Name = 'Dark Magic Veil';
DarkMagicVeilCard.Desc = 'Pay 1000 Life Points, and Special Summon 1 "Dark Magician" from your hand.';
DarkMagicVeilCard.ImgUrl = '/imgs/cards/DarkMagicVeilCard.png';
DarkMagicVeilCard.LifeInvoke = 1000;

module.exports = DarkMagicVeilCard;
