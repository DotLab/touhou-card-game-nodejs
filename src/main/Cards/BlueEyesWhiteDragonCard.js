const MonsterCard = require('./Cards/MonsterCard.js');

/**
 * Blue-Eyes White Dragon Card
 * @extends MonsterCard
 */
class BlueEyesWhiteDragonCard extends MonsterCard {
  constructor() {
    super(BlueEyesWhiteDragonCard.Name, '/imgs/BlueEyesWhiteDragon.jpg', false, 'ATT', 3, 200, 700);
  }
}

BlueEyesWhiteDragonCard.Name = 'BlueEyesWhiteDragon';
module.exports = BlueEyesWhiteDragonCard;
