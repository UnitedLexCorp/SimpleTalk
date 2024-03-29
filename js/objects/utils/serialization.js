/**
 * Serialization and Deserialization Utility Classes
 */
import idMaker from './id.js';

const version = "0.0.1";

class STDeserializer {
    constructor(aSystem){
        this.system = aSystem;

        // These caches are used during the process
        // as optimizations
        this._modelCache = {};
        this._subpartMapCache = {};
        this._idCache = {};
        this._instanceCache = [];
        this._propsCache = {};
        this._viewsCache = {};
        this._scriptCache = {};
        this._rootsCache = [];

        // The targetId is the id of
        // the Part that we wish to append any
        // deserialized subpart tree into.
        // By default we assume the whole system,
        // ie full deserialization.
        this.targetId = 'system';

        // By default, we create new IDs for each
        // deserialized Part (and preserve a mapping
        // from old to new temporarily).
        // However, there are cases, like initialLoad,
        // where we want to preserve the originals.
        // That flag is set here.
        this.useOriginalIds = false;

        // Bound methods
        this.deserialize = this.deserialize.bind(this);
        this.deserializeData = this.deserializeData.bind(this);
        this.deserializePart = this.deserializePart.bind(this);
        this.attachSubparts = this.attachSubparts.bind(this);
        this.setProperties = this.setProperties.bind(this);
        this.createView = this.createView.bind(this);
        this.attachView = this.attachView.bind(this);
        this.setViewModel = this.setViewModel.bind(this);
        this.compilePartScript = this.compilePartScript.bind(this);
        this.refreshWorld = this.refreshWorld.bind(this);
        this.appendWorld = this.appendWorld.bind(this);
        this.addPartsToSystem = this.addPartsToSystem.bind(this);
        this.compileScripts = this.compileScripts.bind(this);
        this.getFlattenedPartTree = this.getFlattenedPartTree.bind(this);
        this.getModelClass = this.getModelClass.bind(this);
        this.handleId = this.handleId.bind(this);
        this.throwError = this.throwError.bind(this);
        this.flushCaches = this.flushCaches.bind(this);
        this.dispatchViewAdded = this.dispatchViewAdded.bind(this);
    }

    deserialize(aJSONString){
        this.data = JSON.parse(aJSONString);
        let target = this.system.partsById[this.targetId];
        return this.deserializeData()
            .then(() => {
                // Add all deserialized Parts to the System dict,
                // including the new World.
                this.addPartsToSystem(this._instanceCache);
            })
            .then(() => {
                // Compile the scripts on *all* deserialized
                // parts
                this.compileScripts(this._instanceCache);
            })
            .then(() => {
                // Insert the root Part into whatever
                // target it should go into.
                let rootPart = this.rootParts[0];
                let rootView = this.rootViews[0];
                if(this.targetId == 'system'){
                    this.refreshWorld();
                } else {
                    target.addPart(rootPart);
                }
                
                // Finally, append the PartView root node
                // where it should go in the view tree.
                if(this.targetId == 'system'){
                    this.appendWorld();
                } else {
                    let targetView = document.querySelector(`[part-id="${this.targetId}"]`);
                    targetView.appendChild(rootView);
                    this.dispatchViewAdded(rootView);
                }
                return this;
            });
    }

