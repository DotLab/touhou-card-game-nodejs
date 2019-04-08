const assert = require('chai').assert;

const Game = require('../../../src/gameplay/Game');
const Card = require('../../../src/gameplay/cards/Card');
const DarkMagicianCard = require('../../../src/gameplay/cards/DarkMagicianCard');
const DarkMagicianGirlCard = require('../../../src/gameplay/cards/DarkMagicianGirlCard');

const {assertGameSuccess} = require('../Game');

describe('DarkMagicianGirlCard', () => {
  function buildDeck() {
    return [new DarkMagicianGirlCard(), new DarkMagicianGirlCard(), new DarkMagicianGirlCard(), new DarkMagicianGirlCard(), new DarkMagicianGirlCard()];
  }

  it('#invoke', () => {
    const game = new Game([{id: 'abc', deck: buildDeck()}, {id: 'def', deck: buildDeck()}]);
    assertGameSuccess(game.summon(game.players[0].hand[0].id, game.players[0].field.getMonsterSlotId(0), Card.REVEALED, Card.ATTACK));
    assertGameSuccess(game.invokeMonsterEffect(game.players[0].field.monsterSlots[0].id, []));
    const beforeAtk = game.players[0].field.monsterSlots[0].atk;
    // assert.equal(game.players[0].field.monsterSlots[0].atk, 2000);
    game.players[0].field.graveyard.push(new DarkMagicianCard());
    assertGameSuccess(game.summon(game.players[0].hand[0].id, game.players[0].field.getMonsterSlotId(1), Card.REVEALED, Card.ATTACK));
    assertGameSuccess(game.invokeMonsterEffect(game.players[0].field.monsterSlots[1].id, []));
    assert.equal(game.players[0].field.monsterSlots[1].atk, beforeAtk + DarkMagicianGirlCard.AtkIncrease);
    assertGameSuccess(game.endTurn());
    // end of player[0]'s turn, not it is player[1]'s turn
    assert.equal(game.turn, 1);
    game.takeSnapshot();
  });
});
