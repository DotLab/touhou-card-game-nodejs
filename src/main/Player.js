
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
     * normalSummon from hand
     * @param {MonsterCard} monster the monster to be summoned from hand
     * @param {Number} n the index of monsterSlot in the filed(0 based)
     * @param {Boolean} revealed True if Revealed
     * @param {String} mode "ATT" for attack mode and "DEF" for defense mode
     * @return {Number} -1 if fail, 1 if succeed to summon.
     */
  normalSummon(monster, n, revealed, mode) {
    if (monster.level <= 4) { // normal summon 
      if(this.field.monsterSlots[n] != null) //slot must be empty
      {
         return -1;
      }
      if((revealed == false && mode == "DEF") || (revealed == true && mode == "ATT"))// must be Hidden Defense Mode or Revealed Attack Mode
      {
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
     * @return {Number} 1 on sucess, -1 on fail
     */
  tributeSummon1(monster, n, n1, revealed, mode){
    if (monster.level > 4 && monster.level <= 6){
      if(this.field.monsterSlots[n1] == null) //nothing to tribute
        return -1;
      if(this.field.monsterSlots[n] != null && n != n1)// n has been occupied and cannot be emptied after tribute
        return -1;
      if(revealed == true)//must be in Revealed Defense Mode or Revealed Attack Mode
      {
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
  tributeSummon2(monster, n, n1, n2, revealed, mode){
    if(monster.level < 7)
      return -1;
    if(n1 == n2 || this.field.monsterSlots[n1] == null || this.field.monsterSlots[n2] == null)//nothing to tribute
      return -1;
    if(this.field.monsterSlots[n] != null && n != n1 && n != n2)// n has been occupied and cannot be emptied after tribute
      return -1;
    if(revealed == true)//must be in Revealed Defense Mode or Revealed Attack Mode
    {
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
  addSpell(n, spellcard, revealed){
    if(this.field.spellSlots[n] != null)
      return -1;
    spellcard.revealed = revealed;
    this.field.spellSlots[n] = spellcard;
    return 1;
  }
  /**
    * @param {Number} n the index of monsterSlot in the filed(0 based) 
    * @return {Number} 1 on sucess, -1 on fail
    */
   removeSpell(n){
    if(this.field.spellSlots[n] == null)
      return -1;
    this.field.graveyard.push(this.field.spellSlots[n])
    this.field.spellSlots[n]= null;
    return 1;
  }
  /**
    * @param {EnvCard} env the index of monsterSlot in the filed(0 based) 
    * @return {Number} 1 on sucess, -1 on fail
    */
   setEnv(env) {
    if(this.environmentSlot != null)
      return -1;
    this.environmentSlot = env;
    return 1;
   }
  /**
    * @return {Number} 1 on sucess, -1 on fail
  */
  removeEnv(){
    if(this.environmentSlot == null)
      return -1;
    this.field.graveyard.push(this.field.environmentSlot);
    this.field.environmentSlot = null;
    return 1;
  }

}

module.exports = Player;
