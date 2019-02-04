class Card {
  /**
    * @constructor
    * @param {String} id for backend database access
    * @param {String} name Each Card has its own name
    * @param {String} path Path to img of the card
    */
  constructor(id, name, path) {
    this.id = id;
    this.name = name;
    this.path = path;
  }
}

module.exports = Card;
