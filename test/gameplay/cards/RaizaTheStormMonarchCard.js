const assert = require('chai').assert;

const Game = require('../../../src/gameplay/Game');
const Card = require('../../../src/gameplay/cards/Card');
const RaizaTheStormMonarchCard = require('../../../src/gameplay/cards/RaizaTheStormMonarchCard');

// testing monster card
const BlueEyesWhiteDragonCard = require('../../../src/gameplay/cards/BlueEyesWhiteDragonCard');

// testing spell card
const PotOfGreedCard = require('../../../src/gameplay/cards/PotOfGreedCard');

const {assertGameSuccess, assertGameError} = require('../Game');

describe('RaizaTheStormMonarchCard', ()=> {
  function buildDeck() {
    return [new BlueEyesWhiteDragonCard(), new RaizaTheStormMonarchCard()];
  }

  it('#activate (upon monster card)', () => {
    const game = new Game([{id: 'abc', deck: buildDeck()}, {id: 'def', deck: buildDeck()}]);
    // player 0 place one monster card
    assertGameSuccess(game.summon(1, 0, Card.REVEALED, Card.ATTACK));
    assert.equal(game.players[0].field.monsterSlots[0].name, BlueEyesWhiteDragonCard.Name);
    assert.equal(game.players[0].field.monsterSlots[0].pose, Card.ATTACK);
    assert.equal(game.players[0].field.monsterSlots[0].lv, 8);
    assert.equal(game.players[0].field.monsterSlots[0].atk, BlueEyesWhiteDragonCard.Atk);
    assert.equal(game.players[0].field.monsterSlots[0].dfs, BlueEyesWhiteDragonCard.Dfs);
    //  end player 0 turn
    assertGameSuccess(game.endTurn());
    // now it is player 1 turn
    assert.equal(game.turn, 1);
    // player 1 summons Raiza the storm monarch
    assertGameSuccess(game.summon(0, 0, Card.REVEALED, Card.ATTACK));
    assert.equal(game.players[1].field.monsterSlots[0].name, RaizaTheStormMonarchCard.Name);
    assert.equal(game.players[1].field.monsterSlots[0].pose, Card.ATTACK);
    // activates Raiza power on two two spell cards of player 0
    assertGameSuccess(game.invokeMonsterEffect(0, [0, 0, 0]));
    // now player 0 monster card should be gone to graveyard
    assert.equal(game.players[0].field.monsterSlots[0], null);
    assert.equal(game.players[0].field.graveyard.length, 0);
    assert.equal(game.players[0].deck.length, 1);
    //  end player 1 turn
    assertGameSuccess(game.endTurn());
    // now it is player 0 turn
    assert.equal(game.turn, 0);
  });

  it('#activate (upon spell card)', () => {
    function buildDeck2() {
      return [new PotOfGreedCard(), new RaizaTheStormMonarchCard()];
    }
    const game = new Game([{id: 'abc', deck: buildDeck2()}, {id: 'def', deck: buildDeck2()}]);
    // player 0 place one spell card
    assert.isTrue(game.players[0].hand[1].canInvoke());
    assertGameSuccess(game.place(1, 0, Card.HIDDEN));
    //  end player 0 turn
    assertGameSuccess(game.endTurn());
    // now it is player 1 turn
    assert.equal(game.turn, 1);
    // player 1 summons Raiza the storm monarch
    assertGameSuccess(game.summon(0, 0, Card.REVEALED, Card.ATTACK));
    assert.equal(game.players[1].field.monsterSlots[0].name, RaizaTheStormMonarchCard.Name);
    assert.equal(game.players[1].field.monsterSlots[0].pose, Card.ATTACK);
    // activates Raiza power on two two spell cards of player 0
    assertGameSuccess(game.invokeMonsterEffect(0, [0, 1, 0]));
    // now player 0 monster card should be gone to graveyard
    assert.equal(game.players[0].field.spellSlots[0], null);
    assert.equal(game.players[0].field.graveyard.length, 0);
    assert.equal(game.players[0].deck.length, 1);
    //  end player 1 turn
    assertGameSuccess(game.endTurn());
    // now it is player 0 turn
    assert.equal(game.turn, 0);
  });

  it('#choose not to activate', ()=> {
    const game = new Game([{id: 'abc', deck: buildDeck()}, {id: 'def', deck: buildDeck()}]);
    // player 0 place one monster card
    assertGameSuccess(game.summon(1, 0, Card.REVEALED, Card.ATTACK));
    assert.equal(game.players[0].field.monsterSlots[0].name, BlueEyesWhiteDragonCard.Name);
    assert.equal(game.players[0].field.monsterSlots[0].pose, Card.ATTACK);
    assert.equal(game.players[0].field.monsterSlots[0].lv, 8);
    assert.equal(game.players[0].field.monsterSlots[0].atk, BlueEyesWhiteDragonCard.Atk);
    assert.equal(game.players[0].field.monsterSlots[0].dfs, BlueEyesWhiteDragonCard.Dfs);
    //  end player 0 turn
    assertGameSuccess(game.endTurn());
    // now it is player 1 turn
    assert.equal(game.turn, 1);
    // player 1 summons Raiza the storm monarch
    assertGameSuccess(game.summon(0, 0, Card.REVEALED, Card.ATTACK));
    assert.equal(game.players[1].field.monsterSlots[0].name, RaizaTheStormMonarchCard.Name);
    assert.equal(game.players[1].field.monsterSlots[0].pose, Card.ATTACK);
    // activates Raiza power on two two spell cards of player 0
    assertGameSuccess(game.invokeMonsterEffect(0, [null, null, null]));
    // now player 0 monster card should be gone to graveyard
    assert.equal(game.players[0].field.graveyard.length, 0);
    assert.equal(game.players[0].deck.length, 0);
    // player 1 then place a monster card for player 0 to destroy
    assertGameSuccess(game.summon(0, 1, Card.REVEALED, Card.ATTACK));
    assert.equal(game.players[1].field.monsterSlots[1].name, BlueEyesWhiteDragonCard.Name);
    assert.equal(game.players[1].field.monsterSlots[1].pose, Card.ATTACK);
    assert.equal(game.players[1].field.monsterSlots[1].lv, 8);
    assert.equal(game.players[1].field.monsterSlots[1].atk, BlueEyesWhiteDragonCard.Atk);
    assert.equal(game.players[1].field.monsterSlots[1].dfs, BlueEyesWhiteDragonCard.Dfs);
    //  end player 1 turn
    assertGameSuccess(game.endTurn());
    // now it is player 0 turn
    assert.equal(game.turn, 0);
  });

  it('#cannot activate', ()=>{
    const game = new Game([{id: 'abc', deck: buildDeck()}, {id: 'def', deck: buildDeck()}]);
    // player 0 place a monster cards
    assertGameSuccess(game.summon(1, 0, Card.REVEALED, Card.ATTACK));
    assert.equal(game.players[0].field.monsterSlots[0].name, BlueEyesWhiteDragonCard.Name);
    assert.equal(game.players[0].field.monsterSlots[0].pose, Card.ATTACK);
    assert.equal(game.players[0].field.monsterSlots[0].lv, 8);
    assert.equal(game.players[0].field.monsterSlots[0].atk, BlueEyesWhiteDragonCard.Atk);
    assert.equal(game.players[0].field.monsterSlots[0].dfs, BlueEyesWhiteDragonCard.Dfs);
    //  end player 0 turn
    assertGameSuccess(game.endTurn());
    // now it is player 1 turn
    assert.equal(game.turn, 1);
    // player 1 summons Raiza the storm monarch
    assertGameSuccess(game.summon(0, 0, Card.REVEALED, Card.ATTACK));
    assert.equal(game.players[1].field.monsterSlots[0].name, RaizaTheStormMonarchCard.Name);
    assert.equal(game.players[1].field.monsterSlots[0].pose, Card.ATTACK);
    // let Raiza uses his power on two two spell cards from player one
    assertGameSuccess(game.invokeMonsterEffect(0, [0, 0, 0]));
    // now both spell cards should be gone to graveyard
    assert.equal(game.players[0].field.monsterSlots[0], null);
    assert.equal(game.players[0].field.graveyard.length, 0);
    assert.equal(game.players[0].deck.length, 1);
    //  end player 1 turn
    assertGameSuccess(game.endTurn());
    // now it is player 0 turn
    assert.equal(game.turn, 0);
    //  end player 0 turn
    assertGameSuccess(game.endTurn());
    // now it is player 1 turn
    assert.equal(game.turn, 1);
    // make sure the Raiza still there
    assert.equal(game.players[1].field.monsterSlots[0].name, RaizaTheStormMonarchCard.Name);
    assert.equal(game.players[1].field.monsterSlots[0].pose, Card.ATTACK);
    // Raiza cannot activates his power twice
    assertGameError(game.invokeMonsterEffect(0, [0, 0, 0]));
  });
});