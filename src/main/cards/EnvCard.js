import {Card} from './cards.js'

class EnvCard extends Card{
    
    /**
    *Consturctor for Super Class of Cards
    *A Env Card has:
    *@param {effect} effect an effect on the weather of the game
    */
    constructor(id,name,path,effect){
        //calls parent constructor
        super(id,name,path);
        //initialize own vars
        this.effect = effect;
    }   
}