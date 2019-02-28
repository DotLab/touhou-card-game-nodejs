const MonsterCard = require('./MonsterCard.js');

/**
 * Blue-Eyes White Dragon Card
 * @extends MonsterCard
 */
class BlueEyesWhiteDragonCard extends MonsterCard {
  constructor() {
    super(BlueEyesWhiteDragonCard.Name, '', '/imgs/card-blue-eyes-white-dragon.jpg', 3, 200, 700);
  }
}

BlueEyesWhiteDragonCard.Name = 'Blue-Eyes White Dragon';
BlueEyesWhiteDragonCard.ImgUrl = '/imgs/blue-eyes-white-dragon.png';

module.exports = BlueEyesWhiteDragonCard;
