import {Card} from './Card.js';

/**
 * Spell Card
 * @extends Card
 */
class SpellCard extends Card {
  /**
   * @constructor
   * @param {String} name Each Card has its own name
   * @param {String} path Path to img of the card
   * @param {Boolean} revealed True if Revealed
   * @param {String} type is the spell card a "NM"-normal magic, "QM"-quick magic, "PM"-permanant magic, "T"-trap card, "PT"-permanant trap card
   */
  constructor(name, path, revealed, type) {
    // calls parent constructor
    super(name, path, revealed);
    // initialize own vars
    this.type = type;
  }
}

module.exports = SpellCard;
