const SpellCard = require('./SpellCard');

class PotOfGreedCard extends SpellCard {
  constructor() {
    super(PotOfGreedCard.Name, PotOfGreedCard.Desc, PotOfGreedCard.ImgUrl);
  }

  invoke(game, player) {
    player.draw();
    player.draw();
    player.field.graveyard.push(this);
    for (let i = 0; i < player.field.spellSlots.length; i += 1) {
      if (player.field.spellSlots[i] !== null && player.field.spellSlots[i] === this) player.field.spellSlots[i] = null;
    }
  }
}

PotOfGreedCard.Name = 'Pot Of Greed';
PotOfGreedCard.Desc = 'Draw 2 cards.';
PotOfGreedCard.ImgUrl = '/imgs/card-pot-of-greed.png';

module.exports = PotOfGreedCard;
