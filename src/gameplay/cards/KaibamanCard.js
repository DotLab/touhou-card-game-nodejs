const MonsterCard = require('./MonsterCard');
/**
 * Kaibaman Card
 * @extends MonsterCard
 */
class KaibamanCard extends MonsterCard {
  constructor() {
    super(KaibamanCard.Name, KaibamanCard.Desc, KaibamanCard.ImgUrl, 3, 200, 700);
  }
}

KaibamanCard.Name = 'Kaibaman';
KaibamanCard.ImgUrl = '/imgs/card-kaibaman.png';

module.exports = KaibamanCard;
