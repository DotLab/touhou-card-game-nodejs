const Card = require('./Card');
const Game = require('../Game');

const action = Card.createAction;

/**
 * Environment Card
 */
class EnvironmentCard extends Card {
  /**
   * @constructor
   * @param {string} name name of the environment card
   * @param {string} desc description of the card
   * @param {string} imgUrl imageUrl of the card
   */
  constructor(name, desc, imgUrl) {
    super(name, desc, imgUrl);
  }

  /**
   * set the display of environment card
   * @param {string} display
   */
  place(display) {
    this.display = display;
  }

  /**
   * take snapshot
   * @return {Object} the snapshot of the game
   */
  takeSnapshot() {
    return {
      ...super.takeSnapshot(),
      actions: [
        action('applyEnvironment', 'apply this environment to the field', Game.HAND, []),
      ],
    };
  }
}

module.exports = EnvironmentCard;
