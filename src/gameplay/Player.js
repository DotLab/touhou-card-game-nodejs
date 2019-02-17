const Field = require('./Field');
const Card = require('./cards/Card');

/**
 * Player class
 */
class Player {
  /**
   * Instantiate player class provided by id, username, and deck.
   * Create field class attached the player and assign 5 cards to his/her
   * hand.
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

  /**
   * Determine whether the player can draw the card
   * @return {boolean} true if he/she can draw card
   */
  canDraw() {
    if (this.hasDrawn) return false;
    return true;
  }

  /**
   * Draw a card from player's deck to player's hand
   */
  draw() {
    this.hasDrawn = true;
    this.hand.push(this.deck.pop());
  }

  /**
   *
   * @param {Game} game game class
   * @param {Player} actor who is executing the action
   * @param {String} action name of the action
   * @param {Object[]} actionParams the parameters of actions
   * @param {String }phase phase of the trap
   * @return {boolean} if the player needs to be suspended
   */
  shouldSuspend(game, actor, action, actionParams, phase) {
    return this.field.canActivate(game, this, actor, action, actionParams, phase);
  }

  /**
   * Suspend the game
   */
  suspend() {
    this.isSuspended = true;
  }

  /**
   * Continue the game
   */
  resume() {
    this.isSuspended = false;
  }

  /**
   * End player's turn
   */
  endTurn() {
    this.hasDrawn = false;
    this.field.endTurn();
  }

  /**
   * Determine whether the player him/herself can be directly attacked by
   * the enemy.
   * @return {boolean} true if the player can be attacked
   */
  canBeDirectlyAttacked() {
    return !this.field.hasMonster();
  }

  /**
   * Player's monster card can attack enemy himself/herself directly
   * @param {MonsterCard} monster player's monster card
   * @param {Player} targetUser enemy player class
   */
  directAttack(monster, targetUser) {
    monster.attack();
    targetUser.receiveDamage(monster.atk);
  }

  /**
   * PLayer's monster card on field attacks enemy's monster card on his/her field.
   * PLayer receives damages if his/her monster attack value is
   * lower than that of enemy's, vice versa.
   * @param {MonsterCard} monster player's monster card
   * @param {number} monsterIdx player's monster card index on field
   * @param {Player} targetUser enemy's player class
   * @param {MonsterCard} targetMonster enemy's monster card
   * @param {number} targetMonsterIdx enemy's monster card index on field
   */
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

  /**
   * PLayer receives damages if his/her card died, or no card on field
   * @param {number} attack value of damage
   */
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

  /**
   * Remove the dead monster card from field to graveyard
   * @param {number} index slot number of monster card on field
   */
  killMonsterOnField(index) {
    const card = this.field.monsterSlots[index];
    this.field.monsterSlots[index] = null;
    this.field.graveyard.push(card);
  }
}

module.exports = Player;
