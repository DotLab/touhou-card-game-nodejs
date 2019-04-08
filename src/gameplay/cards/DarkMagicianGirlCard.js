const MonsterCard = require('./MonsterCard');
const DarkMagicianCard = require('./DarkMagicianCard');
const Game = require('../Game');

/**
 * DarkMagicianGirl Card
 * @extends MonsterCard
 */
class DarkMagicianGirlCard extends MonsterCard {
  constructor() {
    super(DarkMagicianGirlCard.Name, DarkMagicianGirlCard.Desc, '/imgs/cards/DarkMagicianGirlCard.png', 6, 2000, 1700);
    this.hasInvoked = false;
  }

  canInvoke() {
    return !this.hasInvoked;
  }

  invoke(game, player) {
    let count = 0;
    for (let i = 0; i < player.field.graveyard.length; i += 1) {
      if (player.field.graveyard[i].name === DarkMagicianCard.Name) count += 1;
    }
    this.atk += (DarkMagicianGirlCard.AtkIncrease * count);
    this.hasInvoked = true;
  }

  takeSnapshot() {
    const shot = super.takeSnapshot();
    return {
      ...shot,
      actions: [
        ...shot.actions,
        {
          name: 'invoke',
          decs: 'invoke the effects of this monster',
          stage: Game.MY_TURN,
          in: Game.SPELL_SLOTS,
          params: [],
        },
      ],
    };
  }
}

DarkMagicianGirlCard.Name = 'Dark Magician Girl';
DarkMagicianGirlCard.Desc = 'This card gains 300 ATK for every "Dark Magician" in your Graveyard.';
DarkMagicianGirlCard.AtkIncrease= 300;

module.exports = DarkMagicianGirlCard;
