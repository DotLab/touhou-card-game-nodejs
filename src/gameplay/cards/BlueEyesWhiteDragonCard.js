const MonsterCard = require('./MonsterCard.js');

/**
 * Blue-Eyes White Dragon Card
 * @extends MonsterCard
 */
class BlueEyesWhiteDragonCard extends MonsterCard {
  constructor() {
    super(BlueEyesWhiteDragonCard.Name, '', '/imgs/BlueEyesWhiteDragon.jpg', 3, 200, 700);
  }
}

BlueEyesWhiteDragonCard.Name = 'Blue-Eyes White Dragon';

module.exports = BlueEyesWhiteDragonCard;
