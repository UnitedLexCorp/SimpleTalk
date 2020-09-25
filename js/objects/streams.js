/**
 * Experimental Basic Stream Implementations
 */
class SimpleReadStream {
    constructor(collection){
        this.collection = collection;
        this.position = 0;

        // Bind methods
        this.next = this.next.bind(this);
        this.previous = this.previous.bind(this);
        this.peek = this.peek.bind(this);
        this.peekBack = this.peekBack.bind(this);
        this.upTo = this.upTo.bind(this);
        this.upToEnd = this.upToEnd.bind(this);
        this.atEnd = this.atEnd.bind(this);
    }

    next(){
        if(this.atEnd()){
            return null;
        }
        this.position += 1;
        return this.collection[this.position];
    }

    peek(){
        let peekPosition = this.position + 1;
        if(peekPosition >= this.collection.length){
            return null;
        }
        return this.collection[peekPosition];
    }

    previous(){
        if(this.position == 0){
            return null;
        }
        this.position -= 1;
        return this.collection[this.position];
    }

    peekBack(){
        let peekPosition = this.position - 1;
        if(peekPosition <= 0){
            return null;
        }
        return this.collection[peekPosition];
    }


    atEnd(){
        return (this.position == this.collection.length - 1);
    }

    upToEnd(){
        let result = [];
        while(!this.atEnd()){
            result.push(this.next());
        }
        return result;
    }

    upTo(anObject){
        let result = [];
        let nextObject = this.next();
        while(!anObject == nextObject && !this.atEnd()){
            result.push(nextObject);
            nextObject = this.next();
        }
    }
};


class SimpleWriteStream {
    constructor(collection){
        // If no collection has been provided,
        // we set it to be an empty array
        if(collection){
            this.collection = collection;
        } else {
            this.collection = [];
        }

        this.position = 0;

        // Bind methods
        this.nextPut = this.nextPut.bind(this);
        this.nextPutAll = this.nextPutAll.bind(this);
    }

    nextPut(anObject){
        let nextPos = this.position + 1;
        if(nextPos >= this.collection.length - 1){
            let diff = nextPos - (this.collection.length - 1);
            while(diff > 0){
                this.collection.push(null);
            }
            this.collection.push(anObject);
        } else {
            this.collection[nextPos] = anObject;
        }
        this.position += 1;
    }

    nextPutAll(aCollection){
        aCollection.forEach(item => {
            this.nextPut(item);
        });
    }
};

class SimpleReadWriteStream {
    constructor(collection){
        this.collection = collection;
        this._position = 0;
        this.readStream = new SimpleReadStream(this.collection);
        this.writeSteram = new SimpleWriteStream(this.collection);

        // Bind methods
        this.next = this.next.bind(this);
        this.nextPut = this.nextPut.bind(this);
        this.nextPutAll = this.nextPutAll.bind(this);
        this.peek = this.peek.bind(this);
        this.previous = this.previous.bind(this);
        this.peekBack = this.peekBack.bind(this);
        this.atEnd = this.atEnd.bind(this);
        this.upTo = this.upTo.bind(this);
        this.upToEnd = this.upToEnd.bind(this);
    }

    set position(anInteger){
        this.readStream.position = anInteger;
        this.writeStream.position = anInteger;
        this._position = anInteger;
    }

    get position(){
        return this._position;
    }

    next(){
        let result = this.readStream.next();
        this.position = this.readStream.position;
        return result;
    }

    nextPut(anObject){
        this.writeStream.nextPut(anObject);
        this.position = this.writeStream.position;
    }

    nextPutAll(aCollection){
        this.writeStream.nextPutAll(aCollection);
        this.position = this.writeStream.position;
    }

    previous(){
        let result = this.readStream.previous();
        this.position = this.readStream.position;
        return result;
    }

    peek(){
        return this.readStream.peek();
    }

    peekBack(){
        return this.readStream.peekBack();
    }

    atEnd(){
        return this.readStream.atEnd();
    }

    upTo(anObject){
        let result = this.readStream.upTo(anObject);
        this.position = this.readStream.position;
        return result;
    }

    upToEnd(){
        let result = this.readStream.upToEnd();
        this.position = this.readStream.position;
        return result;
    }
}

export {
    SimpleReadStream,
    SimpleWriteStream,
    SimpleReadWriteStream
};
