/**
 * Field
 * -----------------------------------------
 * I am a Field Part.
 * I am a container that holds text. I also allow
 * a user to edit my text.
 */
import Part from './Part.js';
import {
    BasicProperty,
    DynamicProperty
} from '../properties/PartProperties.js';

class Field extends Part {
    constructor(owner, name){
        super(owner);

        this.acceptedSubpartTypes = ["field"];

        this.isField = true;

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
            'mode',
            'editing' //TODO this should be either "bravo" or "simpletalk"
        );

        this.partProperties.newBasicProp(
            'htmlContent',
            ''
        );
        this.partProperties.newBasicProp(
            'textContent',
            ''
        );
        // TODO this should replace mode
        this.partProperties.newBasicProp(
            'lockText',
            false
        );
        // A number of the props deal with direct text editing,
        // and so they are like commands. Examples include "undo"
        // "redo" "clear" etc. Here we use dynami props which the
        // view can respond to accordingly, but having these props have
        // no actual 'state'
        this.partProperties.newDynamicProp(
            "undo",
            () => {}, // all we is a notification
            () => {} // no getter
        );
        this.partProperties.newDynamicProp(
            "redo",
            () => {}, // all we is a notification
            () => {} // no getter
        );
        this.partProperties.newDynamicProp(
            "remove-format",
            () => {}, // all we is a notification
            () => {} // no getter
        );

        // Styling
        // setting width and height to null
        // effectively forces to the default size
        // of the button to fit the button name
        this.partProperties.newStyleProp(
            'width',
            null,
        );
        this.partProperties.newStyleProp(
            'height',
            null,
        );
        this.partProperties.newStyleProp(
            'top',
            "0",
        );
        this.partProperties.newStyleProp(
            'left',
            "0",
        );
        this.partProperties.newStyleProp(
            'rotate',
            null
        );
        this.partProperties.newStyleProp(
            'hide',
            false,
        );
        this.partProperties.newStyleProp(
            'transparency',
            1.0,
        );
        this.partProperties.newStyleProp(
            'text-transparency',
            1.0,
        );
        this.partProperties.newStyleProp(
            'text-font',
            'default',
        );
        this.partProperties.newStyleProp(
            'text-bold',
            false,
        );
        this.partProperties.newStyleProp(
            'text-italic',
            false,
        );
        this.partProperties.newStyleProp(
            'text-size',
            'default',
        );
        this.partProperties.newStyleProp(
            'text-underline',
            false,
        );
        this.partProperties.newStyleProp(
            'text-align',
            "left",
        );
        this.partProperties.newStyleProp(
            'background-color',
            "rgb(255, 248, 220, 1)", // var(--palette-cornsik)
        );
        this.partProperties.newStyleProp(
            'background-transparency',
            1.0,
        );
        this.partProperties.newStyleProp(
            'text-color',
            "rgba(0, 0, 0, 1)",
        );
        this.setupStyleProperties();
    }

    /**
     * Serialize this Field's state as JSON.
     * We override the default Part.js
     * implementation so that the textContent
     * property is not saved. This prevents it
     * from being set (rather than htmlContent)
     * on deserialization
     */
    serialize(){
        let ownerId = null;
        if(this._owner){
            ownerId = this._owner.id;
        }
        let result = {
            type: this.type,
            id: this.id,
            properties: {},
            subparts: this.subparts.map(subpart => {
                return subpart.id;
            }),
            ownerId: ownerId
        };
        this.partProperties._properties.forEach(prop => {
            let name = prop.name;
            if(name !== 'textContent'){
                let value = prop.getValue(this);
                // If this is the events set, transform
                // it to an Array first (for serialization)
                if(name == 'events'){
                    value = Array.from(value);
                }
                result.properties[name] = value;
            }
        });
        return result;
    }

    get type(){
        return 'field';
    }
};

export {
    Field,
    Field as default
};
