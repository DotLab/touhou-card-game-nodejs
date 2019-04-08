const MonsterCard = require('./MonsterCard.js');

/**
 * Dark Magician Card
 * @extends MonsterCard
 */
class DarkMagicianCard extends MonsterCard {
  constructor() {
    super(DarkMagicianCard.Name, 'The ultimate wizard in terms of attack and defense.', '/imgs/cards/DarkMagicianCard.png', 7, 2500, 2100);
  }
}

DarkMagicianCard.Name = 'Dark Magician';

module.exports = DarkMagicianCard;
