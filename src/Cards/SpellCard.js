import {Card} from './Card.js';


class SpellCard extends Card {
  /**
    * @consturctor
    * @param {String} id for backend database access
    * @param {String} name Each Card has its own name
    * @param {String} path Path to img of the card
    * @param {Boolean} revealed True if Revealed
    * @param {function} effect a callback function
    * @param {String} type is the spell card a "NM"-normal magic, "QM"-quick magic, "PM"-permanant magic, "T"-trap card, "PT"-permanant trap card
    */
  constructor(id, name, path, revealed, effect, type) {
    // calls parent constructor
    super(id, name, path);
    // initialize own vars
    this.revealed = revealed;
    this.effect = effect;
    this.type = type;
  }

  /*
    Activate the effect
    */
  activate() {
    this.effect.use();
  }
}

module.exports = SpellCard;
