const EnvironmentCard = require('./EnvironmentCard');

/**
 * SorcerousSpellWallCard
 * @extends EnvironmentCard
 */
class SorcerousSpellWallCard extends EnvironmentCard {
  constructor() {
    super(SorcerousSpellWallCard.Name, SorcerousSpellWallCard.Desc, SorcerousSpellWallCard.ImgUrl);
  }

  /**
   * apply effect to a monster card
   * @param {object} monsterCard
   */
  applyEnvironment(monsterCard) {
    // the monster card gains 300 points increase in attack and defense.
    // this effect can only apply once.
    monsterCard.atk += SorcerousSpellWallCard.Atk;
    monsterCard.dfs += SorcerousSpellWallCard.Dfs;
    monsterCard.hasEnvironment = true;
  }
}

SorcerousSpellWallCard.Name = 'Sorcerous Spell Wall';
SorcerousSpellWallCard.Desc = 'All monsters you control gain 300 ATK and 300 DEF.';
SorcerousSpellWallCard.ImgUrl = '/imgs/cards/SorcerousSpellWallCard.png';
SorcerousSpellWallCard.Atk = 300;
SorcerousSpellWallCard.Dfs = 300;

module.exports = SorcerousSpellWallCard;
