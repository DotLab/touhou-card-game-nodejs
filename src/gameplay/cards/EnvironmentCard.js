const Card = require('./Card');

class EnvironmentCard extends Card {
  constructor(name, desc, imgUrl) {
    super(name, desc, imgUrl);
  }

  /**
   * environment card can be placed without restrictions
   * @return {boolean}
   */
  canPlace() {
    return true;
  }

  /**
   * set the display of environment card
   * @param {string} display
   */
  place(display) {
    this.display = display;
  }
}

module.exports = EnvironmentCard;
