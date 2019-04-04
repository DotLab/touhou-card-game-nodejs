const MonsterCard = require('./MonsterCard');
const Card = require('./Card');
/**
 * FirestormMonarch Card
 * @extends MonsterCard
 */
class FirestormMonarchCard extends MonsterCard {
  constructor() {
    super(FirestormMonarchCard.Name, FirestormMonarchCard.Desc, '/imgs/DarkMagicianGirl.jpg', 6, 2400, 1000);
    this.hasInvoked = false;
  }

  canInvoke(game, player, invokeParams) {
    return !this.hasInvoked;
  }
  /**
   * invoke power
   * @param {object } game
   * @param {object} player
   * @param {array} invokeParams - an array of 4 numbers
   * 1st number is the first player's index
   * 2nd number is the first player's spell card index
   * 3rd number is the second player's index
   * 4th number is the second player's spell card index
   * set value to null if choose nothing
   */
  invoke(game, player, invokeParams) {
    const dropped = Math.floor(Math.random() * game.players[invokeParams[2]].hand.length);
    const droppedCard = game.players[invokeParams[2]].hand[dropped];
    game.players[invokeParams[2]].field.graveyard.push(game.players[invokeParams[2]].removeCardInHand(dropped));
    if ( droppedCard.cardType == Card.MONSTER) {
      game.players[invokeParams[2]].life -= FirestormMonarchCard.Life * droppedCard.lv;
    }
    this.hasInvoked = true;
  }
}

FirestormMonarchCard.Name = 'FirestormMonarchCard';
FirestormMonarchCard.Desc = 'If this card is Tribute Summoned: Discard 1 random card from your opponents hand, then, if it was a Monster Card, inflict damage to your opponent equal to its original Level x 100.';
FirestormMonarchCard.Life = 100;

module.exports = FirestormMonarchCard;
