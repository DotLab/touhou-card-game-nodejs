const MonsterCard = require('./MonsterCard');
const BlueEyesWhiteDragonCard = require('./BlueEyesWhiteDragonCard');

/**
 * Kaibaman Card
 * @extends MonsterCard
 */
class KaibamanCard extends MonsterCard {
  constructor() {
    super(KaibamanCard.Name, '', '/imgs/Kaibaman.jpg', 3, 200, 700);
  }

  /**
   * You can Tribute this card; Special Summon 1 "Blue-Eyes White Dragon" from your hand.
   * @param {Player} owner Card owner
   * @param {Player} target Effect target
   * @return {string|undefined}
   */
  effect(owner, target) {
    const index = owner.findCardInHandByName(BlueEyesWhiteDragonCard.Name);
    if (index === -1) {
      return 'card not in hand';
    }

    const card = owner.removeCardInHand(index);
    // tribute kaibaman
    const kbIndex = owner.findCardOnFieldById(KaibamanCard.id);
    owner.killMonsterCardOnField(kbIndex);
    // Summon BlueEyesWhiteDragonCard
    card.mode = this.mode;
    owner.placeCardOnField(kbIndex, card);
  }
}

KaibamanCard.Name = 'Kaibaman';

module.exports = KaibamanCard;
