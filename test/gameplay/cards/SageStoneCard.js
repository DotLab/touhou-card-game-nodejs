const assert = require('chai').assert;

const Game = require('../../../src/gameplay/Game');
const Card = require('../../../src/gameplay/cards/Card');
const DarkMagicianCard = require('../../../src/gameplay/cards/DarkMagicianCard');
const DarkMagicianGirlCard = require('../../../src/gameplay/cards/DarkMagicianGirlCard');
const SageStoneCard = require('../../../src/gameplay/cards/SageStoneCard');

const {assertGameSuccess} = require('../Game');

describe('SageStone', () => {
  function buildDeck() {
    return [new DarkMagicianCard(), new DarkMagicianGirlCard(), new DarkMagicianCard(), new SageStoneCard(), new SageStoneCard(), new DarkMagicianGirlCard()];
  }

  it('#activate', () => {
    const game = new Game([{id: 'abc', deck: buildDeck()}, {id: 'def', deck: buildDeck()}]);
    // summon dark magiciangirl
    assertGameSuccess(game.summon(game.players[0].hand[0].id, game.players[0].field.getMonsterSlotId(0), Card.REVEALED, Card.ATTACK));
    assert.isTrue(game.players[0].hand[0].canInvoke(game, game.players[0], [1]));
    assertGameSuccess(game.place(game.players[game.turn].hand[0].id, game.players[game.turn].field.getSpellSlotId(0), Card.REVEALED));
    assertGameSuccess(game.invokeSpell(game.players[0].field.spellSlots[0].id, [game.players[0].field.getMonsterSlotId(1)]));
    assert.equal(game.players[0].field.monsterSlots[1].name, DarkMagicianCard.Name );
    assert.equal(game.players[0].field.graveyard.length, 1);
    assertGameSuccess(game.place(game.players[game.turn].hand[0].id, game.players[game.turn].field.getSpellSlotId(0), Card.REVEALED));
    assertGameSuccess(game.invokeSpell(game.players[0].field.spellSlots[0].id, [game.players[0].field.getMonsterSlotId(2)]));
    assert.equal(game.players[0].field.monsterSlots[2].name, DarkMagicianCard.Name );
    assert.equal(game.players[0].field.graveyard.length, 2);
  });
});
