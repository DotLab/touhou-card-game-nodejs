const SpellCard = require('./SpellCard');

class SpellbookOfSecretsCard extends SpellCard {
  constructor() {
    super(SpellbookOfSecretsCard.Name, SpellbookOfSecretsCard.Desc, SpellbookOfSecretsCard.ImgUrl);
  }

  canInvoke(game, player, invokeParams) {
    const name = invokeParams[0];
    if (!name.includes('Spellbook')) return false; //  not a spellbook card
    if (name === SpellbookOfSecretsCard.Name) return false;
    if (player.findCardInDeckByName(name) === -1) {
      return false; // no such card
    }
    if (player.hasActivated[SpellbookOfSecretsCard.Name] == true) {
      return false; // if has activated on this turn
    }
    return true;
  }

  invoke(game, player, invokeParams) {
    const name = invokeParams[0];
    const index = player.findCardInDeckByName(name);
    const card = player.removeCardFromDeck(index);
    player.hand.push(card);
  }
}

SpellbookOfSecretsCard.Name = 'Spellbook of Secrets';
SpellbookOfSecretsCard.Desc = 'Add 1 "Spellbook" card from your Deck to your hand, except "Spellbook of Secrets". You can only activate 1 "Spellbook of Secrets" per turn.';

module.exports = SpellbookOfSecretsCard;
