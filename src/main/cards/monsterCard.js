import {Card} from './Card.js';

class MonsterCard extends Card {
  /**
    * @constructor
    * @param {String} id for backend database access
    * @param {String} name Each Card has its own name
    * @param {String} path Path to img of the card
    * @param {Boolean} revealed True if Revealed
    * @param {String} mode "ATT" for attack mode and "DEF" for defense mode
    * @param {Number} level monster's level
    * @param {Number} att Attack
    * @param {Number} def Defense
    * @param {function} effect a callback function
    */
  constructor(id, name, path, revealed, mode, level, att, def, effect) {
    // calls parent constructor
    super(id, name, path);
    // initialize own vars
    this.revealed = revealed;
    this.mode = mode;
    this.level = level;
    this.att = att;
    this.def = def;
    this.effect = effect;
  }

  /**
    * Attack function when exists monster
    * @param {MonsterCard} target Targeted monster to attack
    * @return {Number} cccdifference where difference  = this.att - target.att (att mode) or this.def - target.def (def mode) when difference > 0,
    * the opponent receives dmg else, the attacker receives dmg
    */
  attack(target) {
    let difference;
    // if target is not revealed then it is in def mode
    if (target.revealed === false) {
      difference = this.att - target.def;
    }
    // if target in def mode:
    if (target.mode === 'DEF') {
      difference = this.att - target.def;
    }
    // if target in att mode:
    if (target.mode === 'ATT') {
      difference = this.att - target.att;
    }
    return difference;
  }

  /**
   * Attack when no monster on opponent's field
   * The dmg incurs is the ATT of this monster
   * @return {Number} the damage incurs
   */
  attackDirectly() {
    return this.att;
  }

  /**
   *if not revealed, flip the card
   *Throws Exception if card is already revealed
   */
  flip() {
    if (this.revealed === true) {
      document.write('Card is Already Revealed');
    }
    this.revealed == true;
  }

  /**
    * Use the effect
    */
  useEffect() {
    this.effect.use();
  }
}

module.exports = MonsterCard;
