const assert = require('chai').assert;

const KaibamanCard = require('../../src/gameplay/cards/KaibamanCard');
const BlueEyesWhiteDragonCard = require('../../src/gameplay/cards/BlueEyesWhiteDragonCard');
const Card = require('../../src/gameplay/cards/Card');
const Game = require('../../src/gameplay/Game');

describe('Game', () => {
  function createMockDeck() {
    const res = [];
    for (let i = 0; i < 10; i += 1) {
      res.push(new KaibamanCard());
      res.push(new BlueEyesWhiteDragonCard());
    }
    return res;
  }

  let mockUsers;

  beforeEach(() => {
    mockUsers = [
      {id: 'abc', name: 'F', deck: createMockDeck()},
      {id: 'def', name: 'K', deck: createMockDeck()},
    ];
  });

  it('#constructor', () => {
    const game = new Game(mockUsers);
    assert.lengthOf(game.players, 2);
  });

  it('U010: The Gamer is dealt 5 random cards at the beginning of the Game', () => {
    const game = new Game(mockUsers);
    game.players.forEach((player) => {
      assert.lengthOf(player.hand, 5);
      player.hand.forEach((card) => assert.isObject(card));
    });
  });

  it('U011: The Gamer has 5000 Life initially', () => {
    const game = new Game(mockUsers);
    game.players.forEach((player) => {
      assert.equal(player.life, 5000);
    });
  });

  it('U012: The Gamer can see other Players in the Game with their Name and icons indicating their cards in hands', () => {
    const game = new Game(mockUsers);
    game.players.forEach((player, i) => { // check id and name
      assert.equal(player.userId, mockUsers[i].id);
      assert.equal(player.userName, mockUsers[i].name);
    });
  });

  it('U013: The Gamer can play in his/her turn every round and the order of turns is based on how early the Gamer originally joined the Room', () => {
    const game = new Game(mockUsers);
    assert.isTrue(game.isMyTurn(mockUsers[0].id));
    assert.isFalse(game.isMyTurn(mockUsers[1].id));
    assert.isUndefined(game.endTurn());

    assert.isFalse(game.isMyTurn(mockUsers[0].id));
    assert.isTrue(game.isMyTurn(mockUsers[1].id));
    assert.isUndefined(game.endTurn());

    assert.isTrue(game.isMyTurn(mockUsers[0].id));
    assert.isFalse(game.isMyTurn(mockUsers[1].id));
  });

  it('U014: The Gamer is dealt 1 random card in Phase 1 every round', () => {
    const game = new Game(mockUsers);
    assert.isUndefined(game.draw());
    assert.isString(game.draw()); // cannot draw more than one
    assert.lengthOf(game.players[0].hand, 6); // one more card

    assert.isUndefined(game.endTurn());
    assert.isUndefined(game.endTurn());

    assert.isUndefined(game.draw());
    assert.isString(game.draw()); // cannot draw more than one
    assert.lengthOf(game.players[0].hand, 7); // one more card
  });

  it('U015: The Gamer can Summon a Marionette using a Character Card in hand in Phase 2 every round. ', () => {
    const game = new Game(mockUsers);
    assert.isUndefined(game.draw());
    const card1 = game.players[0].hand[0];
    assert.isUndefined(game.summon(0, 0, Card.REVEALED, Card.ATTACK));
    assert.notEqual(card1, game.players[0].hand[0]);
    assert.equal(card1, game.players[0].field.monsterSlots[0]);
    assert.isString(game.summon(0, 0, Card.REVEALED, Card.ATTACK)); // cannot summon twice

    assert.isUndefined(game.endTurn());
    assert.isUndefined(game.endTurn());

    const card2 = game.players[0].hand[0];
    assert.isString(game.summon(0, 0, Card.REVEALED, Card.ATTACK)); // cannot overlay
    assert.isUndefined(game.summon(0, 1, Card.REVEALED, Card.ATTACK));
    assert.notEqual(card2, game.players[0].hand[0]);
    assert.equal(card2, game.players[0].field.monsterSlots[1]);
  });

  it('U016: The Gamer can order the Marionettes to Attack other Gamers\' Marionettes and, when there is no Marionette on Ground, other Gamers themselves in Phase 2 every round', () => {
    const game = new Game(mockUsers);
    assert.isUndefined(game.draw());
    const card1 = game.players[0].hand[0];
    assert.isUndefined(game.summon(0, 0, Card.REVEALED, Card.ATTACK));
    const life = game.players[1].life;
    assert.isUndefined(game.attack(0, 1, -1));
    assert.equal(game.players[1].life, life - card1.atk);
    assert.isString(game.attack(0, 1, -1)); // cannot attack twice

    assert.isUndefined(game.endTurn());
    assert.isUndefined(game.endTurn());

    assert.isUndefined(game.draw());
    const card2 = game.players[0].hand[0];
    assert.isUndefined(game.summon(0, 1, Card.REVEALED, Card.ATTACK));
    assert.isUndefined(game.attack(0, 1, -1));
    assert.equal(game.players[1].life, life - card1.atk - card1.atk);
    assert.isUndefined(game.attack(1, 1, -1));
    assert.equal(game.players[1].life, life - card1.atk - card1.atk - card2.atk);
    assert.isString(game.attack(0, 1, -1)); // cannot attack twice
    assert.isString(game.attack(1, 1, -1)); // cannot attack twice
  });
});
