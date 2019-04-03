const Card = require('./Card.js');
const Game = require('../Game');

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
    this.cardType = Card.MONSTER;
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

  takeSnapshot() {
    return {
      ...super.takeSnapshot(),
      lv: this.lv,
      atk: this.atk,
      dfs: this.dfs,
      pose: this.pose,
      /* eslint-disable no-multi-spaces */
      actions: [
        {name: 'summon',        stage: Game.MY_TURN, in: Game.HAND,          params: [{select: Game.SLOT, in: Game.MONSTER_SLOTS, of: Game.SELF}]},
        {name: 'changeDisplay', stage: Game.MY_TURN, in: Game.MONSTER_SLOTS, params: []},
        {name: 'changePose',    stage: Game.MY_TURN, in: Game.MONSTER_SLOTS, params: []},
        {name: 'attack',        stage: Game.MY_TURN, in: Game.MONSTER_SLOTS, params: [{select: Game.CARD, in: Game.MONSTER_SLOTS, of: Game.OPPONENT}]},
        {name: 'directAttack',  stage: Game.MY_TURN, in: Game.MONSTER_SLOTS, params: [{select: Game.SLOT, in: Game.MONSTER_SLOTS, of: Game.OPPONENT}]},
      ],
      /* eslint-enable no-multi-spaces */
    };
  }
}
Card.MONSTER = 'MONSTER';
module.exports = MonsterCard;
