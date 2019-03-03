const SpellCard = require('./SpellCard');

class SpellbookOfEternityCard extends SpellCard {
  constructor() {
    super(SpellbookOfEternityCard.Name, SpellbookOfEternityCard.Desc, SpellbookOfEternityCard.ImgUrl);
  }

  canInvoke(game, player, invokeParams) {
    const name = invokeParams[0];
    const oblivion = player.field.oblivion;
    if (!name.includes('Spellbook')) return false; //  not a spellbook card
    if (name == SpellbookOfEternityCard.Name) return false;
    if (oblivion.length == 0) return false; // no card in oblivion
    if (SpellbookOfEternityCard.Name in player.hasActivated) {
      if (player.hasActivated[SpellbookOfEternityCard.Name] == true) {
        return false; // if has activated on this turn
      }
    }
    for (let i = 0; i < oblivion.length; i += 1) {
      if (oblivion[i].name === name && oblivion[i] instanceof SpellCard ) return true; // is a spell card
    }
    return false;
  }

  invoke(game, player, invokeParams) {
    const name = invokeParams[0];
    let index = -1;
    for (let i = 0; i < player.field.oblivion.length; i += 1) {
      if (player.field.oblivion[i].name === name) {
        index = i;
        break;
      }
    }
    const card = player.field.removeCardFromOblivion(index);
    player.hand.push(card);
    player.hasActivated[SpellbookOfEternityCard.Name] = true;
  }
}

SpellbookOfEternityCard.Name = 'Spellbook of Eternity';
SpellbookOfEternityCard.Desc = 'Target 1 of your banished "Spellbook" Spell Cards, except "Spellbook of Eternity"; add that target to your hand. You can only activate 1 "Spellbook of Eternity" per turn.';

module.exports = SpellbookOfEternityCard;
