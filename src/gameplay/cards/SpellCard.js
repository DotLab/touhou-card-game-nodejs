const Card = require('./Card');
const Game = require('../Game');

class SpellCard extends Card {
  constructor(name, desc, imgUrl) {
    super(name, desc, imgUrl);
  }

  canPlace() {
    return true;
  }

  place(display) {
    this.display = display;
  }

  // canActivate(game, owner, actor, action, actionParams, phase, trapParams) {
  //   return false;
  // }

  // activate(game, owner, actor, action, actionParams, phase, trapParams) {
  // }

  canInvoke(game, player, invokeParams) {
    return true;
  }

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
