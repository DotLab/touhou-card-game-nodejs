/** @typedef {import('../Player')} Player */
/** @typedef {import('../Game')} Game */

/**
 * Card
 */
class Card {
  /**
   * Length of the generated ID
   * @param {Number} len
   * @return {String}
   */
  static generateId(len) {
    const dict = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let text = '';
    for (let i = 0; i < len; i++) {
      text += dict.charAt(Math.floor(Math.random() * dict.length));
    }
    return text;
  }

  /**
   * Create an action descriptor for snapshot
   * @param {String} name
   * @param {String} desc
   * @param {String} position
   * @param {Array} params
   * @return {Object}
   */
  static createAction(name, desc, position, params) {
    return {name, desc, in: position, params};
  }

  /**
   * Create an action parameter descriptor for snapshot
   * @param {String} select
   * @param {String} position
   * @param {String} owner
   * @param {String} desc
   * @return {Object}
   */
  static createActionParam(select, position, owner, desc) {
    return {select, in: position, of: owner, desc};
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

  /**
   * End turn.
   */
  endTurn() {
    this.hasChangedDisplay = false;
  }

  /**
   * Check if can invoke
   * @param {Game} game
   * @param {Player} player
   * @param {Array} invokeParams
   * @return {Boolean}
   */
  canInvoke(game, player, invokeParams) {
    return false;
  }

  /**
   * Invoke card effects
   * @param {Game} game
   * @param {Player} player
   * @param {Array} invokeParams
   */
  invoke(game, player, invokeParams) {
  }

  /**
   * Check if can summon
   * @param {String} display
   * @param {String} pose
   * @return {Boolean}
   */
  canSummon(display, pose) {
    return false;
  }

  /**
   * Summon
   * @param {String} display
   * @param {String} pose
   */
  summon(display, pose) {
  }

  /**
   * Check if can place
   * @param {String} display
   * @return {Boolean}
   */
  canPlace(display) {
    return false;
  }

  /**
   * Place card on ground
   * @param {String} display
   */
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
