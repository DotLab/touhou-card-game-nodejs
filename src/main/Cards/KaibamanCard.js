const MonsterCard = require('./MonsterCard');
const BlueEyesWhiteDragon = require('./BlueEyesWhiteDragon');

class KaibaManCard extends MonsterCard {
    static Name = "KaibaMan";

    constructor() {
        super(Name,"/imgs/KaibaMan.jpg",false,"ATT",3,200,700);
    }

    /**
     * You can Tribute this card; Special Summon 1 "Blue-Eyes White Dragon" from your hand.
     * @param owner {Player} Card owner
     * @param target {Player} Effect target
     */
    effect(owner, target) {
        const index = owner.findCardInHand(BlueEyesWhiteDragon.Name);
        if (index === -1) {
            return 'card not in hand';
        }

        const card = owner.removeCardInHand(index);
        
    }
}

module.exports = KaibaManCard;