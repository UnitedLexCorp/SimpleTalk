/**
 * Field
 * -----------------------------------------
 * I am a Field Part.
 * I am a container that holds text. I also allow
 * a user to edit my text.
 */
import Part from './Part';
import {
    BasicProperty,
    DynamicProperty
} from '../properties/PartProperties';

class Field extends Part {
    constructor(owner, name){
        super(owner);
        if(name){
            this.partProperties.setPropertyNamed(
                this,
                'name',
                name
            );
        }

        // Set the Field-specific
        // Part Properties
        this.partProperties.newBasicProp(
            'autoSelect',
            false,
        );
        this.partProperties.newBasicProp(
            'autoTab',
            false
        );
        this.partProperties.newBasicProp(
            'lockText',
            false
        );
        this.partProperties.newBasicProp(
            'showLines',
            false
        );
        this.partProperties.newBasicProp(
            'dontWrap',
            false
        );
        this.partProperties.newBasicProp(
            'multipleLines',
            false
        );
        this.partProperties.newBasicProp(
            'scroll',
            0
        );
        this.partProperties.newBasicProp(
            'sharedText',
            false
        );
        this.partProperties.newBasicProp(
            'wideMargins',
            false
        );
    }
};

export {
    Field,
    Field as default
};
