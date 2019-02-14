const MonsterCard = require('./MonsterCard');
const BlueEyesWhiteDragon = require('./BlueEyesWhiteDragon');

class KaibaManCard extends MonsterCard {
  constructor() {
    super(KaibaManCard.Name, '/imgs/KaibaMan.jpg', false, 'ATT', 3, 200, 700);
  }

  /**
   * You can Tribute this card; Special Summon 1 "Blue-Eyes White Dragon" from your hand.
   * @param {Player} owner Card owner
   * @param {Player} target Effect target
   * @return {string|undefined}
   */
  effect(owner, target) {
    const index = owner.findCardInHandByName(BlueEyesWhiteDragon.Name);
    if (index === -1) {
      return 'card not in hand';
    }

    const card = owner.removeCardInHand(index);
    // tribute kaibaman
    const kbIndex = owner.findCardOnFieldById(KaibaManCard.id);
    owner.killMonsterCardOnField(kbIndex);
    // Summon BEWD
    card.mode = this.mode;
    owner.placeCardOnField(kbIndex, card);
  }
}

KaibaManCard.Name = 'KaibaMan';
module.exports = KaibaManCard;
