const Player = require('./Player');

/**
 * The Game
 */
class Game {
  static success() {
    return {success: true};
  }

  static error(msg) {
    return {error: true, msg};
  }

  static suspend(phase) {
    return {suspend: true, phase};
  }

  /**
   * @constructor
   * @param {User[]} users users of a game
   */
  constructor(users) {
    /** @type {Array<Player>} */
    this.players = users.map((user) => new Player(user));
    /** @type {Number} */
    this.round = 0;
    /** @type {Number} */
    this.turn = 0;
    /** @type {Object} */
    this.playerIndexById = this.players.reduce((acc, cur, i) => {
      acc[cur.userId] = i;
      return acc;
    }, {});

    /** @type {Boolean} */
    this.isSuspended = false;
    /** @type {String} */
    this.suspendedAction = null;
    /** @type {Array<Object>} */
    this.suspendedActionParams = null;
    /** @type {String} */
    this.suspendedPhase = null;
  }

  /**
   * @param {String} userId
   * @return {Boolean}
   */
  isMyTurn(userId) {
    return this.turn === this.playerIndexById[userId];
  }

  /**
   * @param {Player} actor
   * @param {String} action
   * @param {Array<Object>} actionParams
   * @param {String} phase
   * @return {Boolean}
   */
  shouldSuspend(actor, action, actionParams, phase) {
    for (let i = 0; i < this.players.length; i += 1) {
      if (this.players[i].shouldSuspend(this, actor, action, actionParams, phase)) {
        return true;
      }
    }
  }

  /**
   * @param {Player} actor
   * @param {String} action
   * @param {Array<Object>} actionParams
   * @param {String} phase
   */
  suspend(actor, action, actionParams, phase) {
    this.isSuspended = true;
    this.suspendActor = actor;
    this.suspendedAction = action;
    this.suspendedActionParams = actionParams;
    this.suspendedPhase = phase;

    for (let i = 0; i < this.players.length; i += 1) {
      if (this.players[i].shouldSuspend(this, actor, action, actionParams, phase)) {
        this.players[i].suspend();
      }
    }
  }

  /**
   * can only be called when suspended
   * @param {String} userId
   * @param {String} cardId
   * @param {Array<Object>} trapParams
   * @return {Object}
   */
  activateTrap(userId, cardId, trapParams) {
    const player = this.players[this.playerIndexById[userId]];
    const card = player.field.findSpellById(cardId);

    if (!card.canActivate(this, player, this.suspendActor, this.suspendedAction, this.suspendedActionParams, this.suspendedPhase, trapParams)) {
      return Game.error('cannot activate trap');
    }

    card.activate(this, player, this.suspendActor, this.suspendedAction, this.suspendedActionParams, this.suspendedPhase, trapParams);
    return Game.success();
  }

  invokeSpell(spellIdx, spellParams) {
    const player = this.players[this.turn];
    const spell = player.field.spellSlots[spellIdx];

    if (!spell.canInvoke(spellParams)) return Game.error('cannot activate');
    spell.invoke(this, player, spellParams);

    return Game.success();
  }

  resume() {
    this.isSuspended = false;
    this.suspendedAction = null;
    this.suspendedActionParams = null;
    this.suspendedPhase = null;

    for (let i = 0; i < this.players.length; i += 1) {
      if (this.players[i].isSuspended) {
        this.players[i].resume();
      }
    }

    return Game.success();
  }

  /**
   * draw a card
   * @return {undefined|String} error message
   */
  draw() {
    if (!this.players[this.turn].canDraw()) return Game.error('cannot draw');
    this.players[this.turn].draw();
    return Game.success();
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
    if (handIdx >= player.hand.length) return Game.error('invalid card index');
    if (!player.hand[handIdx].canSummon(display, pose)) return Game.error('cannot summon card');
    if (player.field.monsterSlots[monsterIdx] !== null) return Game.error('monster grid occupied');

    const card = player.removeCardInHand(handIdx);
    player.field.monsterSlots[monsterIdx] = card;
    card.summon(display, pose);

    const actionParams = [handIdx, monsterIdx, display, pose];
    if (this.shouldSuspend(player, Game.SUMMON, actionParams, Game.AFTER)) {
      this.suspend(player, Game.SUMMON, actionParams, Game.AFTER);
      return Game.suspend(Game.AFTER);
    }

    return Game.success();
  }

  place(handIdx, spellIdx, display) {
    const player = this.players[this.turn];
    if (!player.hand[handIdx].canPlace(display)) return Game.error('cannot place card');

    const card = player.removeCardInHand(handIdx);
    player.field.spellSlots[spellIdx] = card;
    card.place(display);

    return Game.success();
  }

  changeDisplay(monsterIdx, display) {
    const player = this.players[this.turn];

    const monster = player.field.monsterSlots[monsterIdx];
    if (monster === null) return Game.error('no monster');
    if (!monster.canChangeDisplay(display)) return Game.error('cannot change display');

    monster.changeDisplay(display);

    return Game.success();
  }

  changePose(monsterIdx, pose) {
    const player = this.players[this.turn];

    const monster = player.field.monsterSlots[monsterIdx];
    if (monster === null) return Game.error('no monster');
    if (!monster.canChangePose(pose)) return Game.error('cannot change pose');

    monster.changePose(pose);

    return Game.success();
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
    if (!monster) return Game.error('invalid card index');
    if (!monster.canAttack()) return Game.error('cannot attack');
    if (targetPlayerIdx >= this.players.length) return Game.error('invalid player index');

    const targetPlayer = this.players[targetPlayerIdx];
    if (targetPlayer.canBeDirectlyAttacked()) {
      player.directAttack(monster, targetPlayer);
    } else {
      const targetMonster = targetPlayer.field.monsterSlots[targetMonsterIdx];
      if (!targetMonster) return Game.error('invalid target card index');
      if (!targetMonster.canBeTargeted()) return Game.error('cannot be targeted');

      player.attack(monster, monsterIdx, targetPlayer, targetMonster, targetMonsterIdx);
    }

    return Game.success();
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
    return Game.success();
  }
}

Game.BEFORE = 'BEFORE';
Game.AFTER = 'AFTER';

Game.DRAW = 'DRAW';
Game.SUMMON = 'SUMMON';
Game.ATTACK = 'ATTACK';
Game.END_TURN = 'END_TURN';

module.exports = Game;
