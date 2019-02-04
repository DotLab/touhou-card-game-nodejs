import {Card} from './Card.js';

class EnvCard extends Card {
  /**
    * @constructor
    * @param {String} id for backend database access
    * @param {String} name Each Card has its own name
    * @param {String} path Path to img of the card
    * @param {function} effect a callback function
    */
  constructor(id, name, path, effect) {
    // calls parent constructor
    super(id, name, path);
    // initialize own vars
    this.effect = effect;
  }
}

module.exports = EnvCard;


