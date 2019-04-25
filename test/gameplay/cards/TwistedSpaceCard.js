const assert = require('chai').assert;

const Game = require('../../../src/gameplay/Game');
const Card = require('../../../src/gameplay/cards/Card');
const DarkMagicianCard = require('../../../src/gameplay/cards/DarkMagicianCard');
const TwistedSpaceCard = require('../../../src/gameplay/cards/TwistedSpaceCard');

const {assertGameSuccess} = require('../Game');

describe('TwistedSpaceCard', () => {
  function buildDeck() {
    return [new DarkMagicianCard(), new DarkMagicianCard(), new DarkMagicianCard(), new DarkMagicianCard(), new TwistedSpaceCard()];
  }

  function buildDeck2() {
    return [new DarkMagicianCard(), new DarkMagicianCard(), new DarkMagicianCard(), new TwistedSpaceCard(), new TwistedSpaceCard()];
  }

  it('#invoke', () => {
    const game = new Game([{id: 'abc', deck: buildDeck()}]);
    // Place env card Twisted Space
    assertGameSuccess(game.applyEnvironment(game.players[game.turn].hand[0].id));
    assertGameSuccess(game.summon(game.players[0].hand[0].id, game.players[0].field.getMonsterSlotId(1), Card.REVEALED, Card.ATTACK));
    // See if the atk and dfs are swapped
    assert.equal(game.players[0].field.monsterSlots[1].atk, DarkMagicianCard.Dfs);
    assert.equal(game.players[0].field.monsterSlots[1].dfs, DarkMagicianCard.Atk);
  });

  it('#invoke (replace existing environment card)', () => {
    const game = new Game([{id: 'abc', deck: buildDeck2()}]);
    // Place env card Twisted Space
    assertGameSuccess(game.applyEnvironment(game.players[game.turn].hand[0].id));
    assertGameSuccess(game.summon(game.players[0].hand[1].id, game.players[0].field.getMonsterSlotId(1), Card.REVEALED, Card.ATTACK));
    // See if the atk and dfs are swapped
    assert.equal(game.players[0].field.monsterSlots[1].atk, DarkMagicianCard.Dfs);
    assert.equal(game.players[0].field.monsterSlots[1].dfs, DarkMagicianCard.Atk);
    assertGameSuccess(game.endTurn());
    // end of player[0]'s turn, not it is player[1]'s turn
    assert.equal(game.turn, 0);
    assertGameSuccess(game.endTurn());
    // end of player[0]'s turn, not it is player[1]'s turn
    assert.equal(game.turn, 0);
    assertGameSuccess(game.applyEnvironment(game.players[game.turn].hand[0].id));
  });
});
