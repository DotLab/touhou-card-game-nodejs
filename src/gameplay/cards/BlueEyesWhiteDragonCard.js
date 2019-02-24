const MonsterCard = require('./MonsterCard.js');

/**
 * Blue-Eyes White Dragon Card
 * @extends MonsterCard
 */
class BlueEyesWhiteDragonCard extends MonsterCard {
  constructor() {
    super(BlueEyesWhiteDragonCard.Name, 'This legendary dragon is a powerful engine of destruction. Virtually invincible, very few have faced this awesome creature and lived to tell the tale.', '/imgs/BlueEyesWhiteDragon.jpg', 8, 3000, 2500);
  }
}

BlueEyesWhiteDragonCard.Name = 'Blue-Eyes White Dragon';

module.exports = BlueEyesWhiteDragonCard;
