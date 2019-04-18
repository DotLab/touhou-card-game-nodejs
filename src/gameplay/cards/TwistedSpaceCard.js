const EnvironmentCard = require('./EnvironmentCard');

/**
 * TwistedSpace Card
 * @extends EnvironmentCard
 */
class TwistedSpaceCard extends EnvironmentCard {
  constructor() {
    super(TwistedSpaceCard.Name, TwistedSpaceCard.Desc, TwistedSpaceCard.ImgUrl);
  }

  /**
   * apply effect to a monster card
   * @param {object} monsterCard
   */
  applyEnvironment(monsterCard) {
    // swap monster's attack and defense
    // this effect can only apply once.
    const temp = monsterCard.atk;
    monsterCard.atk = monsterCard.dfs;
    monsterCard.dfs = temp;
    monsterCard.hasEnvironment = true;
  }
}

TwistedSpaceCard.Name = 'Twisted Space';
TwistedSpaceCard.Desc = 'Once you summon a monster, swap its attack and defense';
TwistedSpaceCard.ImgUrl = '/imgs/card-twisted-space.png';

module.exports = TwistedSpaceCard;

