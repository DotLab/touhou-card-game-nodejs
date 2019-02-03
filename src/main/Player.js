/**
 * Player class
 */
class Player {
  /**
     * @constructor
     * @param {Card[]} deck randomly shuffled
     * @param {Number} hp
     * @param {Field} field
     */
  constructor(deck, hp, field) {
    this.deck = deck;
    this.hp = hp || 5000;
    this.hand = [];
    this.field = field;
    for (let i = 0; i < 5; i++) {
      this.hand.push(deck.pop());
    }
  }

  /**
     * draw a card from the desk
     * @return {undefined}
     */
  drawCard() {
    this.hand.push(this.deck.pop());
  }

  /**
     * discard a card from hand
     * @param {Number} n the index of catd to discard(0 based)
     * @return {undefined}
     */
  discardCard(n) {
    this.field.graveyard.push((this.hand.slice(n, 1)));
  }
}

module.exports = Player;
