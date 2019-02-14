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
  }

  isMyTurn(userId) {
    return this.players[this.turn].userId === userId;
  }

  /* moveToNextRound() {
    if (this.players[this.players.length-1].phase === 4) {
      this.round++;
    }
  } */

  /**
   * Act on Game.
   * END_PHASE: end my phase
   * END_TURN: end my turn
   * SUMMON: normal summon from hand arg1 to monsterSlots arg2
   * @param {String} intent Intent
   * @param {undefined|Number} arg1 Argument 1
   * @param {undefined|Number} arg2 Argument 2
  //  * @return {undefined|String} if successful
   */
  act(intent, arg1, arg2) {
    /* name: draw, attack, place, endPhase
    * param(draw): empty
    * param(place): slot, indexOfHands, tributeSlot1, tributeSlot2, reveal, mode
    * param(attack): currenIndex, slot(own), slot(enemy), enemyIndex, enemyPlayer
    */
    // const input = {
    //   name: obj.name,
    //   param: obj.param,
    //   enemyPlayer: this.players[obj.param.enemyIndex],
    // };

    // const res = this.players[this.currentPlayerIndex].act(input);
    // this.phaseComplete();
    // this.playerLoseCheck();
    // this.gameOver = this.gameOverCheck();
    // return res;
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
