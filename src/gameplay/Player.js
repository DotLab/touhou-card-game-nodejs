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
    /** @type {dict}*/
    this.hasActivated = {};
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
    let name;
    this.hasActivated[name] = {};
    this.field.endTurn();
  }

  /**
   * @param {string} name
   * @return {Number} index
   */
  findCardInDeckByName(name) {
    let index = -1;
    for ( let i = 0; i < this.deck.length; i++) {
      if (this.deck[i].name === name) {
        index = i;
        break;
      }
    }
    return index;
  }

  /**
   * @param {Number} index of card in Deck
   * @return the card
   */

  removeCardFromDeck(index) {
    const card = this.deck.splice(index, 1);
    return card[0];
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
}

module.exports = Player;
