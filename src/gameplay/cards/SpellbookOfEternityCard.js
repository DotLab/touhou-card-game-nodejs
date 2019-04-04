const SpellCard = require('./SpellCard');

class SpellbookOfEternityCard extends SpellCard {
  constructor() {
    super(SpellbookOfEternityCard.Name, SpellbookOfEternityCard.Desc, SpellbookOfEternityCard.ImgUrl);
  }

  canInvoke(game, player, invokeParams) {
    const oblivionIdx = invokeParams[0];
    const oblivion = player.field.oblivion;
    const name = oblivion[oblivionIdx].name;
    if (!name.includes('Spellbook')) return false; //  not a spellbook card
    if (name == SpellbookOfEternityCard.Name) return false;
    if (oblivion.length == 0) return false; // no card in oblivion
    if (player.hasActivated[SpellbookOfEternityCard.Name] == true) {
      return false; // if has activated on this turn
    }
    if (! (oblivion[oblivionIdx] instanceof SpellCard) ) return false; // not a spell card
    return true;
  }

  invoke(game, player, invokeParams) {
    const index = invokeParams[0];
    const card = player.field.removeCardFromOblivion(index);
    player.hand.push(card);
  }
}

SpellbookOfEternityCard.Name = 'Spellbook of Eternity';
SpellbookOfEternityCard.Desc = 'Target 1 of your banished "Spellbook" Spell Cards, except "Spellbook of Eternity"; add that target to your hand. You can only activate 1 "Spellbook of Eternity" per turn.';

module.exports = SpellbookOfEternityCard;
