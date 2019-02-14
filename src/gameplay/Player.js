const Card = require('./cards/Card');
const Kaibaman = require('./cards/KaibamanCard');
const MonsterCard = require('./cards/MonsterCard');
const Field = require('./Field');

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
  }

  /**
   * Draw a card.
   * @return {undefined|String} message
   */
  draw() {
    if (this.hasDrawn) return 'already drawn';
    this.hasDrawn = true;
    this.hand.push(this.deck.pop());
    return undefined;
  }

  /**
   * End turn
   */
  endTurn() {
    this.hasDrawn = false;
  }

  isDone() {
    if (this.phase === 4) {
      this.phase = 1;
      return true;
    }
    return false;
  }

  createDeck() {
    let i;
    let createdDeck = new Card(40);
    for (i = 0; i < 40; i++) {
      createdDeck.push(Kaibaman);
    }
    createdDeck = this.shuffle(createdDeck);
    return createdDeck;
  }

  /**
   * @return {boolean} true if action successful
   */
  act() {
    return true;
  }

  /**
   * draw a card from the desk
   * @return {boolean|undefined}
   */
  drawCard() {
    if (this.deck.length != 0) {
      this.hand.push(this.deck.pop());
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
    if (monster.level <= 4) { // normal summon
      if (this.field.monsterSlots[n] != null) { // slot must be empty
        return -1;
      }
      if ((revealed == false && mode == 'DEF') || (revealed == true && mode == 'ATT')) { // must be Hidden Defense Mode or Revealed Attack Mode
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
   * tributeSummon1 from hand
   * @param {MonsterCard} monster monster to  summon
   * @param {Number} n the index of monsterSlot in the filed(0 based)
   * @param {Number } n1 the index of monsterSlot in the filed(0 based) to tribute
   * @param {Boolean} revealed True if Revealed
   * @param {String} mode "ATT" for attack mode and "DEF" for defense mode
   * @return {Number} 1 on success, -1 on fail
   */
  tributeSummon1(monster, n, n1, revealed, mode) {
    if (monster.level > 4 && monster.level <= 6) {
      if (this.field.monsterSlots[n1] == null) {// nothing to tribute
        return -1;
      }
      if (this.field.monsterSlots[n] != null && n != n1) {// n has been occupied and cannot be emptied after tribute
        return -1;
      }
      if (revealed == true) { // must be in Revealed Defense Mode or Revealed Attack Mode
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
   * @param {MonsterCard} monster monster to  summon
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
    if (revealed == true) {// must be in Revealed Defense Mode or Revealed Attack Mode
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
   * @param {Number} n the index of monsterSlot in the filed(0 based)
   * @param {SpellCard} spellcard to placed
   * @param {Boolean} revealed true if revealed
   * @return {Number} 1 on sucess, -1 on fail
   */
  addSpell(n, spellcard, revealed) {
    if (this.field.spellSlots[n] != null) {
      return -1;
    }
    spellcard.revealed = revealed;
    this.field.spellSlots[n] = spellcard;
    return 1;
  }
  /**
    * @param {Number} n the index of monsterSlot in the filed(0 based)
    * @return {Number} 1 on success, -1 on fail
    */
  removeSpell(n) {
    if (this.field.spellSlots[n] == null) {
      return -1;
    }
    this.field.graveyard.push(this.field.spellSlots[n]);
    this.field.spellSlots[n]= null;
    return 1;
  }

  /**
   * @param {EnvCard} env the index of monsterSlot in the filed(0 based)
   * @return {Number} 1 on success, -1 on fail
   */
  setEnv(env) {
    if (this.environmentSlot != null) {
      return -1;
    }
    this.environmentSlot = env;
    return 1;
  }

  /**
   * @return {Number} 1 on success, -1 on fail
   */
  removeEnv() {
    if (this.environmentSlot == null) {
      return -1;
    }
    this.field.graveyard.push(this.field.environmentSlot);
    this.field.environmentSlot = null;
    return 1;
  }

  findCardInHandByName(name) {
    for (let i = 0; i < this.hand.length; i++) {
      if (this.hand[i].name === name) {
        return i;
      }
    }
    return -1;
  }

  removeCardInHand(index) {
    const removed = this.hand.splice(index, 1);
    return removed[0];
  }

  findCardOnFieldById(id) {
    for (let i = 0; i < this.field.length; i++) {
      if (this.field.monsterSlots[i].id === id) {
        return i;
      }
    }
    return -1; // not likely to happen
  }

  killMonsterCardOnField(index) {
    const removed = this.field.monsterSlots.splice(index, 1);
    this.field.graveyard.push(removed);
  }

  placeCardOnField(index, card) {
    this.field.monsterSlots[index] = card;
  }
}

module.exports = Player;
