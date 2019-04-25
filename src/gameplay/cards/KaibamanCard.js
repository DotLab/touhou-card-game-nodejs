const MonsterCard = require('./MonsterCard');
const BlueEyesWhiteDragonCard = require('./BlueEyesWhiteDragonCard');
const Card = require('./Card');
const Game = require('../Game');

/** @typedef {import('../Player')} Player */

/**
 * Kaibaman Card
 * @extends MonsterCard
 */
class KaibamanCard extends MonsterCard {
  constructor() {
    super(KaibamanCard.Name, KaibamanCard.Desc, KaibamanCard.ImgUrl, 3, 200, 700);
  }

  /**
   * Check if can invoke
   * @param {Game} game
   * @param {Player} player
   * @return {Boolean}
   */
  canInvoke(game, player) {
    for (let i = 0; i < player.hand.length; i += 1) {
      if (player.hand[i].name === BlueEyesWhiteDragonCard.Name) return true;
    }
    return false;
  }

  /**
   * Invoke card effects
   * @param {Game} game
   * @param {Player} player
   */
  invoke(game, player) {
    for (let i = 0; i < player.hand.length; i += 1) {
      if (player.hand[i].name === BlueEyesWhiteDragonCard.Name) {
        for (let j = 0; j < player.field.monsterSlots.length; j += 1) {
          if (player.field.monsterSlots[j] === this) {
            player.field.monsterSlots[j] = null;
            player.field.graveyard.push(this);
            const card = player.removeCardInHand(i);
            player.field.monsterSlots[j] = card;
            card.summon(Card.REVEALED, Card.ATTACK);
            return;
          }
        }
      }
    }
  }

  /**
   * Take snapshot
   * @return {Object}
   */
  takeSnapshot() {
    const shot = super.takeSnapshot();
    return {
      ...shot,
      actions: [
        ...shot.actions,
        {
          name: 'invokeMonsterEffect',
          desc: 'invoke the effects of this monster',
          in: Game.MONSTER_SLOTS,
          params: [],
        },
      ],
    };
  }
}

KaibamanCard.Name = 'Kaibaman';
KaibamanCard.Desc = 'You can Tribute this card; Special Summon 1 "Blue-Eyes White Dragon" from your hand.';
KaibamanCard.ImgUrl = '/imgs/cards/KaibamanCard.png';

module.exports = KaibamanCard;
