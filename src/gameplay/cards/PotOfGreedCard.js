const SpellCard = require('./SpellCard');
const Game = require('../Game');

/** @typedef {import('../Player')} Player */

/**
 * PotOfGreedCard
 * @extends SpellCard
 */
class PotOfGreedCard extends SpellCard {
  constructor() {
    super(PotOfGreedCard.Name, PotOfGreedCard.Desc, PotOfGreedCard.ImgUrl);
  }

  /**
   * Invoke card effects
   * @param {Game} game
   * @param {Player} player
   */
  invoke(game, player) {
    for ( let i = 0; i < PotOfGreedCard.CardsDraw; i++) {
      player.draw();
    }

    // player.draw();
    player.field.graveyard.push(this);
    for (let i = 0; i < player.field.spellSlots.length; i += 1) {
      if (player.field.spellSlots[i] !== null && player.field.spellSlots[i] === this) player.field.spellSlots[i] = null;
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
          params: [],
        },
      ],
    };
  }
}

PotOfGreedCard.Name = 'Pot Of Greed';
PotOfGreedCard.Desc = 'Draw 2 cards.';
PotOfGreedCard.ImgUrl = '/imgs/cards/PotOfGreedCard.png';
PotOfGreedCard.CardsDraw = 2;
module.exports = PotOfGreedCard;
