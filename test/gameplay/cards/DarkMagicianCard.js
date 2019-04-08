const assert = require('chai').assert;

const Game = require('../../../src/gameplay/Game');
const Card = require('../../../src/gameplay/cards/Card');
const KaibamanCard = require('../../../src/gameplay/cards/KaibamanCard');
const DarkMagicianCard = require('../../../src/gameplay/cards/DarkMagicianCard');

const {assertGameSuccess, assertGameError} = require('../Game');

describe('DarkMagicianCard', () => {
  function buildDeck() {
    return [new DarkMagicianCard(), new KaibamanCard()];
  }

  it('#summon', () => {
    // test constructor & invoke spell failed
    const game = new Game([{id: 'abc', deck: buildDeck()}, {id: 'def', deck: buildDeck()}]);
    assertGameSuccess(game.summon(game.players[0].hand[1].id, game.players[0].field.getMonsterSlotId(0), Card.REVEALED, Card.ATTACK));
    assert.equal(game.players[0].field.monsterSlots[0].name, DarkMagicianCard.Name);
    assert.equal(game.players[0].field.monsterSlots[0].pose, Card.ATTACK);
    assert.equal(game.players[0].field.monsterSlots[0].lv, 7);
    assert.equal(game.players[0].field.monsterSlots[0].atk, 2500);
    assert.equal(game.players[0].field.monsterSlots[0].dfs, 2100);
    assertGameError(game.invokeMonsterEffect(0, game.players[0]));
    assertGameSuccess(game.endTurn());
    // end of player[0]'s turn, not it is player[1]'s turn
    assert.equal(game.turn, 1);
  });
});
