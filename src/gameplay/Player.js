const Field = require('./Field');
const Card = require('./cards/Card');

/**
 * Player class
 */
class Player {
  /**
   * @constructor
   * @param {User} user the user
   */
  constructor(user) {
    this.userId = user.id;
    this.userName = user.name;
    /** @type {Card[]} */
    this.deck = user.deck;
    /** @type {Card[]} */
    this.hand = [];
    this.field = new Field();

    this.life = 5000;
    this.hasDrawn = false;
    for (let i = 0; i < 5; i += 1) {
      this.hand.push(this.deck.pop());
    }
    this.isSuspended = false;
  }

  canDraw() {
    if (this.hasDrawn) return false;
    return true;
  }

  /**
   * Draw a card.
   */
  draw() {
    this.hasDrawn = true;
    this.hand.push(this.deck.pop());
  }

  shouldSuspend(game, actor, action, actionParams, phase) {
    return this.field.canActivate(game, this, actor, action, actionParams, phase);
  }

  suspend() {
    this.isSuspended = true;
  }

  resume() {
    this.isSuspended = false;
  }

  /**
   * End turn
   */
  endTurn() {
    this.hasDrawn = false;
    this.field.endTurn();
  }

  canBeDirectlyAttacked() {
    return !this.field.hasMonster();
  }

  directAttack(monster, targetUser) {
    monster.attack();
    targetUser.receiveDamage(monster.atk);
  }

  attack(monster, monsterIdx, targetUser, targetMonster, targetMonsterIdx) {
    if (targetMonster.pose === Card.ATTACK) {
      if (monster.atk > targetMonster.atk) {
        const damage = monster.atk - targetMonster.atk;
        targetUser.killMonsterOnField(targetMonsterIdx);
        targetUser.receiveDamage(damage);
      } else if (monster.atk < targetMonster.atk) {
        const damage = targetMonster.atk - monster.atk;
        this.killMonsterOnField(monsterIdx);
        this.receiveDamage(damage);
      } else {
        this.killMonsterOnField(monsterIdx);
        targetUser.killMonsterOnField(targetMonsterIdx);
      }
    }
  }

  receiveDamage(attack) {
    this.life -= attack;
  }

  /**
   * Remove a card from hand
   * @param {Number} index card index in hand
   * @return {Card} card
   */
  removeCardInHand(index) {
    const removed = this.hand.splice(index, 1);
    return removed[0];
  }

  killMonsterOnField(index) {
    const card = this.field.monsterSlots[index];
    this.field.monsterSlots[index] = null;
    this.field.graveyard.push(card);
  }

  compareFieldName(index, name) {
    if (this.field.monsterSlots[index].name === name) {
      return true;
    }
    return false;
  }

  compareHandName(index, name) {
    if (this.field.hand[index].name === name) {
      return true;
    }
    return false;
  }

  compareDeckName(index, name) {
    if (this.field.deck[index].name === name) {
      return true;
    }
    return false;
  }
}

Player.InitialCardCount = 5;

module.exports = Player;
