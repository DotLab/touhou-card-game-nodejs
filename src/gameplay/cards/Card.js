/**
 * Card
 */
class Card {
  static generateId(len) {
    const dict = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let text = '';
    for (let i = 0; i < len; i++) {
      text += dict.charAt(Math.floor(Math.random() * dict.length));
    }
    return text;
  }

  /**
   * @constructor
   * @param {String} name unique name
   * @param {String} desc description
   * @param {String} imgUrl url to img of the card
   */
  constructor(name, desc, imgUrl) {
    this.id = Card.generateId(32);
    this.name = name;
    this.desc = desc;
    this.imgUrl = imgUrl;
    this.display = null;
  }

  canChangeDisplay() {
    return false;
  }

  endTurn() {
    this.hasChangedDisplay = false;
  }

  canBeTargeted() {
    return true;
  }
}

Card.HIDDEN = 'HIDDEN';
Card.REVEALED = 'REVEALED';
Card.ATTACK = 'ATTACK';
Card.DEFENSE = 'DEFENSE';

module.exports = Card;
