class Card{
    /** 
    * Consturctor for Super Class of Cards
    * Each Card has:
    * @param {String} ID: for backend database access
    * @param {String} Name: Each Card has its own name
    * @param {String} Path: Path to img of the card
    */
    constructor(id,name,path){
        this.id = id;
        this.name = name; 
        this.path = path;
    }
}