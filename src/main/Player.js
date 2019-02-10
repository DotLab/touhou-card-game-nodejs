
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
      // document.write('The deck is empty!');
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
        this.normalSummon(this.hand(param.indexOfHands), param.slot, param.reveal, param.mode);
      }
      if (this.hand(param.indexOfHands).level > 4 && this.hand(param.indexOfHands).level < 7) {
        this.tributeSummon1(this.hand(param.indexOfHands), param.slot, param.tributeSlot1, param.reveal, param.mode);
      }
      if (this.hand(param.indexOfHands).level >= 7) {
        this.tributeSummon2(this.hand(param.indexOfHands), param.slot, param.tributeSlot1, param.tributeSlot2, param.reveal, param.mode);
      }
      return true;
    }
  }

  /**
   * attack from one player towards another one
   * @param {Object} param index of card to discard(0 based)
   * @return {boolean}
   */
  attack(param) {
    const ownMonsterIndex = param.ownMonsterIndex;
    const enemyMonsterIndex = param.enemyMonsterIndex;
    const enemyPlayer = param.enemyPlayer;

    if (enemyMonsterIndex === -1) {
      if (!enemyPlayer.field.monsterSlots.some((card) => card !== null)) {
        enemyPlayer.hp -= this.field.monsterSlots[ownMonsterIndex].att;
      }
    }

    const diff = this.field.monsterSlots[ownMonsterIndex].attack(enemyPlayer.field.monsterSlots[enemyMonsterIndex]);


    if (diff > 0) {
      enemyPlayer.hp -= diff;
      enemyPlayer.field.monsterSlots[enemyMonsterIndex] = null;
    } else {
      this.hp -= diff;
      this.field.monsterSlots[ownMonsterIndex] = null;
    }
    return true;
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
     * normalSummon from hand
     * @param {MonsterCard} monster the monster to be summoned from hand
     * @param {Number} n the index of monsterSlot in the filed(0 based)
     * @param {Boolean} revealed True if Revealed
     * @param {String} mode "ATT" for attack mode and "DEF" for defense mode
     * @return {Number} -1 if fail, 1 if succeed to summon.
     */
  normalSummon(monster, n, revealed, mode) {
    if (this.hasSummoned == true) {
      return -1;
    }
    if (monster.level <= 4) { // normal summon
      // slot must be empty
      if (this.field.monsterSlots[n] != null) {
        return -1;
      }
      if ((revealed == false && mode == 'DEF') || (revealed == true && mode == 'ATT')) {// must be Hidden Defense Mode or Revealed Attack Mode
        monster.revealed = revealed;
        monster.mode = mode;
        this.field.monsterSlots[n] = monster;
        this.hasSummoned = true;
        return 1;
      }
      return -1;
    }
    return -1;
  }
  /**
     * tributeSummon1 from hand
     * @param {MonsterCard} monster the monster to be summoned from hand
     * @param {Number} n the index of monsterSlot in the filed(0 based)
     * @param {Number } n1 the index of monsterSlot in the filed(0 based) to tribute
     * @param {Boolean} revealed True if Revealed
     * @param {String} mode "ATT" for attack mode and "DEF" for defense mode
     * @return {Number} 1 on sucess, -1 on fail
     */
  tributeSummon1(monster, n, n1, revealed, mode) {
    if (monster.level > 4 && monster.level <= 6) {
      if (this.field.monsterSlots[n1] == null) {// nothing to tribute
        return -1;
      }
      if (this.field.monsterSlots[n] != null && n != n1) {// n has been occupied and cannot be emptied after tribute
        return -1;
      }
      if (revealed == true) {// must be in Revealed Defense Mode or Revealed Attack Mode
        this.field.graveyard.push(this.field.monsterSlots[n1]);
        this.field.monsterSlots[n1] = null;
        monster.revealed = revealed;
        monster.mode = mode;
        this.field.monsterSlots[n] = monster;
        return 1;
      }
      return -1;
    }
    return -1;
  }
  /**
     * tributeSummon2 from hand
     * @param {MonsterCard} monster the monster to be summoned from hand
     * @param {Number} n the index of monsterSlot in the filed(0 based)
     * @param {Number } n1 the index of monsterSlot in the filed(0 based) to tribute
     * @param {Number } n2 the index of monsterSlot in the filed(0 based) to tribute
     * @param {Boolean} revealed True if Revealed
     * @param {String} mode "ATT" for attack mode and "DEF" for defense mode
     * @return {Number} 1 on sucess, -1 on fail
     */
  tributeSummon2(monster, n, n1, n2, revealed, mode) {
    if (monster.level < 7) {
      return -1;
    }
    if (n1 == n2 || this.field.monsterSlots[n1] == null || this.field.monsterSlots[n2] == null) {// nothing to tribute
      return -1;
    }
    if (this.field.monsterSlots[n] != null && n != n1 && n != n2) {// n has been occupied and cannot be emptied after tribute
      return -1;
    }
    if (revealed == true) { // must be in Revealed Defense Mode or Revealed Attack Mode
      this.field.graveyard.push(this.field.monsterSlots[n1]);
      this.field.monsterSlots[n1] = null;
      this.field.graveyard.push(this.field.monsterSlots[n2]);
      this.field.monsterSlots[n2] = null;
      monster.revealed = revealed;
      monster.mode = mode;
      this.field.monsterSlots[n] = monster;
      return 1;
    }
    return -1;
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
