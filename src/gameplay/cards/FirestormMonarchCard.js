const MonsterCard = require('./MonsterCard');
const Card = require('./Card');
const Game = require('../Game');

/**
 * FirestormMonarch Card
 * @extends MonsterCard
 */
class FirestormMonarchCard extends MonsterCard {
  constructor() {
    super(FirestormMonarchCard.Name, FirestormMonarchCard.Desc, '/imgs/cards/FirestormMonarchCard.png', 6, 2400, 1000);
    this.hasInvoked = false;
  }

  /**
   * Check if can invoke
   * @return {Boolean}
   */
  canInvoke() {
    return !this.hasInvoked;
  }

  /**
   * invoke power
   * @param {Game} game
   * @param {Player} player
   * @param {Array<String>} invokeParams - an array of 4 numbers
   * 1st number is the player's index
   */
  invoke(game, player, invokeParams) {
    const targetPlayerId = invokeParams[0];
    const targetPlayer = game.findPlayer(targetPlayerId);

    const dropped = Math.floor(Math.random() * targetPlayer.hand.length);
    const droppedCard = targetPlayer.hand[dropped];
    targetPlayer.field.graveyard.push(targetPlayer.removeCardInHand(dropped));
    if (droppedCard.cardType === Card.MONSTER) {
      targetPlayer.life -= 100 * droppedCard.lv;
    }
    this.hasInvoked = true;
  }

  /**
   * Take snapshot
   * @return {Object}
   */
  takeSnapshot() {
    const shot = super.takeSnapshot();
    return {
      ...shot,
      actions: [
        ...shot.actions,
        {
          name: 'invokeMonsterEffect',
          desc: 'invoke the effects of this monster',
          stage: Game.MY_TURN,
          in: Game.MONSTER_SLOTS,
          params: [
            {select: Game.PLAYER, desc: 'select the opponent to apply the effects'},
          ],
        },
      ],
    };
  }
}

FirestormMonarchCard.Name = 'Firestorm Monarch';
FirestormMonarchCard.Desc = 'If this card is Tribute Summoned: Discard 1 random card from your opponents hand, then, if it was a Monster Card, inflict damage to your opponent equal to its original Level x 100.';
FirestormMonarchCard.Life = 100;

module.exports = FirestormMonarchCard;
