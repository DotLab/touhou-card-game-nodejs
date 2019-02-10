/**
 * Game class
 */
class Game {
  /**
     * @constructor
     * @param {Player[]} players players of a game
     * @param {Number} round 0-index round
     * @param {Number} currentPlayer index of the current player
     */
  constructor(players) {
    this.players = players;
    this.round = 0;
    this.currentPlayer = 0;
  }

  moveToNextRound() {
    if (this.players[this.players.length-1].phase === 4) {
      this.round++;
    }
  }

  /*
    return boolean success of action
   */
  act(obj) {
    /* name: draw, attack, place
    * param(draw): empty
    * param(place): slot, indexOfHands
    * param(attack): slot(own), slot(enemy), enemyIndex
    */
    const input = {
      name: obj.name,
      param: obj.param,
    };

    const success = this.players[this.currentPlayer].act(input);

    return success;
  }

  /*
    void
   */
  phaseOneComplete() {
    if (this.players[this.currentPlayer].isDone()) {
      this.currentPlayer++;
    }
    if (this.currentPlayer > this.players.length) {
      this.currentPlayer = 0;
    }
  }
}

module.exports = Game;
