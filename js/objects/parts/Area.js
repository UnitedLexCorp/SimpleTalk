/**
 * Area
 * ----------------------------------
 * I am a Area Part.
 * I represent a 'grouping' of subparts within
 * my owner part.
 * I contain the Layout properties set, and therefore
 * can display my contained subparts according to 
 * different layout properties than my ancestor
 * Card.
 *
 */
import {Part} from './Part.js';
import {
    addBasicStyleProps,
    addPositioningStyleProps,
    addLayoutStyleProps
} from '../utils/styleProperties.js';

class Area extends Part {
    constructor(...args){
        super(...args);

        this.acceptedSubpartTypes = [
            "area",
            "button",
            "field",
            "image",
            "drawing",
            "window"
        ];

        // Add style props
        addBasicStyleProps(this);
        addPositioningStyleProps(this);
        addLayoutStyleProps(this);

        // Set default width and height
        // for an empty area
        this.partProperties.setPropertyNamed(
            this,
            'width',
            50
        );
        this.partProperties.setPropertyNamed(
            this,
            'height',
            50
        );
        this.setupStyleProperties();
    }


    get type(){
        return 'area';
    }
};

export {
    Area,
    Area as default
};