    deserializeData(){
        return new Promise((resolve, reject) => {
            this.flushCaches();
            // First, we ensure that the target we
            // should be deserializing into actually exists
            let target = this.system.partsById[this.targetId];
            if(!target && this.targetId != 'system'){
                this.throwError(`Target id ${this.targetId} does not exist in System`);
            }

            // Second, we create instances of all models in the serialization
            // but we do not yet attach their subparts.
            Object.values(this.data.parts).forEach(partData => {
                this.deserializePart(Object.assign({}, partData));
            });

            // Third, we go through each created Part instance
            // and add any subparts to it. Note that this is not
            // recursive
            this._instanceCache.forEach(partInstance => {
                this.attachSubparts(partInstance);
            });

            // Fourth, we create all the appropriate PartViews
            // needed by the tree of deserialized parts.
            this._instanceCache.forEach(partInstance => {
                this.createView(partInstance);
            });

            // Fifth, we attach view elements in the tree
            // to their mapped parent elements. Note that
            // we do not yet attach the root view to anything
            // in the actual DOM.
            this._instanceCache.forEach(partInstance => {
                this.attachView(partInstance);
            });
            
            // Sixth, we set all properties on each created
            // Part model from the deserialized data.
            // We do this using a visitor method on the instances
            // themselves.
            // This gives the in-memory views the ability to
            // react to any initial changes to their models.
            this._instanceCache.forEach(partInstance => {
                this.setProperties(partInstance);
                this.setViewModel(partInstance);
            });

            // We determine which of the instances is a "root",
            // meaning that it has, at this point, no owner in
            // the deserialized data. There can be multiple roots
            // (and therefore multiple trees) in a single deserialization
            this._rootsCache = this._instanceCache.filter(instance => {
                return instance._owner == null || instance._owner == undefined;
            });

            // If we are using the original IDs, we need
            // to reset the idMaker to be the max of
            // the current crop of IDs
            if(this.useOriginalIds){
                let allIds = this._instanceCache.map(inst => {
                    return parseInt(inst.id);
                }).filter(id => {
                    return !isNaN(id) && id !== null;
                });
                idMaker.count = Math.max(...allIds);
            }

            // Insertion should be handled by composed
            // promises elsewhere (see imports and deserialize()
            // for examples)
            

            return resolve(this);
        });
    }

    importFromSerialization(aJSONString, filterFunction){
        this.data = JSON.parse(aJSONString);
        let target = this.system.partsById[this.targetId];
        let targetView = document.querySelector(`[part-id="${this.targetId}"]`);
        return this.deserializeData()
            .then(() => {
                // The caller will provide a filter function over
                // all deserialized part instances, returning only
                // those that should be inserted into the target.
                // For example, all Stacks in the WorldStack.
                return this._instanceCache.filter(filterFunction);
            })
            .then((rootParts) => {
                rootParts.forEach(rootPart => {
                    let allTreeParts = this.getFlattenedPartTree(rootPart);
                    this.addPartsToSystem(allTreeParts);
                });
                return rootParts;
                
            })
            .then((rootParts) => {
                rootParts.forEach(rootPart => {
                    let allTreeParts = this.getFlattenedPartTree(rootPart);
                    this.compileScripts(allTreeParts);
                });
                return rootParts;
            })
            .then((rootParts) => {
                rootParts.forEach(rootPart => {
                    let view = this._viewsCache[rootPart.id];
                    target.addPart(rootPart);
                    targetView.appendChild(view);
                    this.dispatchViewAdded(view);
                });
            });
    }

    deserializePart(partData){
        let partClass = this.getModelClass(partData.type);
        let instance = new partClass();

        // We create a new ID for this part, since we cannot
        // guarantee ID clashes with the existing System.
        // Exception is if the useOriginalids flag is set,
        // such as at load time
        let {newId, oldId} = this.handleId(instance, partData);
        instance.id = newId;

        // Add to our caches and also to the System
        this._idCache[oldId] = newId;
        this._scriptCache[newId] = partData.properties.script;
        this._propsCache[newId] = partData.properties;
        this._modelCache[newId] = instance;
        this._subpartMapCache[newId] = partData.subparts;
        this._instanceCache.push(instance);
    }

    handleId(aPart, partData){
        let newId, oldId;
        if(this.useOriginalIds){
            return {
                newId: partData.id,
                oldId: partData.id
            };
        } else {
            oldId = partData.id;
            newId = aPart.id;
            if(aPart.type !== 'world'){
                newId = idMaker.new();
            }
            return {
                newId,
                oldId
            };
        }
        
    }

    addPartsToSystem(aListOfParts){
        aListOfParts.forEach(part => {
            this.system.partsById[part.id] = part;
        });
    }

    compileScripts(aListOfParts){
        aListOfParts.forEach(part => {
            this.compilePartScript(part);
        });
    }

    attachSubparts(aPart){
        // At this point, the _subpartMapCache should
        // have an entry mapping from this aPart's (new)
        // id to an array of ids of also-initialized
        // subpart models
        let subpartIds = this._subpartMapCache[aPart.id];
        subpartIds.forEach(subpartId => {
            let newId = this._idCache[subpartId];
            let subpartModel = this._modelCache[newId];
            if(!subpartModel){
                debugger;
            }
            aPart.addPart(subpartModel);
        });
    }

