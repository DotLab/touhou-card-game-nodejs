const Kaibaman = require('./cards/KaibamanCard');
const Player = require('./Player');

/**
 * The Game
 */
class Game {
  /**
   * Create a deck randomly
   * @param {Number} cardCount Number of cards
   * @return {Card[]} Array of cards
   */
  static createDeck(cardCount) {
    const deck = [];
    for (let i = 0; i < cardCount; i++) {
      deck.push(Kaibaman);
    }
    return deck;
  }

  /**
   * @constructor
   * @param {User[]} users users of a game
   */
  constructor(users) {
    this.players = users.map((x) => new Player(x));
    this.round = 0;
    this.turn = 0;
    this.playerTurnById = this.players.reduce((acc, cur, i) => {
      acc[cur.userId] = i;
      return acc;
    }, {});
  }

  isMyTurn(userId) {
    return this.turn === this.playerTurnById[userId];
  }

  /**
   * Act on Game. \
   * END_PHASE: end my phase \
   * END_TURN: end my turn \
   * SUMMON: normal summon from <arg1> hand to <arg2> monsterSlots \
   * ATTACK: use <arg1> monsterSlots to attack <arg2> player's <arg3> monsterSlots
   * @param {String} intent Intent
   * @param {undefined|Number} arg1 Argument 1
   * @param {undefined|Number} arg2 Argument 2
   * @param {undefined|Number} arg3 Argument 3
   * @return {undefined|String} if successful
   */
  act(intent, arg1, arg2, arg3) {
    switch (intent) {
      case Game.DRAW: {
        return this.players[this.turn].draw();
      }
      case Game.END_TURN: {
        this.players[this.turn].endTurn();
        this.turn += 1;
        if (this.turn >= this.players.length) {
          this.round += 1;
          this.turn = 0;
        }
        return undefined;
      }
    }
    return undefined;
  }

  /**
   * void
   */
  phaseComplete() {
    if (this.players[this.currentPlayerIndex].isDone()) {
      this.currentPlayerIndex++;
    }
    if (this.currentPlayerIndex > this.players.length) {
      this.currentPlayerIndex = 0;
      this.round ++;
    }
  }

  playerLoseCheck() {
    let i;
    for (i = 0; i < this.players.length; i++) {
      if (this.players[i] != null) {
        if (this.players[i].hp <= 0) {
          this.players[i] = null;
        }
      }
    }
  }

  gameOverCheck() {
    let i;
    let count = 0;
    for (i = 0; i < this.players.length; i++) {
      if (this.players[i] != null) {
        count ++;
      }
    }
    if (count === 1) {
      return true;
    } else {
      return false;
    }
  }

  /**
   * Serialization for front end
   * @return {Object} the representation of the game
   */
  takeSnapShot() {
    const res = this.players[this.currentPlayerIndex].takeSnapShot();
    res.opponent = this.players.map((player) => player.takeSnapShot());
    return res;
  }
}

Game.DRAW = 'DRAW';
Game.SUMMON = 'SUMMON';
Game.ATTACK = 'ATTACK';
Game.END_TURN = 'END_TURN';

module.exports = Game;
