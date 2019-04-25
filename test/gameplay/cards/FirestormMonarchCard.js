const assert = require('chai').assert;

const Game = require('../../../src/gameplay/Game');
const Card = require('../../../src/gameplay/cards/Card');
const FirestormMonarchCard = require('../../../src/gameplay/cards/FirestormMonarchCard');
const DarkMagicianCard = require('../../../src/gameplay/cards/DarkMagicianCard');
// const DarkMagicianGirlCard = require('../../../src/gameplay/cards/DarkMagicianGirlCard');
const {assertGameSuccess, assertGameError} = require('../Game');

describe('FirestormMonarchCard', () => {
  // initialize a deck with seven tested monster cards, FirestormMonarchCard
  function buildDeck1() {
    return [new FirestormMonarchCard(), new FirestormMonarchCard(), new FirestormMonarchCard(), new FirestormMonarchCard(), new FirestormMonarchCard(), new FirestormMonarchCard(), new FirestormMonarchCard()];
  }

  // initialize a deck with five monster cards DarkMagicianCard
  function buildDeck2() {
    return [new DarkMagicianCard(), new DarkMagicianCard(), new DarkMagicianCard(), new DarkMagicianCard(), new DarkMagicianCard()];
  }

  it('#invoke', () => {
    // test constructor & invoke spell failed
    const game = new Game([{id: 'abc', deck: buildDeck1()}, {id: 'def', deck: buildDeck2()}]);
    const preHand = game.players[1].hand;
    const preHandLen = preHand.length;
    const preLife = game.players[1].life;
    assertGameSuccess(game.summon(game.players[game.turn].hand[0].id, game.players[game.turn].field.getMonsterSlotId(0), Card.REVEALED, Card.ATTACK));
    assertGameSuccess(game.invokeMonsterEffect(game.players[0].field.monsterSlots[0].id, [game.players[1].userId]));
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
    if (droppedCard.cardType == Card.MONSTER) {
      assert.equal(game.players[1].life, preLife - 100 * droppedCard.lv);
    } else {
      assert.equal(game.players[1].life, preLife);
    }

    assertGameError(game.invokeMonsterEffect(0, [0]));
    assertGameSuccess(game.endTurn());
    // end of player[0]'s turn, not it is player[1]'s turn
    assert.equal(game.turn, 1);
    game.takeSnapshot();
  });
});
