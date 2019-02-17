const SpellCard = require('./SpellCard');
const Game = require('../Game');

class FloodgateTrapHoleCard extends SpellCard {
  constructor() {
    super(FloodgateTrapHoleCard.Name, FloodgateTrapHoleCard.Desc, FloodgateTrapHoleCard.ImgUrl);

    this.targetMonster = null;
  }

  canActivate(game, owner, actor, action, actionParams, phase) {
    if (this.targetMonster !== null) return false;

    if (action === Game.SUMMON && phase === Game.AFTER) {
      return true;
    }

    return false;
  }

  activate(game, owner, actor, action, actionParams) {

  }
}

FloodgateTrapHoleCard.Name = 'Floodgate Trap Hole';
FloodgateTrapHoleCard.Desc = 'When your opponent Summons a monster: Change that monster to face-down Defense Position. Monsters changed to face-down Defense Position by this effect cannot change their battle positions.';

module.exports = FloodgateTrapHoleCard;
