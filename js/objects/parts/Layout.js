/**
 * Layout
 * ----------------------------------
 * I am a "grouping" of Parts within a Card.
 * I have properties that specify the layout of
 * my subparts within my bounds visually.
 */
import Part from './Part.js';

class Layout extends Part {
    constructor(owner, name){
        super(owner, name);
    }

    get type(){
        return 'layout';
    }

    delegateMessage(aMessage){
        this.sendMessage(
            aMessage,
            this._owner
        );
    }
};

export {
    Layout,
    Layout as default
};