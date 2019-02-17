const SpellCard = require('./SpellCard');
const Card = require('../../../src/gameplay/cards/Card');
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
    actor.field.monsterSlots[actionParams[1]].display = Card.HIDDEN;
    actor.field.monsterSlots[actionParams[1]].pose = Card.DEFENSE;
    actor.field.monsterSlots[actionParams[1]].lockDisplay = true;
    actor.field.monsterSlots[actionParams[1]].lockPose = true;
    owner.field.graveyard.push(this);
    for (let i = 0; i < owner.field.spellSlots.length; i += 1) {
      if (owner.field.spellSlots[i] !== null && owner.field.spellSlots[i].Card === this) owner.field.spellSlots[i] = null;
    }
  }
}

FloodgateTrapHoleCard.Name = 'Floodgate Trap Hole';
FloodgateTrapHoleCard.Desc = 'When your opponent Summons a monster: Change that monster to face-down Defense Position. Monsters changed to face-down Defense Position by this effect cannot change their battle positions.';

module.exports = FloodgateTrapHoleCard;
