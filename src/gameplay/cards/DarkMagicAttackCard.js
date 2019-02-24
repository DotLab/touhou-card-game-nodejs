const SpellCard = require('./SpellCard');
const DarkMagicianCard = require('./DarkMagicianCard');
class DarkMagicAttackCard extends SpellCard {
  constructor() {
    super(DarkMagicAttackCard.Name, DarkMagicAttackCard.Desc, DarkMagicAttackCard.ImgUrl);
  }
  canInvoke(player) {
    for (let i = 0; i < player.field.monsterSlots.length; i += 1) {
      if (player.field.monsterSlots[i] !== null && player.field.monsterSlots[i].name === DarkMagicianCard.Name) return true;
    }
    return false;
  }

  // invokeParams: [opponentId]
  invoke(game, player, invokeParams) {
    const target = game.players[game.playerIndexById[invokeParams]];
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
}

DarkMagicAttackCard.Name = 'Dark Magic Attack';
DarkMagicAttackCard.Desc = 'If you control "Dark Magician": Destroy all Spell and Trap Cards your opponent controls.';

module.exports = DarkMagicAttackCard;
