const Card = require('./Card');
const Game = require('../Game');

/** @typedef {import('../Player')} Player */

class SpellCard extends Card {
  constructor(name, desc, imgUrl) {
    super(name, desc, imgUrl);
  }

  /**
   * Check if can place\
   * @return {Boolean}
   */
  canPlace() {
    return true;
  }

  /**
   * Place card on ground
   * @param {String} display
   */
  place(display) {
    this.display = display;
  }

  /**
   * Check if can invoke
   * @param {Game} game
   * @param {Player} player
   * @param {Array} invokeParams
   * @return {Boolean}
   */
  canInvoke(game, player, invokeParams) {
    return true;
  }

  /**
   * Take snapshot
   * @return {Object}
   */
  takeSnapshot() {
    return {
      ...super.takeSnapshot(),
      actions: [
        {
          name: 'place',
          desc: 'place this spell to the field',
          in: Game.HAND,
          params: [
            {select: Game.SLOT, in: Game.SPELL_SLOTS, of: Game.SELF, desc: 'select an empty spell slot to place the spell in'},
            {select: Game.DISPLAY, desc: 'select the display of the spell'},
          ],
        },
        {
          name: 'changeDisplay',
          desc: 'change the display of this spell',
          in: Game.SPELL_SLOTS,
          params: [
            {select: Game.DISPLAY, desc: 'select the display of the spell'},
          ],
        },
      ],
    };
  }
}

module.exports = SpellCard;
