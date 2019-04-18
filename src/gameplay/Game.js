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

  // static suspend(phase) {
  //   return {suspend: true, phase};
  // }

  /**
   * @constructor
   * @param {any[]} users users of a game
   */
  constructor(users) {
    /** @type {Array<Player>} */
    this.players = users.map((user) => new Player(user));
    /** @type {Number} */
    this.round = 0;
    /** @type {Number} */
    this.turn = 0;
    /** @type {Object.<string, number>} */
    this.playerIndexById = this.players.reduce((acc, cur, i) => {
      acc[cur.userId] = i;
      return acc;
    }, {});
    this.hasEnded = false;

    // /** @type {Boolean} */
    // this.isSuspended = false;
    // /** @type {String} */
    // this.suspendedAction = null;
    // /** @type {Array<Object>} */
    // this.suspendedActionParams = null;
    // /** @type {String} */
    // this.suspendedPhase = null;
  }

  /**
   * @param {String} userId
   * @return {Boolean}
   */
  isMyTurn(userId) {
    return this.turn === this.playerIndexById[userId];
  }

  // /**
  //  * @param {Player} actor
  //  * @param {String} action
  //  * @param {Array<Object>} actionParams
  //  * @param {String} phase
  //  * @return {Boolean}
  //  */
  // shouldSuspend(actor, action, actionParams, phase) {
  //   for (let i = 0; i < this.players.length; i += 1) {
  //     if (this.players[i].shouldSuspend(this, actor, action, actionParams, phase)) {
  //       return true;
  //     }
  //   }
  // }

  // /**
  //  * @param {Player} actor
  //  * @param {String} action
  //  * @param {Array<Object>} actionParams
  //  * @param {String} phase
  //  */
  // suspend(actor, action, actionParams, phase) {
  //   this.isSuspended = true;
  //   this.suspendActor = actor;
  //   this.suspendedAction = action;
  //   this.suspendedActionParams = actionParams;
  //   this.suspendedPhase = phase;

  //   for (let i = 0; i < this.players.length; i += 1) {
  //     if (this.players[i].shouldSuspend(this, actor, action, actionParams, phase)) {
  //       this.players[i].suspend();
  //     }
  //   }
  // }

  // /**
  //  * can only be called when suspended
  //  * @param {String} userId
  //  * @param {String} cardId
  //  * @param {Array<Object>} trapParams
  //  * @return {Object}
  //  */
  // activateTrap(userId, cardId, trapParams) {
  //   const player = this.players[this.playerIndexById[userId]];
  //   const card = player.field.findSpellById(cardId);

  //   if (!card.canActivate(this, player, this.suspendActor, this.suspendedAction, this.suspendedActionParams, this.suspendedPhase, trapParams)) {
  //     return Game.error('cannot activate trap');
  //   }

  //   card.activate(this, player, this.suspendActor, this.suspendedAction, this.suspendedActionParams, this.suspendedPhase, trapParams);
  //   return Game.success();
  // }

  /**
   * @param {String} spellId
   * @param {Array<String>} invokeParams
   * @return {any}
   */
  invokeSpell(spellId, invokeParams) {
    const player = this.players[this.turn];
    const spell = player.field.findSpellById(spellId);

    if (!spell) return Game.error('cannot find spell card on field');
    if (!spell.canInvoke(this, player, invokeParams)) return Game.error('cannot invoke spell card');

    spell.invoke(this, player, invokeParams);
    player.hasActivated[spell.name] = true;

    return Game.success();
  }

  /**
   * @param {String} monsterId
   * @param {Array<String>} invokeParams
   * @return {any}
   */
  invokeMonsterEffect(monsterId, invokeParams) {
    const player = this.players[this.turn];
    const monster = player.field.findMonsterById(monsterId);

    if (!monster) return Game.error('cannot find monster card on field');
    if (!monster.canInvoke(this, player, invokeParams)) return Game.error('cannot invoke monster effects');
    monster.invoke(this, player, invokeParams);

    return Game.success();
  }

  // resume() {
  //   this.isSuspended = false;
  //   this.suspendedAction = null;
  //   this.suspendedActionParams = null;
  //   this.suspendedPhase = null;

  //   for (let i = 0; i < this.players.length; i += 1) {
  //     if (this.players[i].isSuspended) {
  //       this.players[i].resume();
  //     }
  //   }

  //   return Game.success();
  // }

  /**
   * draw a card
   * @return {Object} error message
   */
  draw() {
    if (!this.players[this.turn].canDraw()) return Game.error('cannot draw');
    this.players[this.turn].draw();
    return Game.success();
  }

  /**
   * normal summon a monster
   * @param {String} monsterId card index in hand
   * @param {String} slotId card index in monsterSlots
   * @param {String} display card display
   * @param {String} pose card pose
   * @return {Object} error message
   */
  summon(monsterId, slotId, display, pose) {
    const player = this.players[this.turn];

    const monster = player.findCardInHandById(monsterId);
    if (!monster) return Game.error('cannot find monster in hand');
    if (!monster.canSummon(display, pose)) return Game.error('cannot summon monster');

    if (!player.field.hasMonsterSlot(slotId)) return Game.error('cannot find monster slot');
    if (!player.field.isSlotEmpty(slotId)) return Game.error('monster slot is not empty');

    /** @type {any} */
    player.removeCardInHandById(monsterId);
    player.field.setSlot(slotId, monster);
    monster.summon(display, pose);

    // const actionParams = [handIdx, monsterIdx, display, pose];
    // if (this.shouldSuspend(player, Game.SUMMON, actionParams, Game.AFTER)) {
    //   this.suspend(player, Game.SUMMON, actionParams, Game.AFTER);
    //   return Game.suspend(Game.AFTER);
    // }

    return Game.success();
  }

  /**
   * @param {String} spellId
   * @param {String} slotId
   * @param {String} display
   * @return {Object}
   */
  place(spellId, slotId, display) {
    const player = this.players[this.turn];

    const spell = player.findCardInHandById(spellId);
    if (!spell) return Game.error('cannot find spell in hand');
    if (!spell.canPlace(display)) return Game.error('cannot place spell');

    if (!player.field.hasSpellSlot(slotId)) return Game.error('cannot find spell slot');
    if (!player.field.isSlotEmpty(slotId)) return Game.error('spell slot is not empty');

    /** @type {any} */
    player.removeCardInHandById(spellId);
    player.field.setSlot(slotId, spell);
    spell.place(display);

    return Game.success();
  }

  changeDisplay(monsterId, display) {
    const player = this.players[this.turn];

    const monster = player.field.findMonsterById(monsterId);
    if (!monster) return Game.error('cannot find monster on field');
    if (!monster.canChangeDisplay(display)) return Game.error('cannot change monster display');

    monster.changeDisplay(display);

    return Game.success();
  }

  changePose(monsterId, pose) {
    const player = this.players[this.turn];

    const monster = player.field.findMonsterById(monsterId);
    if (!monster) return Game.error('cannot find monster onfield');
    if (!monster.canChangePose(pose)) return Game.error('cannot change monster pose');

    monster.changePose(pose);

    return Game.success();
  }

  attack(monsterId, targetMonsterId) {
    const player = this.players[this.turn];
    const monster = player.field.findMonsterById(monsterId);
    if (!monster) return Game.error('cannot find monster on field');
    if (!monster.canAttack()) return Game.error('monster cannot attack');

    const targetPlayer = this.findCardOwnerById(targetMonsterId);
    if (!targetPlayer) return Game.error('cannot find target player');

    const targetMonster = targetPlayer.field.findMonsterById(targetMonsterId);
    if (!targetMonster) return Game.error('cannot find target monster on field');

    player.attack(monster, targetPlayer, targetMonster);

    return Game.success();
  }

  directAttack(monsterId, targetPlayerId) {
    const player = this.players[this.turn];
    const monster = player.field.findMonsterById(monsterId);
    if (!monster) return Game.error('cannot find monster on field');
    if (!monster.canAttack()) return Game.error('monster cannot attack');

    const targetPlayer = this.findPlayer(targetPlayerId);
    if (!targetPlayer) return Game.error('cannot find target player');
    if (!targetPlayer.canBeDirectlyAttacked()) return Game.error('target player cannot be directly attacked');

    player.directAttack(monster, targetPlayer);

    return Game.success();
  }

  /**
   * end turn
   * @return {Object} error message
   */
  endTurn() {
    this.players[this.turn].endTurn();

    do {
      this.turn += 1;
      if (this.turn >= this.players.length) {
        this.round += 1;
        this.turn = 0;
      }
    } while (this.players[this.turn].life <= 0);

    return Game.success();
  }

  checkGameEnd() {
    let aliveCount = 0;
    this.players.forEach((player) => {
      if (player.life > 0) {
        aliveCount += 1;
      }
    });

    if (aliveCount == 1) { // somebody wins
      this.hasEnded = true;
      return true;
    }

    return false;
  }

  takeSnapshot() {
    return {
      hasEnded: this.hasEnded,
      players: this.players.map((player) => {
        const field = player.field;
        return {
          userId: player.userId,
          userName: player.userName,
          life: player.life,

          stage: this.isSuspended ? Game.SUSPENDED : (this.isMyTurn(player.userId) ? Game.MY_TURN : Game.WATCHING),

          hand: player.hand.filter((x) => x).map((card) => card.takeSnapshot()),
          field: {
            graveyard: field.graveyard.map((card) => card.takeSnapshot()),
            environmentSlot: field.environmentSlot ? field.environmentSlot.takeSnapshot() : null,
            monsterSlots: field.monsterSlots.map((card) => (card ? card.takeSnapshot() : null)),
            spellSlots: field.spellSlots.map((card) => (card ? card.takeSnapshot() : null)),
            slotIds: field.slotIds,
          },
        };
      }),
    };
  }

  findCardOwnerById(cardId) {
    for (let i = 0; i < this.players.length; i++) {
      if (this.players[i].field.findCardById(cardId)) {
        return this.players[i];
      }
    }
    return null;
  }

  findPlayer(userId) {
    for (let i = 0; i < this.players.length; i++) {
      if (this.players[i].userId === userId) {
        return this.players[i];
      }
    }
    return null;
  }
}

Game.BEFORE = 'BEFORE';
Game.AFTER = 'AFTER';

Game.DRAW = 'DRAW';
Game.SUMMON = 'SUMMON';
Game.ATTACK = 'ATTACK';
Game.END_TURN = 'END_TURN';

Game.MY_TURN = 'MY_TURN';
Game.WATCHING = 'WATCHING';
Game.SUSPENDED = 'SUSPENDED';

Game.PLAYER = 'PLAYER';
Game.CARD = 'CARD';
Game.SLOT = 'SLOT';
Game.DISPLAY = 'DISPLAY';
Game.POSE = 'POSE';

Game.SELF = 'SELF';
Game.OPPONENT = 'OPPONENT';
Game.ALL = 'ALL';

Game.HAND = 'HAND';
Game.GRAVEYARD = 'GRAVEYARD';
Game.ENVIRONMENT_SLOT = 'ENVIRONMENT_SLOT';
Game.MONSTER_SLOTS = 'MONSTER_SLOTS';
Game.SPELL_SLOTS = 'SPELL_SLOTS';

module.exports = Game;
