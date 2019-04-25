const assert = require('chai').assert;

const Game = require('../../../src/gameplay/Game');
const Card = require('../../../src/gameplay/cards/Card');
const DarkMagicianCard = require('../../../src/gameplay/cards/DarkMagicianCard');
const ThousandKnivesCard = require('../../../src/gameplay/cards/ThousandKnivesCard');

const {assertGameSuccess} = require('../Game');

describe('ThousandKnives', () => {
  function buildDeck() {
    return [new DarkMagicianCard(), new DarkMagicianCard(), new DarkMagicianCard(), new ThousandKnivesCard(), new DarkMagicianCard()];
  }

  it('#activate', () => {
    const game = new Game([{id: 'abc', deck: buildDeck()}, {id: 'def', deck: buildDeck()}]);
    // summon dark magician
    assertGameSuccess(game.summon(game.players[0].hand[0].id, game.players[0].field.getMonsterSlotId(0), Card.REVEALED, Card.ATTACK));
    assertGameSuccess(game.endTurn());
    // end of player[0]'s turn, not it is player[1]'s turn
    assert.equal(game.turn, 1);
    // player[1] place cards on field
    assertGameSuccess(game.summon(game.players[1].hand[0].id, game.players[1].field.getMonsterSlotId(0), Card.REVEALED, Card.ATTACK));
    assertGameSuccess(game.endTurn());
    // end of player[1]'s turn, not it is player[0]'s turn
    assert.equal(game.turn, 0);
    // Thousand Knives can invoke!
    assert.isTrue(game.players[0].hand[0].canInvoke(game, game.players[0], [game.players[1].field.monsterSlots[0].id]));
    // Invoke!
    assertGameSuccess(game.place(game.players[game.turn].hand[0].id, game.players[game.turn].field.getSpellSlotId(0), Card.REVEALED));
    // player[0] invokes, player[1] takes the effect
    assertGameSuccess(game.invokeSpell(game.players[0].field.spellSlots[0].id, [game.players[1].field.monsterSlots[0].id]));
    assert.equal(game.players[1].field.monsterSlots[0], null);
    assert.equal(game.players[1].field.graveyard.length, 1);
    assert.equal(game.players[1].field.graveyard.length, 1);
    game.takeSnapshot();
  });

  it('#cannotActivate (no dark magician present)', ()=>{
    const game = new Game([{id: 'abc', deck: buildDeck()}, {id: 'def', deck: buildDeck()}]);
    // end of player[0]'s turn
    assertGameSuccess(game.endTurn());
    assert.equal(game.turn, 1);
    // player[1] place cards on field
    assertGameSuccess(game.summon(game.players[1].hand[0].id, game.players[1].field.getMonsterSlotId(0), Card.REVEALED, Card.ATTACK));
    assertGameSuccess(game.endTurn());
    // end of player[1]'s turn, not it is player[0]'s turn
    assert.equal(game.turn, 0);
    // Thousand Knives cannot invoke!
    assert.isFalse(game.players[0].hand[1].canInvoke(game, game.players[0], [game.players[1].field.monsterSlots[0].id]));
  });
});
