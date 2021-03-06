const assert = require('chai').assert;

const Game = require('../../../src/gameplay/Game');
const Card = require('../../../src/gameplay/cards/Card');
const KaibamanCard = require('../../../src/gameplay/cards/KaibamanCard');
const BlueEyesWhiteDragonCard = require('../../../src/gameplay/cards/BlueEyesWhiteDragonCard');

const {assertGameSuccess, assertGameError} = require('../Game');

describe('KaibamanCard', () => {
  function buildDeck() {
    return [new BlueEyesWhiteDragonCard(), new KaibamanCard(), new KaibamanCard(), new KaibamanCard(), new KaibamanCard()];
  }

  // only kaibaman
  function buildDeck2() {
    return [new KaibamanCard(), new KaibamanCard(), new KaibamanCard(), new KaibamanCard(), new KaibamanCard()];
  }

  it('#invoke', () => {
    const game = new Game([{id: 'abc', deck: buildDeck()}, {id: 'def', deck: buildDeck()}]);
    // Pick Kaibaman
    const card = game.players[0].hand[0];
    // Summon Kaibaman
    assertGameSuccess(game.summon(game.players[0].hand[0].id, game.players[0].field.getMonsterSlotId(0), Card.REVEALED, Card.ATTACK));
    // Sacrifice Kaibaman to summon Blue Eyes White Dragon
    assertGameSuccess(game.invokeMonsterEffect(game.players[0].field.monsterSlots[0].id, []));
    // Assert we have summoned Blue Eyes White Dragon
    assert.equal(game.players[0].field.monsterSlots[0].name, BlueEyesWhiteDragonCard.Name);
    assert.equal(game.players[0].field.monsterSlots[0].pose, Card.ATTACK);
    assert.equal(game.players[0].field.graveyard[0], card); // kaibaman in graveyard
    assertGameSuccess(game.endTurn());
    // end of player[0]'s turn, not it is player[1]'s turn
    assert.equal(game.turn, 1);
    game.takeSnapshot();
  });

  it('#cannotInvoke', () => {
    const game = new Game([{id: 'abc', deck: buildDeck2()}, {id: 'def', deck: buildDeck2()}]);
    assertGameSuccess(game.summon(game.players[0].hand[0].id, game.players[0].field.getMonsterSlotId(0), Card.REVEALED, Card.ATTACK));
    // console.log(game.players[0]);
    assertGameError(game.invokeMonsterEffect(game.players[0].field.monsterSlots[0].id, []));
    assertGameSuccess(game.endTurn());
    // end of player[0]'s turn, not it is player[1]'s turn
    assert.equal(game.turn, 1);
  });
});
