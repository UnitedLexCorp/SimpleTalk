/**
 * Part
 * -------------------------------
 * I represent the prototype object for all
 * SimpleTalk parts.
 */
import idMaker from '../utils/idMaker.js';
import {
    PartProperties,
    BasicProperty,
    DynamicProperty
} from '../properties/PartProperties.js';


class Part {
    constructor(anOwnerPart){

        // An array of child parts
        this.subparts = [];


        this.partProperties = new PartProperties();
        this._owner = anOwnerPart;
        this._commandHandlers = {};
        this._functionHandlers = {};
        this._propertySubscribers = new Set();

        this.isPart = true;

        // Bind methods
        this.setupProperties = this.setupProperties.bind(this);

        this.addPart = this.addPart.bind(this);
        this.removePart = this.removePart.bind(this);
        this.setCmdHandler = this.setCmdHandler.bind(this);
        this.setFuncHandler = this.setFuncHandler.bind(this);
        this.receiveCmd = this.receiveCmd.bind(this);
        this.receiveFunc = this.receiveFunc.bind(this);
        this.receiveMessage = this.receiveMessage.bind(this);
        this.delegateMessage = this.delegateMessage.bind(this);
        this.sendMessage = this.sendMessage.bind(this);
        this.addPropertySubscriber = this.addPropertySubscriber.bind(this);
        this.removePropertySubscriber = this.removePropertySubscriber.bind(this);
        this.serialize = this.serialize.bind(this);
        this.setFromDeserialized = this.setFromDeserialized.bind(this);

        // Finally, we finish initialization
        this.setupProperties();
    }

    // Convenience getter to get the id
    // from the partProperties
    get id(){
        return this.partProperties.getPropertyNamed(this, 'id');
    }

    // Configures the specific properties that the
    // given part can expect, along with any default
    // values.
    // Descendant Parts should override this method
    // in their own constructor after calling super,
    // so that they get the parent's general properties
    // too.
    setupProperties(){
        // Here, we set up properties common
        // to ALL Parts in the system.
        let basicProps = [
            new BasicProperty(
                'bottom',
                0
            ),
            new BasicProperty(
                'bottomRight',
                0
            ),
            new BasicProperty(
                'contents',
                null,
            ),
            new BasicProperty(
                'enabled',
                true
            ),
            new BasicProperty(
                'height',
                0
            ),
            new BasicProperty(
                'id',
                idMaker.new()
            ),
            new BasicProperty(
                'left',
                0
            ),
            new BasicProperty(
                'location',
                0,
                false,
                ['loc']
            ),
            new BasicProperty(
                'name',
                ''
            ),
            new BasicProperty(
                'rectangle',
                "0, 0, 0, 0",
                true,
                ['rect']
            ),
            new BasicProperty(
                'right',
                0
            ),
            new BasicProperty(
                'script',
                null // For now
            ),
            new BasicProperty(
                'top',
                0
            ),
            new BasicProperty(
                'topLeft',
                0
            ),
            new BasicProperty(
                'width',
                0
            )
        ];
        basicProps.forEach(prop => {
            this.partProperties.addProperty(prop);
        });

        this.partProperties.newDynamicProp(
            'number',
            null, // No setter; readOnly
            function(propOwner, propObject){
                return propOwner.subparts.indexOf(this);
            },
            true, // Is readOnly,
            [] // No aliases
        );
    }

    /** Subpart Access **/

    /**
     * Adds a part to this part's subparts
     * collection, if not already present.
     * It will also set the owner of the
     * added part to be this part.
     */
    addPart(aPart){
        let found = this.subparts.indexOf(aPart);
        if(found < 0){
            this.subparts.push(aPart);
            aPart._owner = this;
        }
    }

    /**
     * Removes the given part from this
     * part's list of subparts (if present).
     * It will also unset the owner of the
     * given part.
     */
    removePart(aPart){
        let partIndex = this.subparts.indexOf(aPart);
        if(partIndex >= 0){
            this.subparts.splice(partIndex, 1);
            aPart._owner = null;
        }
    }

    /** Logging and Reporting **/
    shouldBeImplemented(functionName){
        let msg = `${this.constructor.name} should implement ${functionName}`;
        throw new Error(msg);
    }

    /** Message Handling and Delegation **/
    delegateMessage(aMessage){
        return this.shouldBeImplemented('delegateMessage');
    }

    sendMessage(aMessage, target){
        if(!target || target == undefined){
            throw new Error('Messages must be sent with target receivers specified!');
        }
        target.receiveMessage(aMessage);
    }

    receiveMessage(aMessage){
        // By default, Parts will only handle
        // messages of type 'command' and 'function'
        switch(aMessage.type){
        case 'command':
            this.receiveCmd(aMessage);
            break;
        case 'function':
            this.receiveFunc(aMessage);
            break;
        }
    }

    receiveCmd(aMessage){
        let handler = this._commandHandlers[aMessage.commandName];

        if(handler){
            // If this Part has a handler for
            // the given command, we run it.
            // We also late-bind the current part
            // instance as the 'this' context for
            // the handler
            let boundHandler = handler.bind(this);
            boundHandler();
        } else {
            // Otherwise, we have no handler for
            // it, so we delegate along the
            // message delegation chain. It is up
            // to Parts to properly implement delegation
            // for themselves!
            this.delegateMessage(aMessage);
        }
    }

    receiveFunc(aMessage){
        let handler = this._functionHandlers[aMessage.functionName];

        if(handler){
            let boundHandler = handler.bind(this);
            boundHandler();
        } else {
            this.delegateMessage(aMessage);
        }
    }

    setCmdHandler(commandName, handler){
        this._commandHandlers[commandName] = handler;
    }

    setFuncHandler(funcName, handler){
        this._functionHandlers[funcName] = handler;
    }

    /** Property Subscribers
        ------------------------
        Objects added as property subscribers
        will be 'notified' whenever one of this
        Part's properties changes
    **/
    addPropertySubscriber(anObject){
        this._propertySubscribers.add(anObject);
    }

    removePropertySubscriber(anObject){
        this._propertySubscribers.delete(anObject);
    }

    propertyChanged(propertyName, newValue){
        let message = {
            type: 'propertyChanged',
            propertyName: propertyName,
            value: newValue,
            partId: this.id
        };
        this._propertySubscribers.forEach(subscriber => {
            this.sendMessage(message, subscriber);
        });
    }

    /**
     * Serialize this Part's state as JSON.
     * By default, we do not serialize specific
     * PartCollection information (recursively),
     * and only include basics including the current
     * state of all properties.
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
            let value = prop.getValue(this);
            result.properties[name] = value;
        });
        return JSON.stringify(result, null, 4);
    }

    /**
     * Set the properties and other
     * attributes of this Part model
     * from a deserialized JSON object.
     */
    setFromDeserialized(anObject){
        // First, set all writeable properties
        // to the incoming values
        let incomingProps = anObject.properties;
        Object.keys(incomingProps).forEach(propName => {
            let property = this.partProperties.getPropertyNamed(this, propName);
            if(!property){
                throw new Error(`Invalid deserialized property: ${propName}`);
            }
            if(!property.readOnly){
                // Last arg is false, which tells the property
                // not to notify its owner's subscribers of
                // property changes. We don't need that when
                // deserializing
                property.setValue(this, incomingProps[propName], false);
            }
        });

        // Next, set the id based on the
        // incoming value
        this.id = anObject.id;
    }
};

export {
    Part,
    Part as default
};