/**
 * Game class
 */
class Game {
  /**
     * @constructor
     * @param {Player[]} players players of a game
     * @param {Number} round 0-index round
     * @param {Number} currentPlayerIndex index of the current player
     */
  constructor(players) {
    this.players = players;
    this.round = 0;
    this.currentPlayerIndex = 0;
  }

  moveToNextRound() {
    if (this.players[this.players.length-1].phase === 4) {
      this.round++;
    }
  }

  /*
   * @param {Object} obj players of a game
   *return boolean success of action
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
    return res;
  }

  /*
    void
   */
  phaseComplete() {
    if (this.players[this.currentPlayerIndex].isDone()) {
      this.currentPlayerIndex++;
    }
    if (this.currentPlayerIndex > this.players.length) {
      this.currentPlayerIndex = 0;
    }
  }

  /* return the game
   */
  takeSnapShot() {
    const res = this.players[this.currentPlayerIndex].takeSnapShot();
    res.opponent = this.players.map((player) => player.takeSnapShot());
    return res;
  }
}

module.exports = Game;
