const assert = require('chai').assert;

const Game = require('../../../src/gameplay/Game');
const Card = require('../../../src/gameplay/cards/Card');
const MobiusTheFrostMonarchCard = require('../../../src/gameplay/cards/MobiusTheFrostMonarchCard');

// testing spell card
const PotOfGreedCard = require('../../../src/gameplay/cards/PotOfGreedCard');

const {assertGameSuccess, assertGameError} = require('../Game');

describe('MobiusTheFrostMonarchCard', ()=>{
  function buildDeck() {
    return [new PotOfGreedCard(), new PotOfGreedCard, new MobiusTheFrostMonarchCard()];
  }

  it('#activate', ()=> {
    const game = new Game([{id: 'abc', deck: buildDeck()}, {id: 'def', deck: buildDeck()}]);
    // player 0 place two spell cards
    assert.isTrue(game.players[0].hand[1].canInvoke());
    assert.isTrue(game.players[0].hand[2].canInvoke());
    // both spell cards are hidden, waiting to be destroyed
    assertGameSuccess(game.place(1, 0, Card.HIDDEN));
    assertGameSuccess(game.place(1, 1, Card.HIDDEN));
    //  end player 0 turn
    assertGameSuccess(game.endTurn());
    // now it is player 1 turn
    assert.equal(game.turn, 1);
    // player 1 summons mobius the frost monarch
    assertGameSuccess(game.summon(0, 0, Card.REVEALED, Card.ATTACK));
    assert.equal(game.players[1].field.monsterSlots[0].name, 'Mobius the Frost Monarch');
    assert.equal(game.players[1].field.monsterSlots[0].pose, Card.ATTACK);
    // activates mobius power on two two spell cards of player 0
    assertGameSuccess(game.invokeMonsterEffect(0, [0, 0, 0, 1]));
    // now both spell cards should be gone to graveyard
    assert.equal(game.players[0].field.spellSlots[0], null);
    assert.equal(game.players[0].field.spellSlots[1], null);
    assert.equal(game.players[0].field.graveyard.length, 2);
    // player 1 then place two spell cards for player 0 to destroy
    assert.isTrue(game.players[1].hand[0].canInvoke());
    assert.isTrue(game.players[1].hand[1].canInvoke());
    // both spell cards are hidden, waiting to be destroyed
    assertGameSuccess(game.place(0, 0, Card.HIDDEN));
    assertGameSuccess(game.place(0, 1, Card.HIDDEN));
    //  end player 1 turn
    assertGameSuccess(game.endTurn());
    // now it is player 0 turn
    assert.equal(game.turn, 0);
    // player 0 summons mobius the frost monarch
    assertGameSuccess(game.summon(0, 0, Card.REVEALED, Card.ATTACK));
    assert.equal(game.players[0].field.monsterSlots[0].name, 'Mobius the Frost Monarch');
    assert.equal(game.players[0].field.monsterSlots[0].pose, Card.ATTACK);
    // let mobius uses his power on two two spell cards from player one
    assertGameSuccess(game.invokeMonsterEffect(0, [1, 0, 1, 1]));
    // now both spell cards should be gone to graveyard
    assert.equal(game.players[1].field.spellSlots[0], null);
    assert.equal(game.players[1].field.spellSlots[1], null);
    assert.equal(game.players[1].field.graveyard.length, 2);
  });

  it('#cannot activate', ()=>{
    const game = new Game([{id: 'abc', deck: buildDeck()}, {id: 'def', deck: buildDeck()}]);
    // player 0 place two spell cards
    assert.isTrue(game.players[0].hand[1].canInvoke());
    assert.isTrue(game.players[0].hand[2].canInvoke());
    // both spell cards are hidden, waiting to be destroyed
    assertGameSuccess(game.place(1, 0, Card.HIDDEN));
    assertGameSuccess(game.place(1, 1, Card.HIDDEN));
    //  end player 0 turn
    assertGameSuccess(game.endTurn());
    // now it is player 1 turn
    assert.equal(game.turn, 1);
    // player 1 summons mobius the frost monarch
    assertGameSuccess(game.summon(0, 0, Card.REVEALED, Card.ATTACK));
    assert.equal(game.players[1].field.monsterSlots[0].name, 'Mobius the Frost Monarch');
    assert.equal(game.players[1].field.monsterSlots[0].pose, Card.ATTACK);
    // let mobius uses his power on two two spell cards from player one
    assertGameSuccess(game.invokeMonsterEffect(0, [0, 0, 0, 1]));
    // now both spell cards should be gone to graveyard
    assert.equal(game.players[0].field.spellSlots[0], null);
    assert.equal(game.players[0].field.spellSlots[1], null);
    assert.equal(game.players[0].field.graveyard.length, 2);
    //  end player 1 turn
    assertGameSuccess(game.endTurn());
    // now it is player 0 turn
    assert.equal(game.turn, 0);
    //  end player 0 turn
    assertGameSuccess(game.endTurn());
    // now it is player 1 turn
    assert.equal(game.turn, 1);
    // make sure the mobius still there
    assert.equal(game.players[1].field.monsterSlots[0].name, 'Mobius the Frost Monarch');
    assert.equal(game.players[1].field.monsterSlots[0].pose, Card.ATTACK);
    // mobius cannot activates his power twice
    assertGameError(game.invokeMonsterEffect(0, [0, 0, 0, 0]));
  });
});
