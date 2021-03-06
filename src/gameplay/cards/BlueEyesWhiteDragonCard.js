const MonsterCard = require('./MonsterCard.js');

/**
 * Blue-Eyes White Dragon Card
 * @extends MonsterCard
 */
class BlueEyesWhiteDragonCard extends MonsterCard {
  constructor() {
    super(BlueEyesWhiteDragonCard.Name, BlueEyesWhiteDragonCard.Desc, BlueEyesWhiteDragonCard.ImgUrl, 8, BlueEyesWhiteDragonCard.Atk, BlueEyesWhiteDragonCard.Dfs);
  }
}

BlueEyesWhiteDragonCard.Name = 'Blue-Eyes White Dragon';
BlueEyesWhiteDragonCard.Desc = 'This legendary dragon is a powerful engine of destruction. Virtually invincible, very few have faced this awesome creature and lived to tell the tale.';
BlueEyesWhiteDragonCard.ImgUrl = '/imgs/cards/BlueEyesWhiteDragonCard.png';
BlueEyesWhiteDragonCard.Atk = 3000;
BlueEyesWhiteDragonCard.Dfs = 2500;

module.exports = BlueEyesWhiteDragonCard;
