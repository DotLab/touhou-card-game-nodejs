const Card = require('./Card');

class SpellCard extends Card {
  constructor(name, desc, imgUrl) {
    super(name, desc, imgUrl);
  }

  canPlace() {
    return true;
  }

  place(display) {
    this.display = display;
  }

  // canActivate() {
  //   return false;
  // }

  canInvoke() {
    return true;
  }
}

module.exports = SpellCard;
