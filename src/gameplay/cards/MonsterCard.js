const Card = require('./Card.js');
const Game = require('../Game');

const action = Card.createAction;
const param = Card.createActionParam;

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

  /**
   * check if can summon
   * @param {String} display
   * @param {String} pose
   * @return {Boolean}
   */
  canSummon(display, pose) {
    if (display === Card.HIDDEN && pose === Card.ATTACK) return false;
    return true;
  }

  /**
   * summon
   * @param {String} display
   * @param {String} pose
   */
  summon(display, pose) {
    this.display = display;
    this.pose = pose;
  }

  /**
   * check if can change display
   * @param {String} display
   * @return {Boolean}
   */
  canChangeDisplay(display) {
    if (this.hasChangedDisplay) return false;
    if (this.lockDisplay) return false;
    return true;
  }

  /**
   * check if can change pose
   * @param {String} pose
   * @return {Boolean}
   */
  canChangePose(pose) {
    if (this.hasChangedPose) return false;
    if (this.lockPose) return false;
    return true;
  }

  /**
   * change display
   * @param {String} display
   */
  changeDisplay(display) {
    this.display = display;
    this.hasChangedDisplay = true;
  }

  /**
   * change pose
   * @param {String} pose
   */
  changePose(pose) {
    this.pose = pose;
    this.hasChangedPose = true;
  }

  /**
   * check can attack
   * @return {Boolean}
   */
  canAttack() {
    return this.pose === Card.ATTACK && !this.hasAttacked;
  }

  /**
   * attack
   */
  attack() {
    this.hasAttacked = true;
  }

  /**
   * end turn
   */
  endTurn() {
    super.endTurn();
    this.hasAttacked = false;
    this.hasChangedDisplay = false;
    this.hasChangedPose = false;
  }

  /**
   * take snapshot
   * @return {Object}
   */
  takeSnapshot() {
    let summonAction;

    if (this.lv < 5) {
      summonAction = action('summon', 'summon this monster to the field', Game.HAND, [
        param(Game.SLOT, Game.MONSTER_SLOTS, Game.SELF, 'select an empty slot in the monster slots to summon'),
        param(Game.DISPLAY, undefined, undefined, 'select the display of the monster'),
        param(Game.POSE, undefined, undefined, 'select the pose of the monster'),
      ]);
    } else if (this.lv < 7) {
      summonAction = action('summonTribute1', 'summon this monster to the field with one tribute', Game.HAND, [
        param(Game.CARD, Game.MONSTER_SLOTS, Game.SELF, 'select a monster to tribute'),
        param(Game.SLOT, Game.MONSTER_SLOTS, Game.SELF, 'select an empty slot in the monster slots to summon'),
        param(Game.DISPLAY, undefined, undefined, 'select the display of the monster'),
        param(Game.POSE, undefined, undefined, 'select the pose of the monster'),
      ]);
    } else {
      summonAction = action('summonTribute2', 'summon this monster to the field with two tribute', Game.HAND, [
        param(Game.CARD, Game.MONSTER_SLOTS, Game.SELF, 'select the first monster to tribute'),
        param(Game.CARD, Game.MONSTER_SLOTS, Game.SELF, 'select the second monster to tribute'),
        param(Game.SLOT, Game.MONSTER_SLOTS, Game.SELF, 'select an empty slot in the monster slots to summon'),
        param(Game.DISPLAY, undefined, undefined, 'select the display of the monster'),
        param(Game.POSE, undefined, undefined, 'select the pose of the monster'),
      ]);
    }

    return {
      ...super.takeSnapshot(),
      lv: this.lv,
      atk: this.atk,
      dfs: this.dfs,
      pose: this.pose,
      actions: [
        summonAction,
        action('changeDisplay', 'change the display of this monster', Game.MONSTER_SLOTS, [
          param(Game.DISPLAY, undefined, undefined, 'select the display of the monster'),
        ]),
        action('changePose', 'change the pose of this monster', Game.MONSTER_SLOTS, [
          param(Game.POSE, undefined, undefined, 'select the pose of the monster'),
        ]),
        action('attack', 'order this monster to attack', Game.MONSTER_SLOTS, [
          param(Game.CARD, Game.MONSTER_SLOTS, Game.OPPONENT, 'select the monster to attack'),
        ]),
        action('directAttack', 'order this monster to directly attack opponents', Game.MONSTER_SLOTS, [
          param(Game.PLAYER, undefined, undefined, 'select the opponent to attack'),
        ]),
      ],
    };
  }
}

module.exports = MonsterCard;