    setProperties(aPart){
        let props = this._propsCache[aPart.id];
        delete props['id'];
        aPart.setPropsFromDeserializer(props, this);
    }

    createView(aPart){
        let newView = document.createElement(
            this.system.tagNameForViewNamed(aPart.type)
        );
        this._viewsCache[aPart.id] = newView;
    }

    setViewModel(aPart){
        let view = this._viewsCache[aPart.id];
        view.setModel(aPart);
    }
    
    attachView(aPart){
        let owner = aPart._owner;
        if(owner){
            let ownerView = this._viewsCache[owner.id];
            let partView = this._viewsCache[aPart.id];
            ownerView.appendChild(partView);
        }
    }

    compilePartScript(aPart){
        let scriptString = this._scriptCache[aPart.id];
        if(scriptString && scriptString != ""){
            this.system.compile({
                type: 'compile',
                targetId: aPart.id,
                codeString: scriptString,
                serialize: false
            });
        }
    }

    refreshWorld(){
        // We assume a single root part was deserialized and
        // attach it as the World accordingly
        let newWorld = this.rootParts[0];
        if(newWorld.type !== 'world'){
            this.throwError(`Found ${this.rootParts.length} roots, but no world!`);
        }
        this.system.partsById['world'] = this.rootParts[0];
    }

    appendWorld(){
        // We assume a single root view that is an st-world.
        let found = document.querySelector('st-world');
        if(found){
            document.body.replaceChild(this.rootViews[0], found);
        } else {
            document.body.prepend(this.rootViews[0]);
        }
        this.dispatchViewAdded(document.querySelector('st-world'));
    }

    getFlattenedPartTree(aPart, list=[]){
        list.push(aPart);
        aPart.subparts.forEach(subpart => {
            this.getFlattenedPartTree(subpart, list);
        });
        return list;
    }

    throwError(message){
        throw new Error(`Deserialization Error: ${message}`);
    }

    getModelClass(aPartTypeStr){
        let cls = this.system.availableParts[aPartTypeStr];
        if(!cls){
            this.throwError(`Part type "${aPartTypeStr}" does not exist in system`);
        }
        return cls;
    }

    flushCaches(){
        this._modelCache = {};
        this._subpartMapCache = {};
        this._idCache = {};
        this._instanceCache = [];
        this._propsCache = {};
        this._viewsCache = {};
        this._scriptCache = {};
        this._rootsCache = [];
    }

    dispatchViewAdded(aView){
        let event = new CustomEvent('st-view-added', {
            detail: {
                partType: aView.model.type,
                partId: aView.model.id,
                //ownerId: aView.model._owner.id || null
            } 
        });
        aView.parentElement.dispatchEvent(event);
    }

    get rootParts(){
        return this._rootsCache;
    }

    get rootViews(){
        return this.rootParts.map(part => {
            return this._viewsCache[part.id];
        });
    }
}


class STSerializer {
    constructor(aSystem){
        this.system = aSystem;
        this._objectCache = {};

        // Bound methods
        this.serializePart = this.serializePart.bind(this);
        this.flushCaches = this.flushCaches.bind(this);
    }

    serialize(aRootPart, pretty=true){
        this.flushCaches();
        let result = {
            version: version,
            rootId: aRootPart.id,
            type: aRootPart.type,
            id: aRootPart.id
        };

        // Recursively serialize Parts and
        // store in flat list
        this.serializePart(aRootPart);

        // We set the result objects parts
        // dict to be the same as the cache
        result.parts = this._objectCache;

        // Finally, we convert to a string and
        // return
        if(pretty){
            return JSON.stringify(result, null, 4);
        } else {
            return JSON.stringify(result);
        }
    }

    serializePart(aPart){
        // We use the serialize method available on
        // base Parts, passing in this serializer instance
        // as the sole arg
        this._objectCache[aPart.id] = aPart.serialize(this);
        aPart.subparts.forEach(subpart => {
            this.serializePart(subpart);
        });
    }

    flushCaches(){
        this._objectCache = {};
    }
}

export {
    STSerializer,
    STDeserializer
};
