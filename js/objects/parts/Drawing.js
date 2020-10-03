/**
 * Basic User Drawing Part
 */
import {Part} from './Part.js';

class Drawing extends Part {
    constructor(owner){
        super(owner);

        this.partProperties.newBasicProp(
            'image',
            null
        );
    }

    get type(){
        return 'drawing';
    }
};

export {
    Drawing,
    Drawing as default
};