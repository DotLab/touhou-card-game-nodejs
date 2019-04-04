const SpellCard = require('./SpellCard');
const DarkMagicianCard = require('./DarkMagicianCard');
const DarkMagicianGirlCard = require('./DarkMagicianGirlCard');
const Card = require('../../../src/gameplay/cards/Card');
class SageStoneCard extends SpellCard {
  constructor() {
    super(SageStoneCard.Name, SageStoneCard.Desc, SageStoneCard.Url);
  }
  canInvoke(game, player, invokeParams) {
    if (player.field.monsterSlots[invokeParams[0]] != null) return false;
    for (let i = 0; i < player.field.monsterSlots.length; i += 1) {
      if (player.field.monsterSlots[i] !== null && player.compareFieldName(i, DarkMagicianGirlCard.Name)) {
        if (player.field.monsterSlots[i].display = Card.REVEALED) {
          return true;
        }
      }
    }
    return false;
  }

  // invokeParams: index of monsterSlot
  invoke(game, player, invokeParams) {
    // push this to graveyard
    for (let i = 0; i < player.field.spellSlots.length; i += 1) {
      if (player.field.spellSlots[i] !== null && player.field.spellSlots[i] === this) {
        player.field.graveyard.push(this);
        player.field.spellSlots[i] = null;
      }
    }
    for (let i = 0; i < player.hand.length; i += 1) {
      if (player.compareHandName(i, DarkMagicianCard.Name)) {
        const card = player.removeCardInHand(i);
        player.field.monsterSlots[invokeParams[0]] = card;
        card.summon(Card.REVEALED, Card.ATTACK);
        return;
      }
    }
    for (let i = 0; i < player.deck.length; i += 1) {
      if (player.compareDeckName(i, DarkMagicianCard.Name)) {
        player.field.monsterSlots[invokeParams[0]] = player.deck[i];
        player.deck.splice(i, 1);
        return;
      }
    }
  }
}


SageStoneCard.Name = 'Sage Stone';
SageStoneCard.Desc = 'If you control a face-up "Dark Magician Girl": Special Summon 1 "Dark Magician" from your hand or Deck.';
SageStoneCard.Url = '/Imgs/DarkMagicianGirl.jpg';

module.exports = SageStoneCard;
