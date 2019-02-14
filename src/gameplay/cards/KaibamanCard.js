const MonsterCard = require('./MonsterCard');
/**
 * Kaibaman Card
 * @extends MonsterCard
 */
class KaibamanCard extends MonsterCard {
  constructor() {
    super(KaibamanCard.Name, '', '/imgs/Kaibaman.jpg', 3, 200, 700);
  }
}

KaibamanCard.Name = 'Kaibaman';

module.exports = KaibamanCard;
