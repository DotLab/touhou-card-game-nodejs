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
    this.pose = null;
    this.hasAttacked = false;
    this.hasChangedDisplay = false;
    this.lockDisplay = false;
    this.hasChangedPose = false;
    this.lockPose = false;
  }

  canSummon(display, pose) {
    if (display === Card.HIDDEN && pose === Card.ATTACK) return false;
    return true;
  }

  summon(display, pose) {
    this.display = display;
    this.pose = pose;
  }

  canChangeDisplay() {
    if (this.hasChangedDisplay) return false;
    if (this.lockDisplay) return false;
    return true;
  }

  canChangePose() {
    if (this.hasChangedPose) return false;
    if (this.lockPose) return false;
    return true;
  }

  changeDisplay(display) {
    this.display = display;
    this.hasChangedDisplay = true;
  }

  changePose(pose) {
    this.pose = pose;
    this.hasChangedPose = true;
  }

  canAttack() {
    return this.pose === Card.ATTACK && !this.hasAttacked;
  }

  attack() {
    this.hasAttacked = true;
  }

  endTurn() {
    super.endTurn();
    this.hasAttacked = false;
    this.hasChangedDisplay = false;
    this.hasChangedPose = false;
  }
}

module.exports = MonsterCard;
