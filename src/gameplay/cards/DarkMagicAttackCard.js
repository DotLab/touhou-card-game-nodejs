const SpellCard = require('./SpellCard');
const DarkMagicianCard = require('./DarkMagicianCard');
const Game = require('../Game');

/** @typedef {import('../Player')} Player */

class DarkMagicAttackCard extends SpellCard {
  constructor() {
    super(DarkMagicAttackCard.Name, DarkMagicAttackCard.Desc, DarkMagicAttackCard.ImgUrl);
  }

  canInvoke(game, player) {
    for (let i = 0; i < player.field.monsterSlots.length; i += 1) {
      if (player.field.monsterSlots[i] !== null && player.field.monsterSlots[i].name === DarkMagicianCard.Name) return true;
    }
    return false;
  }

  /**
   * @param {Game} game
   * @param {Player} player
   * @param {[String]} invokeParams [opponentId]
   */
  invoke(game, player, invokeParams) {
    const opponentId = invokeParams[0];

    const target = game.players[game.playerIndexById[opponentId]];

    // push this to graveyard
    for (let i = 0; i < player.field.spellSlots.length; i += 1) {
      if (player.field.spellSlots[i] !== null && player.field.spellSlots[i] === this) {
        player.field.graveyard.push(this);
        player.field.spellSlots[i] = null;
      }
    }

    // destroy target's spell card
    for (let i = 0; i < target.field.spellSlots.length; i += 1) {
      if (target.field.spellSlots[i] !== null) {
        target.field.graveyard.push(target.field.spellSlots[i]);
        target.field.spellSlots[i] = null;
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
          name: 'invokeSpell',
          desc: 'invoke the effects of this spell',
          in: Game.SPELL_SLOTS,
          params: [
            {select: Game.PLAYER, desc: 'select the opponent to apply the effects'},
          ],
        },
      ],
    };
  }
}

DarkMagicAttackCard.Name = 'Dark Magic Attack';
DarkMagicAttackCard.Desc = 'If you control "Dark Magician": Destroy all Spell and Trap Cards your opponent controls.';
DarkMagicAttackCard.ImgUrl = '/imgs/cards/DarkMagicAttackCard.png';

module.exports = DarkMagicAttackCard;
