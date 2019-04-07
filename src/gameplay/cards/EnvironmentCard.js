const Card = require('./Card');

// TODO: kuo
class EnvironmentCard extends Card {
  constructor(name, desc, imgUrl) {
    super(name, desc, imgUrl);
  }

  canPlace() {
    return true;
  }

  place(display) {
    this.display = display;
  }
}

module.exports = EnvironmentCard;
