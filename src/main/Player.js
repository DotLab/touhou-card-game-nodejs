
// const MonsterCard = require('./Cards/MonsterCard');
// const SpellCard = require('./Cards/SpellCard');
/**
 * Player class
 */
class Player {
  /**
     * @constructor
     * @param {Card[]} deck randomly shuffled
     * @param {Number} hp
     * @param {Field} field
     * @param {Number} phase 1, 2 or 3
     */
  constructor(deck, hp, field) {
    this.deck = deck;
    this.hp = hp || 5000;
    this.hand = [];
    this.field = field;
    this.pahse = 1;
    for (let i = 0; i < 5; i++) {
      this.hand.push(deck.pop());
    }
  }

  isDone() {
    if (this.phase === 4) {
      this.phase = 1;
      return true;
    }
    return false;
  }

  /**
   *
   * @return {boolean} true if action successful
   */
  act() {
    return true;
  }
  /**
     * draw a card from the desk
     * @return {undefined}
     */
  drawCard() {
    if (this.deck.length != 0) {
      this.hand.push(this.deck.pop());
    } else {
      document.write('The deck is empty!');
    }
  }

  /**
     * discard a card from hand
     * @param {Number} n the index of card to discard(0 based)
     * @return {undefined}
     */
  discardCard(n) {
    this.field.graveyard.push((this.hand.slice(n, 1)));
  }

  /**
     * summonMonster from hand
     * @param {MonsterCard} monster the monster to be summoned from hand
     * @param {Number }n the index of monsterSlot in the filed(0 based)
     * @return {undefined}
     */
  summonMonster(monster, n) {
    if (this.field.monsterSlots[n] == null) {
      this.field.monsterSlots[n] = monster;
    }
    // to-do: Tribute Summon the Monster, Special Summon the Monster
  }
}

module.exports = Player;
