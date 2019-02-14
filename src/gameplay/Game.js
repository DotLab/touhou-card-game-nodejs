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
    this.playerIndexById = this.players.reduce((acc, cur, i) => {
      acc[cur.userId] = i;
      return acc;
    }, {});
  }

  isMyTurn(userId) {
    return this.turn === this.playerIndexById[userId];
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
   * @param {Number} monsterIdx card index in monsterSlots
   * @param {String} display card display
   * @param {String} pose card pose
   * @return {undefined|String} error message
   */
  summon(handIdx, monsterIdx, display, pose) {
    const player = this.players[this.turn];
    if (handIdx >= player.hand.length) return 'invalid card index';
    if (!player.hand[handIdx].canSummon(Game.HAND, display, pose)) return 'cannot summon';
    if (player.field.monsterSlots[monsterIdx]) return 'monster grid occupied';

    const card = player.removeCardInHand(handIdx);
    player.field.monsterSlots[monsterIdx] = card;
    card.summon(display, pose);

    return undefined;
  }

  /**
   * normal summon a monster
   * @param {Number} monsterIdx card index in monsterSlots
   * @param {Number} targetPlayerIdx target player index
   * @param {Number} targetMonsterIdx target card index in monsterSlots
   * @return {undefined|String} error message
   */
  attack(monsterIdx, targetPlayerIdx, targetMonsterIdx) {
    const player = this.players[this.turn];
    const monster = player.field.monsterSlots[monsterIdx];
    if (!monster) return 'invalid card index';
    if (!monster.canAttack()) return 'cannot attack';
    if (targetPlayerIdx > this.players.length) return 'invalid player index';

    const targetPlayer = this.players[targetPlayerIdx];
    if (targetPlayer.canBeDirectlyAttacked()) {
      player.directAttack(monster, targetPlayer);
    } else {
      const targetMonster = targetPlayer.field.monsterSlots[targetMonsterIdx];
      if (!targetMonster) return 'invalid target card index';
      if (!targetMonster.canBeTargeted()) return 'cannot be targeted';

      player.attack(monster, monsterIdx, targetPlayer, targetMonster, targetMonsterIdx);
    }
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
}

module.exports = Game;