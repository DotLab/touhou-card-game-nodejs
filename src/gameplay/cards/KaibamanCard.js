const MonsterCard = require('./MonsterCard');
/**
 * Kaibaman Card
 * @extends MonsterCard
 */
class KaibamanCard extends MonsterCard {
  constructor() {
    super(KaibamanCard.Name, KaibamanCard.Desc, '/imgs/Kaibaman.jpg', 3, 200, 700);
  }

  canInvoke(player) {
    for (let i = 0; i < player.hand.length; i += 1) {
      if (player.hand[i].name === 'Blue-Eyes White Dragon') return true;
      return false;
    }
  }

  invoke(game, player) {
    game.summo;
  }
}

KaibamanCard.Name = 'Kaibaman';
KaibamanCard.Desc = 'You can Tribute this card; Special Summon 1 "Blue-Eyes White Dragon" from your hand.';

module.exports = KaibamanCard;
