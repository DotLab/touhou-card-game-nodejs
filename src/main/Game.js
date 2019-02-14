const Card = require('./Cards/Card');
const Kaibaman = require('./Cards/KaibamanCard');

/**
 * The Game
 */
class Game {
  static shuffle(array) {
    let currentIndex = array.length; let temporaryValue; let randomIndex;

    // While there remain elements to shuffle...
    while (0 !== currentIndex) {
      // Pick a remaining element...
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;

      // And swap it with the current element.
      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
    }

    return array;
  }

  /**
   * @constructor
   * @param {Player[]} players players of a game
   * @param {Number} round 0-index round
   * @param {Number} currentPlayerIndex index of the current player
   */
  constructor(players) {
    this.players = players;
    this.gameOver = false;
    this.round = 0;
    this.currentPlayerIndex = 0;
  }

  createDeck() {
    let i;
    const createdDeck = new Card(40);
    for (i = 0; i < 40; i++) {
      createdDeck.push(Kaibaman);
    }
  }
  /* moveToNextRound() {
    if (this.players[this.players.length-1].phase === 4) {
      this.round++;
    }
  } */

  /**
   * @param {Object} obj players of a game
   * @return {boolean} success of action
   */
  act(obj) {
    /* name: draw, attack, place, endPhase
    * param(draw): empty
    * param(place): slot, indexOfHands, tributeSlot1, tributeSlot2, reveal, mode
    * param(attack): currenIndex, slot(own), slot(enemy), enemyIndex, enemyPlayer
    */
    const input = {
      name: obj.name,
      param: obj.param,
      enemyPlayer: this.players[obj.param.enemyIndex],
    };

    const res = this.players[this.currentPlayerIndex].act(input);
    this.phaseComplete();
    this.playerLoseCheck();
    this.gameOver = this.gameOverCheck();
    return res;
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
   * @return {object} the game
   */
  takeSnapShot() {
    const res = this.players[this.currentPlayerIndex].takeSnapShot();
    res.opponent = this.players.map((player) => player.takeSnapShot());
    return res;
  }
}

module.exports = Game;
