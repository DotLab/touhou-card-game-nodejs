const Player = require('./Player');

/**
 * The Game
 */
class Game {
  /**
   * @constructor
   * @param {User[]} users users of a game
   */
  constructor(users) {
    this.players = users.map((user) => new Player(user));
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
   * draw a card
   * @return {undefined|String} error message
   */
  draw() {
    return this.players[this.turn].draw();
  }

  /**
   * normal summon a monster
   * @param {Number} handIdx card index in hand
   * @param {Number} monsterSlotIdx card index in monsterSlots
   * @param {String} display card display
   * @param {String} pose card pose
   * @return {undefined|String} error message
   */
  summon(handIdx, monsterSlotIdx, display, pose) {
    const player = this.players[this.turn];
    if (handIdx >= player.hand.length) return 'invalid card index';
    if (!player.hand[handIdx].canSummon(Game.HAND, display, pose)) return 'cannot summon';
    if (player.field.monsterSlots[monsterSlotIdx]) return 'monster grid occupied';

    const card = player.removeCardInHand(handIdx);
    player.field.monsterSlots[monsterSlotIdx] = card;
    card.summon(display, pose);

    return undefined;
  }

  /**
   * end turn
   * @return {undefined|String} error message
   */
  endTurn() {
    this.players[this.turn].endTurn();
    this.turn += 1;
    if (this.turn >= this.players.length) {
      this.round += 1;
      this.turn = 0;
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

module.exports = Game;
