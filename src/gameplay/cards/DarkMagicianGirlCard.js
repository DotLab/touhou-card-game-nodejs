const MonsterCard = require('./MonsterCard');
const DarkMagicianCard = require('./DarkMagicianCard');
/**
 * DarkMagicianGirl Card
 * @extends MonsterCard
 */
class DarkMagicianGirlCard extends MonsterCard {
  constructor() {
    super(DarkMagicianGirlCard.Name, DarkMagicianGirlCard.Desc, '/imgs/DarkMagicianGirl.jpg', 6, 2000, 1700);
    this.hasInvoked = false;
  }

  canInvoke(game, player, invokeParams) {
    return !this.hasInvoked;
  }

  invoke(game, player, invokeParams) {
    let count = 0;
    for (let i = 0; i < player.field.graveyard.length; i += 1) {
      if (player.field.graveyard[i].name === DarkMagicianCard.Name) count += 1;
    }
    this.atk += (DarkMagicianCard.AtkIncrease * count);
    this.hasInvoked = true;
  }
}

DarkMagicianGirlCard.Name = 'DarkMagicianGirl';
DarkMagicianGirlCard.Desc = 'This card gains 300 ATK for every "Dark Magician" in your Graveyard.';
DarkMagicianCard.AtkIncrease= 300;
module.exports = DarkMagicianGirlCard;
