const SpellCard = require('./SpellCard');
const DarkMagicianCard = require('./DarkMagicianCard');

class DarkMagicVeilCard extends SpellCard {
  constructor() {
    super(DarkMagicVeilCard.Name, DarkMagicVeilCard.Desc, DarkMagicVeilCard.ImgUrl);
  }
  canInvoke(game, player, invokeParams) {
    if (player.life <= 1000) return false;
    if (player.field.monsterSlots[invokeParams[0]] !== null) return false;
    for (let i = 0; i < player.hand.length; i += 1) {
      if (player.hand[i].name === DarkMagicianCard.Name) return true;
    }
    return false;
  }

  invoke(game, player, invokeParams) {
    for (let i = 0; i < player.hand.length; i += 1) {
      if (player.hand[i].name === DarkMagicVeilCard.Name) {
        for (let j = 0; j < player.field.spellSlots.length; j += 1) {
          if (player.field.spellSlots[j] === this) {
            player.life -= 1000;
            player.field.spellSlots[j] = null;
            player.field.graveyard.push(this);
            player.field.monsterSlots[invokeParams[0]] = player.hand[i];
            player.hand[i] = null;
            return;
          }
        }
      }
    }
  }
}

DarkMagicVeilCard.Name = 'Dark Magic Veil';
DarkMagicVeilCard.Desc = 'Pay 1000 Life Points, and Special Summon 1 "Dark Magician" from your hand.';

module.exports = DarkMagicVeilCard;
