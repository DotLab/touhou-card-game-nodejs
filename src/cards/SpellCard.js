import {Card} from './cards.js'


class SpellCard extends Card{

    /**
    *Consturctor for Super Class of Cards
    *Each Spell Card has:
    *@param {Boolean} Revealed True if Revealed 
    *@param {effect} effect an effect object for this monster
    *@param {String} type is the spell card a "NM"-normal magic, "QM"-quick magic, "PM"-permanant magic, "T"-trap card, "PT"-permanant trap card
    */
    constructor(id,name,path,revealed,effect,type){
        //calls parent constructor
        super(id,name,path);
        //initialize own vars
        this.revealed = revealed;
        this.effect = effect;
        this.type = type;
    }   

    /*
    Activate the effect
    */
    activate(){
        this.effect.call();
    }
}