/**
 * Tests for the 'is there a'command(s)
 */
ohm = require('ohm-js');
// Instantiate the grammar.
var fs = require('fs');
var g = ohm.grammar(fs.readFileSync('./js/ohm/simpletalk.ohm'));

var chai = require('chai');
var assert = chai.assert;

const matchTest = (str) => {
    const match = g.match(str);
    assert.isTrue(match.succeeded());
};
const semanticMatchTest = (str, semanticType) => {
    const typeMatch = g.match(str, semanticType);
    assert.isTrue(typeMatch.succeeded());
};
const semanticMatchFailTest = (str, semanticType) => {
    const typeMatch = g.match(str, semanticType);
    assert.isFalse(typeMatch.succeeded());
};

// Available system objects
const objects = [
    "background", "card", "area", "field", "button", "stack", "window",
    "toolbox", "drawing", "audio", "image"
];

describe("'is there a' ObjectSpecifier" , () => {
    it ("Basic (current card)", () => {
        objects.forEach((d) => {
            const s = `is there a current card`;
            semanticMatchTest(s, "Conditional");
            semanticMatchTest(s, "IsThereAnObjectConditional");
        });
    });
    it ("Basic (wth id)", () => {
        objects.forEach((d) => {
            const s = `is there a card 20`;
            semanticMatchTest(s, "Conditional");
            semanticMatchTest(s, "IsThereAnObjectConditional");
        });
    });
    it ("By name of current stack", () => {
        objects.forEach((d) => {
            const s = `is there a card "NewCard" of current stack`;
            semanticMatchTest(s, "Conditional");
            semanticMatchTest(s, "IsThereAnObjectConditional");
        });
    });
    it ("Basic (with name, wth id)", () => {
        objects.forEach((d) => {
            const s = `is there a ${d} "newPart 123" of card 20`;
            semanticMatchTest(s, "Conditional");
            semanticMatchTest(s, "IsThereAnObjectConditional");
        });
    });
    it ("'Of this'", () => {
        objects.forEach((d) => {
            const s = `is there a  ${d} "newPart 123" of this stack`;
            semanticMatchTest(s, "Conditional");
            semanticMatchTest(s, "IsThereAnObjectConditional");
        });
    });
    it ("Named of 'current'", () => {
        objects.forEach((d) => {
            const s = `is there a ${d} "newPart123" of current stack`;
            semanticMatchTest(s, "Conditional");
            semanticMatchTest(s, "IsThereAnObjectConditional");
        });
    });
    it("no target or context (should fail)", () => {
        objects.forEach((d) => {
            const s = `is there a ${d}`;
            semanticMatchFailTest(s, "Conditional");
            semanticMatchFailTest(s, "IsThereAnObjectConditional");
        });
    });
    it("Named without context", () => {
        objects.forEach((d) => {
            const s = `is there a ${d} "newPart123"`;
            semanticMatchTest(s, "Conditional");
            semanticMatchTest(s, "IsThereAnObjectConditional");
        });
    });
});
