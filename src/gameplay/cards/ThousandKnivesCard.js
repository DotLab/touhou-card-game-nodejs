const SpellCard = require('./SpellCard');
const DarkMagicianCard = require('./DarkMagicianCard');
class ThousandKnivesCard extends SpellCard {
  constructor() {
    super(ThousandKnivesCard.Name, ThousandKnivesCard.Desc, ThousandKnivesCard.ImgUrl);
  }
  canInvoke(game, player, invokeParams) {
    if (game.players[game.playerIndexById[invokeParams[0]]].field.monsterSlots[invokeParams[1]] === null) return false;
    for (let i = 0; i < player.field.monsterSlots.length; i += 1) {
      if (player.field.monsterSlots[i] !== null && player.field.monsterSlots[i].name === DarkMagicianCard.Name) return true;
    }
    return false;
  }

  // invokeParams: [opponentId, opponent's monsterSLot index]
  invoke(game, player, invokeParams) {
    const target = game.players[game.playerIndexById[invokeParams[0]]];
    // push this to graveyard
    for (let i = 0; i < player.field.spellSlots.length; i += 1) {
      if (player.field.spellSlots[i] !== null && player.field.spellSlots[i] === this) {
        player.field.graveyard.push(this);
        player.field.spellSlots[i] = null;
      }
    }
    target.field.graveyard.push(target.field.monsterSlots[invokeParams[1]]);
    target.field.monsterSlots[invokeParams[1]] = null;
  }
}

ThousandKnivesCard.Name = 'Thousand Knives';
ThousandKnivesCard.Desc = 'If you control "Dark Magician": Target 1 monster your opponent controls; destroy that target.';
ThousandKnivesCard.ImgUrl = '/Imgs/ThousandKnives.jpg';
module.exports = ThousandKnivesCard;
