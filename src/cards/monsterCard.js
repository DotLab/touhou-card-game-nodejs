import {Card} from './cards.js'

class MonsterCard extends Card{
    /**
    *Consturctor for Super Class of Cards
    *Each Monster Card has:
    *@param {Boolean} Revealed True if Revealed 
    *@param {String} Mode "ATT" for attack mode and "DEF" for defense mode 
    *@param {number} Level monster's level
    *@param {number} ATT Attack
    *@param {number} DEF Defense
    *@param {effect} effect an effect object for this monster
    */
    constructor(id,name,path,revealed,mode,level,att,def,effect){
        //calls parent constructor
        super(id,name,path);
        //initialize own vars
        this.revealed = revealed;
        this.mode = mode;
        this.level = level;
        this.att = att;
        this.def = def;
        this.effect = effect;
    }

    /** 
    *Attack function when exists monster
    *@param {MonsterCard} target Targeted monster to attack
    *@returns {int} difference where difference  = this.att - target.att (att mode) or this.def - target.def (def mode) when difference > 0, 
    *the opponent receives dmg else, the attacker receives dmg
    */
    attack(target){
       var difference; 
        //if target is not revealed then it is in def mode
       if(target.revealed == false){
           difference = this.att - target.def;
       }
       //if target in def mode:
       if(target.mode == "DEF"){
            difference = this.att - target.def;
       }
       //if target in att mode:
       if(target.mode == "ATT"){
           difference = this.att - target.att;
       }
       return difference;
   }

   /** 
   *Attack when no monster on opponent's field
   *The dmg incurs is the ATT of this monster
   *@returns the damage inccurs
   */
   attackDirectly(){
       return this.att;
   }
   
   /** 
   *if not revealed, flips the the card
   *Throws Exception if card is already revealed
   */
   flip(){
       if(this.revealed == true){
           throw("Card is Already Revealed");
       }
       this.revealed == true;
   }

   /**
    * Use the effect
    */
   useEffect(){
       this.effect.use();
   }

}