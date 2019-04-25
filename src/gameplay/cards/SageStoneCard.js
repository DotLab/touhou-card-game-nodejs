const SpellCard = require('./SpellCard');
const DarkMagicianCard = require('./DarkMagicianCard');
const DarkMagicianGirlCard = require('./DarkMagicianGirlCard');
const Card = require('./Card');

const Game = require('../Game');

/** @typedef {import('../Player')} Player */

/**
 * SageStoneCard
 * @extends SpellCard
 */
class SageStoneCard extends SpellCard {
  constructor() {
    super(SageStoneCard.Name, SageStoneCard.Desc, SageStoneCard.Url);
  }

  /**
   * Check if can invoke
   * @param {Game} game
   * @param {Player} player
   * @param {Array} invokeParams
   * @return {Boolean}
   */
  canInvoke(game, player, invokeParams) {
    for (let i = 0; i < player.field.monsterSlots.length; i += 1) {
      if (player.field.monsterSlots[i] !== null && player.field.monsterSlots[i].name === DarkMagicianGirlCard.Name) {
        if (player.field.monsterSlots[i].display == Card.REVEALED) {
          return true;
        }
      }
    }
    return false;
  }

  /**
   * @param {Game} game
   * @param {Player} player
   * @param {Array<String>} invokeParams
   */
  invoke(game, player, invokeParams) {
    const slotId = invokeParams[0];

    player.field.killSpellById(this.id);

    for (let i = 0; i < player.hand.length; i += 1) {
      if (player.hand[i].name === DarkMagicianCard.Name) {
        const card = player.removeCardInHand(i);
        player.field.setSlot(slotId, card);
        card.summon(Card.REVEALED, Card.ATTACK);
        return;
      }
    }

    for (let i = 0; i < player.deck.length; i += 1) {
      if (player.deck[i].name === DarkMagicianCard.Name) {
        player.field.setSlot(slotId, player.deck[i]);
        player.deck.splice(i, 1);
        return;
      }
    }
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
            {select: Game.SLOT, in: Game.MONSTER_SLOTS, of: Game.SELF, desc: 'select an empty slot in the monster slots to special summon'},
          ],
        },
      ],
    };
  }
}


SageStoneCard.Name = 'Sage Stone';
SageStoneCard.Desc = 'If you control a face-up "Dark Magician Girl": Special Summon 1 "Dark Magician" from your hand or Deck.';
SageStoneCard.Url = '/imgs/cards/SageStoneCard.png';

module.exports = SageStoneCard;
