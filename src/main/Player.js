
// const MonsterCard = require('./Cards/MonsterCard');
// const SpellCard = require('./Cards/SpellCard');
/**
 * Player class
 */
const MonsterCard = require('./Cards/MonsterCard');

class Player {
  /**
     * @constructor
     * @param {Card[]} deck randomly shuffled
     * @param {Number} hp
     * @param {Field} field
     * @param {String} username
     */
  constructor(deck, hp, field, username) {
    this.deck = deck;
    this.hp = hp || 5000;
    this.hand = [];
    this.field = field;
    this.username = username;
    this.phase = 1;
    for (let i = 0; i < 5; i++) {
      this.hand.push(deck.pop());
    }
    this.hasSummoned = false;
  }

  isDone() {
    if (this.phase === 4) {
      this.phase = 1;
      this.hasSummoned = false;
      return true;
    }
    return false;
  }

  /**
   * @param {Object} input index of card to discard(0 based)
   * @return {boolean} true if action successful
   */
  act(input) {
    if (input.name === 'draw') {
      return this.drawCard();
    } else if (input.name === 'place') {
      return this.placeCard(input.param);
    } else if (input.name === 'attack') {
      return this.attack(input.param);
    } else if (input.name === 'endPhase') {
      this.phase++;
    }
  }

  /**
     * draw a card from the desk
     * @return {boolean}
     */
  drawCard() {
    if (this.deck.length !== 0) {
      this.hand.push(this.deck.pop());
      return true;
    } else {
      document.write('The deck is empty!');
      return false;
    }
  }

  /**
   * place a card from the hand
   * @param {Object} param index of card to discard(0 based)
   * @return {boolean}
   */
  placeCard(param) {
    if (this.hand(param.indexOfHands) instanceof MonsterCard) {
      if (this.hand(param.indexOfHands).level <= 4) {
        this.summonMonster(this.hand(param.indexOfHands), param.slot, param.reveal, param.mode);
      }
      if (this.hand(param.indexOfHands).level > 4 && this.hand(param.indexOfHands).level < 7) {
        this.summonMonster(this.hand(param.indexOfHands), param.slot, param.tributeSlot1, param.reveal, param.mode);
      }
      if (this.hand(param.indexOfHands).level >= 7) {
        this.summonMonster(this.hand(param.indexOfHands), param.slot, param.tributeSlot1, param.tributeSlot2, param.reveal, param.mode);
      }
      return true;
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

  /**
   * take snapshot of current player status
   * @return {object} player status
   */
  takeSnapShot() {
    return {
      name: this.username,
      life: this.hp,
      hand: this.hand.map((card)=>card.takeSnapShot()),
      field: {
        environment: this.field.environmentSlot.takeSnapShot(),
        graveyard: this.field.graveyard.map((card)=>card.takeSnapShot()),
        monster: this.field.monsterSlots.map((card)=>card.takeSnapShot()),
        magic: this.field.spellSlots.map((card)=>card.takeSnapShot()),
      },
    };
  }
}

module.exports = Player;
