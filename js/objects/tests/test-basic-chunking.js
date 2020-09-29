/**
 * Basic Chunking Tests
 */
import {Chunk} from '../chunking.js';
import chai from 'chai';
const assert = chai.assert;

describe('Basic String Chunking', () => {
    describe('Basic Line Chunks', () => {
        let testString = `This is line 1\nThis is line 2\nThis is line 3`;
        let chunks;
        it('Strings should be able to chunk into lines', () => {
            let stringChunk = new Chunk(testString);
            assert.isTrue(stringChunk.canChunkInto('line'));
        });
        it('Example string line chunker should return three chunks', () => {
            let stringChunk = new Chunk(testString);
            chunks = stringChunk.chunkInto('line');
            assert.equal(chunks.length, 3);
        });
        it('Can #get the middle line of line chunks', () => {
            let stringChunk = new Chunk(testString);
            let middleLineChunk = stringChunk.get('line', 1);
            let expectedString = `This is line 2`;
            assert.equal(
                middleLineChunk.value,
                expectedString
            );
        });
        it('Attempting to #get outside bounds of chunks returns null', () => {
            let stringChunk = new Chunk(testString);
            let attempt = stringChunk.get('line', 5);
            assert.isNull(attempt);
        });
        it('Setting the second line of the example string returns expected string', () => {
            let stringChunk = new Chunk(testString);
            let expected = `This is line 1\nNEW INSERT HERE\nThis is line 3`;
            let result = stringChunk.set('line', 1, 'NEW INSERT HERE');
            assert.equal(result.value, expected);
        });
    });
    describe('Basic Word chunks', () => {
        let testString = `first second third fourth fifth`;
        let chunks;
        it('Should be able to chunk into words', () => {
            let stringChunk = new Chunk(testString);
            assert.isTrue(stringChunk.canChunkInto('word'));
        });
        it('Should produce 5 chunks when chunking example by word', () => {
            let stringChunk = new Chunk(testString);
            chunks = stringChunk.chunkInto('word');
            assert.equal(chunks.length, 5);
        });
        it('Can #get the third chunk', () => {
            let stringChunk = new Chunk(testString);
            let thirdWordChunk = stringChunk.get('word', 2);
            let expected = "third";
            assert.equal(
                thirdWordChunk.value,
                expected
            );
        });
        it('Returns null when attempting to get a word that is out of bounds', () => {
            let stringChunk = new Chunk(testString);
            let result = stringChunk.get('word', 9);
            assert.isNull(result);
        });
        it('Should return expected string when setting fourth word', () => {
            let stringChunk = new Chunk(testString);
            let expected = "first second third HELLO fifth";
            let result = stringChunk.set('word', 3, 'HELLO');
            assert.equal(result.value, expected);
        });
    });

    // Insert Character tests here

    describe('Complex Word-of-Line tests', () => {
        let testString = `Line 1 is dog\nLine 2 is cat\nLine 3 is gopher`;
        it('Should be able to get "cat" as fourth word of line 2', () => {
            let stringChunk = new Chunk(testString);
            let result = stringChunk.get('line', 1).get('word', 3);
            assert.equal(
                result.value,
                'cat'
            );
        });
        it('Should be able to set word 3 of line 3 to "eats"', () => {
            let stringChunk = new Chunk(testString);
            let expected = `Line 1 is dog\nLine 2 is cat\nLine 3 eats gopher`;
            let result = stringChunk.set(
                'line',
                2,
                stringChunk.get('line', 2).set('word', 2, 'eats').value
            );
            assert.equal(
                result.value,
                expected
            );
        });
    });
});
