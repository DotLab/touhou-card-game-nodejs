const MonsterCard = require('./MonsterCard');

const Game = require('../Game');

/**
 * ZaborgTheThunderMonarch Card
 * @extends MonsterCard
 */
class ZaborgTheThunderMonarchCard extends MonsterCard {
  constructor() {
    super(ZaborgTheThunderMonarchCard.Name, ZaborgTheThunderMonarchCard.Desc, ZaborgTheThunderMonarchCard.ImgUrl, 5, 2400, 1000);
    this.activated = false;
  }

  canInvoke(game, player, invokeParams) {
    return !this.activated;
  }

  /**
   * invoke power
   * @param {Game} game
   * @param {Player} player
   * @param {Array<String>} invokeParams
   * [0]: monsterId
   */
  invoke(game, player, invokeParams) {
    if (!invokeParams[0]) return;
    const monsterId = invokeParams[0];

    const target = game.findCardOwnerById(monsterId);
    target.field.killMonsterById(monsterId);
    this.activated = true;
  }

  takeSnapshot() {
    const shot = super.takeSnapshot();
    return {
      ...shot,
      actions: [
        ...shot.actions,
        {
          name: 'invokeMonsterEffect',
          desc: 'invoke the effects of this monster',
          in: Game.MONSTER_SLOTS,
          params: [
            {select: Game.CARD, in: Game.MONSTER_SLOTS, of: Game.OPPONENT, desc: 'select the target card'},
          ],
        },
      ],
    };
  }
}

ZaborgTheThunderMonarchCard.Name = 'Zaborg the Thunder Monarch';
ZaborgTheThunderMonarchCard.Desc = 'If this card is Tribute Summoned: Target 1 monster on the field; destroy that target.';
ZaborgTheThunderMonarchCard.ImgUrl = '/imgs/cards/ZaborgTheThunderMonarchCard.png';

module.exports = ZaborgTheThunderMonarchCard;
