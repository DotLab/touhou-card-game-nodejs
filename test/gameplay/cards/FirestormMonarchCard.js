const assert = require('chai').assert;

const Game = require('../../../src/gameplay/Game');
const Card = require('../../../src/gameplay/cards/Card');
const FirestormMonarchCard = require('../../../src/gameplay/cards/FirestormMonarchCard');
const DarkMagicianCard = require('../../../src/gameplay/cards/DarkMagicianCard');
const DarkMagicianGirlCard = require('../../../src/gameplay/cards/DarkMagicianGirlCard');
const {assertGameSuccess, assertGameError} = require('../Game');

describe('FirestormMonarchCard', () => {
  function buildDeck1() {
    return [new FirestormMonarchCard(), new FirestormMonarchCard(), new FirestormMonarchCard(), new FirestormMonarchCard(), new FirestormMonarchCard(), new FirestormMonarchCard(), new FirestormMonarchCard()];
  }
  function buildDeck2() {
    return [new DarkMagicianCard(), new DarkMagicianCard(), new DarkMagicianGirlCard(), new DarkMagicianGirlCard(), new DarkMagicianGirlCard()];
  }
  it('#invoke', () => {
    // test constructor & invoke spell failed
    const game = new Game([{id: 'abc', deck: buildDeck1()}, {id: 'def', deck: buildDeck2()}]);
    const preHand = game.players[1].hand;
    const preHandLen = preHand.length;
    const preLife = game.players[1].life;
    assertGameSuccess(game.summon(0, 0, Card.REVEALED, Card.ATTACK));
    assertGameSuccess(game.invokeMonsterEffect(0, [0, 0, 1, 1]));
    assert.equal(game.players[0].field.monsterSlots[0].name, FirestormMonarchCard.Name);
    assert.equal(game.players[0].field.monsterSlots[0].pose, Card.ATTACK);
    assert.equal(game.players[1].hand.length, preHandLen - 1);
    // check if Discard 1 random card from your opponent's hand

    const nowHand = game.players[1].hand;
    let droppedCard = preHand[0];
    for (let i = 0; i < nowHand.length; i++) {
      if (nowHand[i].id != preHand[i].id) {
        droppedCard = preHand[i];
        // console.log(1);
      }
    }
    // console.log(droppedCard);

    // assert.equal(game.players[1].field.graveyard.pop(), droppedCard);
    // assert.equal(game.players[1].field.graveyard.length, 1);
    if (droppedCard.cardType == Card.MONSTER )assert.equal(game.players[1].life, preLife - FirestormMonarchCard.Life*droppedCard.lv);
    else assert.equal(game.players[1].life, preLife);

    assertGameError(game.invokeMonsterEffect(0, [0]));
    assertGameSuccess(game.endTurn());
    // end of player[0]'s turn, not it is player[1]'s turn
    assert.equal(game.turn, 1);
  });
});
