const EnvironmentCard = require('./EnvironmentCard');

// TODO: kuo
class SorcerousSpellWallCard extends EnvironmentCard {
  constructor() {
    super(SorcerousSpellWallCard.Name, SorcerousSpellWallCard.Desc, SorcerousSpellWallCard.ImgUrl);
  }

  /**
   * apply effect to a monster card
   * @param {object} monsterCard
   */
  invoke(monsterCard) {
    monsterCard.atk += 300;
    monsterCard.dfs +=300;
    monsterCard.hasEnvironment = true;
  }
}

SorcerousSpellWallCard.Name = 'Sorcerous Spell Wall';
SorcerousSpellWallCard.Desc = 'All monsters you control gain 300 ATK and 300 DEF.';
SorcerousSpellWallCard.ImgUrl = '/imgs/card-sorcerous-spell-wall.png';

module.exports = SorcerousSpellWallCard;
