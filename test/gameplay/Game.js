const assert = require('chai').assert;

const Game = require('../../src/gameplay/Game');

describe('Game', () => {
  it('.createDeck', () => {
    const deck = Game.createDeck(20);
    assert.lengthOf(deck, 20);
  });

  const mockUsers = [
    {id: 'abc', name: 'F', deck: Game.createDeck(20)},
    {id: 'def', name: 'K', deck: Game.createDeck(20)},
  ];

  it('#constructor', () => {
    const game = new Game(mockUsers);
    assert.lengthOf(game.players, 2);
  });

  it('U010: The Gamer is dealt 5 random cards at the beginning of the Game', () => {
    const game = new Game(mockUsers);
    game.players.forEach((player) => {
      assert.lengthOf(player.hand, 5);
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
    assert.isUndefined(game.act(Game.END_TURN));

    assert.isFalse(game.isMyTurn(mockUsers[0].id));
    assert.isTrue(game.isMyTurn(mockUsers[1].id));
    assert.isUndefined(game.act(Game.END_TURN));

    assert.isTrue(game.isMyTurn(mockUsers[0].id));
    assert.isFalse(game.isMyTurn(mockUsers[1].id));
  });

  it('U014: The Gamer is dealt 1 random card in Phase 1 every round', () => {
    const game = new Game(mockUsers);
    assert.isUndefined(game.act(Game.DRAW));
    assert.isString(game.act(Game.DRAW)); // cannot draw more than one
    assert.lengthOf(game.players[0].hand, 6); // one more card

    assert.isUndefined(game.act(Game.END_TURN));
    assert.isUndefined(game.act(Game.END_TURN));

    assert.isUndefined(game.act(Game.DRAW));
    assert.isString(game.act(Game.DRAW)); // cannot draw more than one
    assert.lengthOf(game.players[0].hand, 7); // one more card
  });

  // it('U015: The Gamer can Summon a Marionette using a Character Card in hand in Phase 2 every round. ', () => {
  //   const game = new Game(mockUsers);
  //   assert.isUndefined(game.act(Game.DRAW));
  //   const card1 = game.players[0].hand[0];
  //   assert.isUndefined(game.act(Game.SUMMON, 0, 0));
  //   assert.notEqual(card1, game.players[0].hand[0]);
  //   assert.equal(card1, game.players[0].field.monsterSlots[0]);
  //   assert.isString(game.act(Game.SUMMON, 0, 0)); // cannot summon twice

  //   assert.isUndefined(game.act(Game.END_TURN));
  //   assert.isUndefined(game.act(Game.END_TURN));

  //   const card2 = game.players[0].hand[0];
  //   assert.isString(game.act(Game.SUMMON, 0, 0)); // cannot overlay
  //   assert.isUndefined(game.act(Game.SUMMON, 0, 1));
  //   assert.notEqual(card2, game.players[0].hand[0]);
  //   assert.equal(card2, game.players[0].field.monsterSlots[1]);
  // });

  // it('U016: The Gamer can order the Marionettes to Attack other Gamers\' Marionettes and, when there is no Marionette on Ground, other Gamers themselves in Phase 2 every round', () => {
  //   const game = new Game(mockUsers);
  //   assert.isUndefined(game.act(Game.DRAW));
  //   const card1 = game.players[0].hand[0];
  //   assert.isUndefined(game.act(Game.SUMMON, 0, 0));
  //   const life = game.players[1].life;
  //   assert.isUndefined(game.act(Game.ATTACK, 0, 1, -1));
  //   assert.equal(game.players[1].life, life - card1.atk);
  //   assert.isString(game.act(Game.ATTACK, 0, 1, -1)); // cannot attack twice

  //   assert.isUndefined(game.act(Game.END_TURN));
  //   assert.isUndefined(game.act(Game.END_TURN));

  //   assert.isUndefined(game.act(Game.DRAW));
  //   const card2 = game.players[0].hand[0];
  //   assert.isUndefined(game.act(Game.SUMMON, 0, 1));
  //   assert.isUndefined(game.act(Game.ATTACK, 0, 1, -1));
  //   assert.equal(game.players[1].life, life - card1.atk - card1.atk);
  //   assert.isUndefined(game.act(Game.ATTACK, 1, 1, -1));
  //   assert.equal(game.players[1].life, life - card1.atk - card1.atk - card2.atk);
  //   assert.isString(game.act(Game.ATTACK, 0, 1, -1)); // cannot attack twice
  //   assert.isString(game.act(Game.ATTACK, 1, 1, -1)); // cannot attack twice
  // });
});
