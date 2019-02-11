const MonsterCard = require('./Cards/MonsterCard.js');

class BlueEyesWhiteDragonCard extends MonsterCard {
    static Name = "BlueEyesWhiteDragon";

    constructor() {
        super(Name,"/imgs/BlueEyesWhiteDragon.jpg",false,"ATT",3,200,700);
    }
}

module.exports = BlueEyesWhiteDragonCard;