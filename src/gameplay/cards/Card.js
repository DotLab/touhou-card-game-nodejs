/**
 * Card
 */
class Card {
  static generateId(len) {
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let text = '';
    for (let i = 0; i < len; i++) {
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
  }

  /**
   * @constructor
   * @param {String} name Each Card has its own name
   * @param {String} path Path to img of the card
   * @param {Boolean} revealed Path to img of the card
   */
  constructor(name, path, revealed) {
    this.id = Card.generateId(32);
    this.name = name;
    this.path = path;
    this.revealed = revealed;
  }

  effect(owner, target) {

  }

  takeSnapShot() {
    return {
      id: this.id,
      imgUrl: this.path,
    };
  }
}

module.exports = Card;
