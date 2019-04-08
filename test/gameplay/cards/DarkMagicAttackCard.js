const assert = require('chai').assert;

const Game = require('../../../src/gameplay/Game');
const Card = require('../../../src/gameplay/cards/Card');
const DarkMagicianCard = require('../../../src/gameplay/cards/DarkMagicianCard');
const DarkMagicAttackCard = require('../../../src/gameplay/cards/DarkMagicAttackCard');

const SpellCard = require('../../../src/gameplay/cards/SpellCard');

const floodgateTrapHoleCard = () => new SpellCard('', '', '');

const {assertGameSuccess} = require('../Game');

describe('DarkMagicAttackCard', () => {
  function buildDeck() {
    return [new DarkMagicianCard(), new DarkMagicianCard(), floodgateTrapHoleCard(), new DarkMagicAttackCard(), new DarkMagicAttackCard()];
  }

  it('#activate', () => {
    const game = new Game([{id: 'abc', deck: buildDeck()}, {id: 'def', deck: buildDeck()}]);
    // summon dark magician
    assertGameSuccess(game.summon(game.players[0].hand[3].id, game.players[0].field.getMonsterSlotId(0), Card.REVEALED, Card.ATTACK));
    assertGameSuccess(game.endTurn());
    // end of player[0]'s turn, not it is player[1]'s turn
    assert.equal(game.turn, 1);
    // player[1] place cards on field
    assertGameSuccess(game.place(game.players[game.turn].hand[0].id, game.players[game.turn].field.getSpellSlotId(0), Card.HIDDEN));
    assertGameSuccess(game.place(game.players[game.turn].hand[0].id, game.players[game.turn].field.getSpellSlotId(1), Card.HIDDEN));
    assertGameSuccess(game.place(game.players[game.turn].hand[0].id, game.players[game.turn].field.getSpellSlotId(2), Card.HIDDEN));
    assertGameSuccess(game.endTurn());
    // end of player[1]'s turn, not it is player[0]'s turn
    assert.equal(game.turn, 0);
    // Dark Magic Attack can invoke!
    assert.isTrue(game.players[0].hand[0].canInvoke(game, game.players[0], ['def']));
    // Invoke!
    assertGameSuccess(game.place(game.players[game.turn].hand[0].id, game.players[game.turn].field.getSpellSlotId(0), Card.REVEALED));
    // player[0] invokes, player[1] takes the effect
    assertGameSuccess(game.invokeSpell(game.players[0].field.spellSlots[0].id, ['def']));
    // All trap and spell card of players[1] destroyed
    assert.equal(game.players[1].field.spellSlots[0], null);
    assert.equal(game.players[1].field.spellSlots[1], null);
    assert.equal(game.players[1].field.spellSlots[2], null);
    assert.equal(game.players[1].field.graveyard.length, 3);
    // DMA goes into graveyard
    assert.equal(game.players[0].field.spellSlots[0], null);
    assert.equal(game.players[0].field.graveyard.length, 1);
  });

  it('#cannot activate', () => {
    const game = new Game([{id: 'abc', deck: buildDeck()}, {id: 'def', deck: buildDeck()}]);
    assert.isFalse(game.players[0].hand[0].canInvoke(game, game.players[0], ['def']));
  });
});
