/**
 * ValueHolder Superclass
 * ----------------------------------
 * I represent an object that has getters
 * and setters for 'value'.
 * I am meant to represent behavior from Hypercard equivalent
 * to 'containers,' which also hold and set values.
 * The intent is that all Part classes/subclasses should
 * implement the value getters and setters, using whatever
 * internal properties each Part specifies as its 'value'
 */
class ValueHolder {
    constructor(){

    }

    get value(){
        // Default implementation does nothing
        return undefined;
    }

    set value(aValue){
        // Default implementation does nothing
    }
};

export {
    ValueHolder,
    ValueHolder as default
};
