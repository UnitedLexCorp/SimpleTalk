/**
 * Utilities for SimpleTalk Chunking
 */

/* Helpers for Binding Chunker functions */
function chunkBy(aChunkName){
    if(!this.chunkers || this.chunkers == undefined){
        return null;
    }

    let chunker = this.chunkers[aChunkName];
    if(chunker){
        return chunker.getAll.bind(this)();
    }
    return null;
};

function chunkAt(aChunkName, anIndex){
    if(!this.chunkers || this.chunkers == undefined){
        return null;
    }

    let chunker = this.chunkers[aChunkName];
    if(chunker){
        return chunker.getAt.bind(this)(anIndex);
    }
    return null;
};

/* JS String Chunking */
String.prototype.chunkers = {};
String.prototype.chunkBy = chunkBy;
String.prototype.chunkAt = chunkAt;

// Lines
String.prototype.chunkers.line = {
    getAll: function(){
        return this.split("\n");
    },

    getAt(anIndex){
        let all = this.split("\n");
        if(anIndex >= all.length){
            return null;
        }
        return all[anIndex];
    },

    setAt(anIndex, aString){
        let all = this.split("\n");
        let diff = anIndex - this.length;
        if(diff >= 0){
            let extraNewlines = "";
            for(let i = 0; i < diff; i++){
                extraNewlines += "\n";
            }
            return `${this}${extraNewlines}${aString}`;
        }
        all[anIndex] = aString;
        return all.join("\n");
    }
};

// Words
String.prototype.chunkers.word = {
    getAll: function(){
        return this.split(" ");
    },

    getAt(anIndex){
        let all = this.split(" ");
        if(anIndex >= all.length){
            return null;
        }
        return all[anIndex];
    },

    setAt(anIndex, aString){
        let all = this.split(" ");
        let newSpaces = "";
        let diff = anIndex - all.length;
        if(diff >= 0){
            for(let i = 0; i < diff; i++){
                newSpaces += "\n";
            }
            return `${this}${newSpaces}${aString}`;
        }
        all[anIndex] = aString;
        return all.join("\n");
    }
};

// Characters
String.prototype.chunkers.character = {
    getAll: function(){
        let chars = [];
        for(let i = 0; i < this.length; i++){
            chars.push(this.charAt(i));
        }
        return chars;
    },

    getAt(anIndex){
        if(anIndex >= this.length){
            return null;
        }
        return this.charAt(anIndex);
    },

    setAt(anIndex, aCharacter){
        if(anIndex >= this.length){
            return null;
        }
        let all = [];
        for(let i = 0; i < this.length; i++){
            all.push(this.charAt(i));
        }
        all[anIndex] = aCharacter;
        return all.join("");
    }
};

/* JS Array Chunking */
Array.prototype.chunkers = {};
Array.prototype.chunkBy = chunkBy;
Array.prototype.chunkAt = chunkAt;

Array.prototype.chunkers.item = {
    getAll: function(){
        return this.slice();
    },

    getAt: function(anIndex){
        if(anIndex >= this.length){
            return null;
        }
        return this[anIndex];
    },

    setAt(anIndex, anObject){
        let all = this.slice();
        let diff = anIndex - all.length;
        if(diff >= 0){
            for(let i = 0; i < diff; i++){
                all.push(null);
            }
        }
        all.push(anObject);
        return all;
    }
};
