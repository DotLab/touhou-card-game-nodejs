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

  endTurn() {
    this.hasChangedDisplay = false;
  }

  canInvoke(game, player, invokeParams) {
    return false;
  }

  invoke(game, player, invokeParams) {
  }

  canSummon(display, pose) {
    return false;
  }

  summon(display, pose) {
  }

  canPlace(display) {
    return false;
  }

  place(display) {
  }

  /**
   * {actions: [{name, stage, in, params: [select, in, of]}]}
   * select: Game.PLAYER userId
   * select: Game.SLOT slotId
   * select: Game.CARD cardId
   * @return {Object} snapshot
   */
  takeSnapshot() {
    return {
      id: this.id,
      name: this.name,
      desc: this.desc,
      imgUrl: this.imgUrl,
      display: this.display,
    };
  }
}

Card.HIDDEN = 'HIDDEN';
Card.REVEALED = 'REVEALED';
Card.ATTACK = 'ATTACK';
Card.DEFENSE = 'DEFENSE';

Card.MONSTER = 'MONSTER';

module.exports = Card;
