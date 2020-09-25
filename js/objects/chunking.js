/**
 * Utilities for SimpleTalk Chunking
 */

/* JS String Chunking */
String.prototype.chunkers = {
    line: function(){
        return this.split("\n");
    },

    character: function(){
        let chars = [];
        for(let i = 0; i < this.length; i++){
            chars.push(
                this.charAt(i)
            );
        }
        return chars;
    }
};

String.prototype.chunkBy = function(aChunkType){
    if(!this.chunkers){
        return null;
    }
    if(!Object.keys(this.chunkers).includes(aChunkType)){
        return null;
    }

    return this.chunkers[aChunkType].bind(this)();
};

/* JS Array Chunking */
Array.prototype.chunkers = {
    item: function(){
        return this;
    }
};

Array.prototype.chunkBy = function(aChunkType){
    if(!this.chunkers){
        return null;
    }
    if(!Object.keys(this.chunkers).includes(aChunkType)){
        return null;
    }

    return this.chunkers[aChunkType].bind(this)();
};
