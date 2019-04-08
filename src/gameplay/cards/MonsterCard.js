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

  canChangeDisplay(display) {
    if (this.hasChangedDisplay) return false;
    if (this.lockDisplay) return false;
    return true;
  }

  canChangePose(pose) {
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
      actions: [
        {
          name: 'summon',
          desc: 'summon this monster to the field',
          in: Game.HAND,
          params: [
            {select: Game.SLOT, in: Game.MONSTER_SLOTS, of: Game.SELF, desc: 'select an empty slot in the monster slots to summon'},
            {select: Game.DISPLAY, desc: 'select the display of the monster'},
            {select: Game.POSE, desc: 'select the pose of the monster'},
          ],
        },
        {
          name: 'changeDisplay',
          desc: 'change the display of this monster',
          in: Game.MONSTER_SLOTS, params: [
            {select: Game.DISPLAY, desc: 'select the display of the monster'},
          ],
        },
        {
          name: 'changePose',
          desc: 'change the pose of this monster',
          in: Game.MONSTER_SLOTS, params: [
            {select: Game.POSE, desc: 'select the pose of the monster'},
          ],
        },
        {
          name: 'attack',
          desc: 'order this monster to attack',
          in: Game.MONSTER_SLOTS, params: [
            {select: Game.OPPONENT, desc: 'select the opponent to attack'},
            {select: Game.CARD, in: Game.MONSTER_SLOTS, of: Game.OPPONENT, desc: 'select the opponent\'s monster to attack'},
          ],
        },
        {
          name: 'directAttack',
          desc: 'order this monster to directly attack opponents',
          in: Game.MONSTER_SLOTS,
          params: [
            {select: Game.OPPONENT, desc: 'select the opponent to attack'},
          ],
        },
      ],
    };
  }
}

module.exports = MonsterCard;
