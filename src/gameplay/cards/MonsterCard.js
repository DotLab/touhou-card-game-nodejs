const Card = require('./Card.js');

/**
 * Monster Card
 * @extends Card
 */
class MonsterCard extends Card {
  /**
   * @constructor
   * @param {String} name unique name
   * @param {String} desc description
   * @param {String} imgUrl url to img of the card
   * @param {Number} lv monster level
   * @param {Number} atk monster attack
   * @param {Number} dfs monster defense
   */
  constructor(name, desc, imgUrl, lv, atk, dfs) {
    super(name, desc, imgUrl);
    this.lv = lv;
    this.atk = atk;
    this.dfs = dfs;
  }

  canSummon() {
    return true;
  }

  summon(display, pose) {
    this.display = display;
    this.pose = pose;
  }
}

module.exports = MonsterCard;
