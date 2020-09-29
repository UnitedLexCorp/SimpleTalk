/**
 * Utilities for SimpleTalk Chunking
 */
const Chunk = function(value, getter=null, setter=null){
    this.value = value;
    if(getter){
        this.get = getter;
    }
    if(setter){
        this.set = setter;
    }
};

Chunk.prototype.canChunkInto = function(chunkName){
    if(!this.value.chunkers){
        return false;
    }
    return Object.keys(this.value.chunkers).includes(chunkName);
};

Chunk.prototype.chunkInto = function(chunkName){
    if(!this.canChunkInto(chunkName)){
        return null;
    }
    let chunker = this.value.chunkers[chunkName].chunk.bind(this.value);
    return chunker();
};

Chunk.prototype.combineFromChunks = function(chunkName, chunkArray){
    if(!this.canChunkInto(chunkName)){
        return null;
    }
    let combiner = this.value.chunkers[chunkName].combine.bind(this.value);
    return combiner(chunkArray);
};

Chunk.prototype.get = function(chunkName, index){
    let chunks = this.chunkInto(chunkName);
    if(!chunks){
        return null;
    }
    if(index >= chunks.length){
        return null;
    }
    return chunks[index];
};

Chunk.prototype.set = function(chunkName, index, newValue){
    let chunks = this.chunkInto(chunkName);
    if(!chunks){
        return null;
    }
    if(index >= chunks.length){
        return null;
    }
    let foundChunk = chunks[index];
    if(!foundChunk){
        return null;
    }
    foundChunk.value = newValue;
    return this.combineFromChunks(chunkName, chunks);
};

// Basic Array Implementation
Array.prototype.asChunk = function(){
    return new Chunk(this);
};
Array.prototype.chunkers = {
    item: {
        chunk: function(){
            return this.slice().map(item => {
                return new Chunk(item);
            });
        },
        combine: function(anArrayOfChunks){
            return anArrayOfChunks.map(chunk => {
                return chunk.value;
            });
        }
    }
};

// Basic String Implementation
String.prototype.asChunk = function(){
    return new Chunk(this);
};
String.prototype.chunkers = {
    // Chunking by line
    line: {
        chunk: function(){
            return this.split('\n').map(line => {
                return new Chunk(line);
            });
        },
        combine: function(anArrayOfLineChunks){
            return anArrayOfLineChunks.map(lineChunk => {
                return lineChunk.value;
            }).join("\n").asChunk();
        }
    },

    // Chunking by word
    word: {
        chunk: function(){
            return this.split(' ').map(word => {
                return new Chunk(word);
            });
        },
        combine: function(anArrayOfWordChunks){
            return anArrayOfWordChunks.map(wordChunk => {
                return wordChunk.value;
            }).join(' ').asChunk();
        }
    }
};

export {
    Chunk
};
