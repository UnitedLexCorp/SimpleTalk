import chai from 'chai';
const assert = chai.assert;
const expect = chai.expect;

let currentCardModel;
let buttonModel;

function compileButtonScript(aScript){
    let msg = {
        type: 'compile',
        codeString: aScript,
        targetId: buttonModel.id
    };
    window.System.compile(msg);
};

function sendButtonClick(){
    let clickMessage = {
        type: 'command',
        commandName: 'click',
        args: []
    };
    buttonModel.sendMessage(clickMessage, buttonModel);
};

function getLocalVar(obj, varName){
    return obj._executionContext.getLocal(varName);
};

describe.skip("Repeat Looping Tests", () => {
    describe("Model Setup", () => {
        it('Can find the current card model', () => {
            let currentCardView = document.querySelector('.current-stack > .current-card');
            currentCardModel = currentCardView.model;
            assert.exists(currentCardModel);
        });
        it('Can add a button to current card model without error', () => {
            let addButton = function(){
                let msg = {
                    type: 'command',
                    commandName: 'newModel',
                    args: [
                        'button',
                        currentCardModel.id,
                        'card'
                    ]
                };
                currentCardModel.sendMessage(msg, currentCardModel);
            };
            expect(addButton).to.not.throw(Error);
        });
        it('Can find newly created button model', () => {
            let button = currentCardModel.subparts.filter(subpart => {
                return subpart.type == 'button';
            })[0];
            buttonModel = button;
            assert.exists(buttonModel);
        });
    });

    describe("Repeat forNumTimes tests", () => {
            it("Can compile a basic script and loop correct num times", () => {
                let script = [
                    "on click",
                    "put 0 into myNum",
                    "repeat for 5 times",
                    "put (myNum + 1) into myNum",
                    "end repeat",
                    "end click"
                ].join("\n");
                compileButtonScript(script);
                sendButtonClick(script);
                let result = getLocalVar(buttonModel, "myNum");
                assert.equal(result, 5);
            });
            it("Can compile a script and loop num times based on variable", () => {
                let script = [
                    "on click",
                    "put 0 into myNum",
                    "put 3 into myCount",
                    "repeat for myCount times",
                    "put (myNum + 1) into myNum",
                    "end repeat",
                    "end click"
                ].join("\n");
                compileButtonScript(script);
                sendButtonClick(script);
                let result = getLocalVar(buttonModel, "myNum");
                assert.equal(result, 3);
            });
    });
    describe("Repeat untilCondition tests", () => {
        it("Can compile and loop until condition is met", () => {
            let script = [
                "on click",
                "\tput 5 into myLimit",
                "\tput 0 into myCount",
                "\trepeat until myLimit <= 0",
                "\tput (myCount + 1) into myCount",
                "\tput (myLimit - 1) into myLimit",
                "\tend repeat",
                "end click"
            ].join("\n");
            compileButtonScript(script);
            sendButtonClick(script);
            let resultLimit = getLocalVar(buttonModel, "myLimit");
            let resultCount = getLocalVar(buttonModel, "myCount");
            assert.equal(resultLimit, 0);
            assert.equal(resultCount, 5);
        });
    });

    describe("Repeat whileCondition tests", () => {
        it("Can compile and loop while condition is true", () => {
            let script = [
                "on click",
                "\tput 0 into myLimit",
                "\tput 0 into myCount",
                "\trepeat while myLimit < 6 ",
                "\tput (myCount + 1) into myCount",
                "\tput (myLimit + 1) into myLimit",
                "\tend repeat",
                "end click"
            ].join("\n");
            compileButtonScript(script);
            sendButtonClick(script);
            let resultLimit = getLocalVar(buttonModel, "myLimit");
            let resultCount = getLocalVar(buttonModel, "myCount");
            assert.equal(resultLimit, 6);
            assert.equal(resultCount, 6);
        });
    });

    describe("Repeat withStartFinish tests", () => {
        it("Can compile and run when range is valid", () => {
            let script = [
                "on click",
                "put 0 into myTotal",
                "put 0 into myCount",
                "repeat with realCount = 1 to 3",
                "put (realCount + myTotal) into myTotal",
                "put (myCount + 1) into myCount",
                "end repeat",
                "end click"
            ].join("\n");
            compileButtonScript(script);
            sendButtonClick();
            let resultTotal = getLocalVar(buttonModel, 'myTotal');
            let resultCount = getLocalVar(buttonModel, "myCount");
            assert.equal(resultCount, 3);
            assert.equal(resultTotal, 6);
        });
    });

    describe("Misc example tests", () => {
        it("Can exit repeat on if condition (until)", () => {
            let script = [
                "on click",
                "put 0 into Counter",
                "repeat until Counter == 5",
                "answer Counter",
                "put (Counter + 1) into Counter",
                "if Counter >= 3 then exit repeat",
                "end repeat",
                "end click"
            ].join("\n");
            compileButtonScript(script);
            sendButtonClick();
            let result = getLocalVar(buttonModel, 'Counter');
            assert.equal(result, 3);
        });

        it("Can exit repeat on if condition (forNumTimes)", () => {
            let script = [
                "on click",
                "put 0 into Counter",
                "repeat 5 times",
                "if Counter == 4 then exit repeat",
                "put (Counter + 1) into Counter",
                "end repeat",
                "end click"
            ].join("\n");
            compileButtonScript(script);
            sendButtonClick();
            let result = getLocalVar(buttonModel, 'Counter');
            assert.equal(result, 4);
        });

        it("Can exit repeat on if condition (while)", () => {
            let script = [
                "on click",
                "put 0 into Counter",
                "put 0 into timesItLooped",
                "repeat while Counter < 6",
                "put (Counter + 1) into Counter",
                "if Counter > 3 then exit repeat",
                "put (timesItLooped + 1) into timesItLooped",
                "end repeat",
                "end click"
            ].join("\n");
            compileButtonScript(script);
            sendButtonClick();
            let counter = getLocalVar(buttonModel, 'Counter');
            let timesItLooped = getLocalVar(buttonModel, 'timesItLooped');
            assert.equal(counter, 4);
            assert.equal(timesItLooped, 3);
        });

        it("Can exit repeat on if condition (withStartFinish)", () => {
            let script = [
                "on click",
                "put 0 into Counter",
                "repeat with realCount = 2 to 7",
                "if Counter > 2 then exit repeat",
                "put (Counter + 1) into Counter",
                "end repeat",
                "end click"
            ].join("\n");
            compileButtonScript(script);
            sendButtonClick();
            let counter = getLocalVar(buttonModel, 'Counter');
            let finalIndex = getLocalVar(buttonModel, 'realCount');
            assert.equal(counter, 3);
            assert.equal(finalIndex, 5);
        });

        it("Can next repeat on if condition (until)", () => {
            let script = [
                "on click",
                "put 0 into Counter",
                "put 0 into CounterMinusOne",
                "repeat until Counter == 5",
                "answer Counter",
                "put (Counter + 1) into Counter",
                "if Counter == 3 then next repeat",
                "put (CounterMinusOne + 1) into CounterMinusOne",
                "end repeat",
                "end click"
            ].join("\n");
            compileButtonScript(script);
            sendButtonClick();
            let result = getLocalVar(buttonModel, 'Counter');
            let backupResult = getLocalVar(buttonModel, 'CounterMinusOne');
            assert.equal(result, 5);
            assert.equal(backupResult, 4);
        });

        it("Can next repeat on if condition (forNumTimes)", () => {
            let script = [
                "on click",
                "put 0 into Counter",
                "repeat for 10 times",
                "if Counter > 3 then next repeat",
                "put (Counter + 1) into Counter",
                "end repeat",
                "end click"
            ].join("\n");
            compileButtonScript(script);
            sendButtonClick();
            let result = getLocalVar(buttonModel, 'Counter');
            assert.equal(result, 4);
        });

        it("Can next repeat on if condition (while)", () => {
            let script = [
                "on click",
                "put 0 into Counter",
                "put 0 into timesItLooped",
                "repeat while Counter < 6",
                "put (Counter + 1) into Counter",
                "if Counter == 3 then next repeat",
                "put (timesItLooped + 1) into timesItLooped",
                "end repeat",
                "end click"
            ].join("\n");
            compileButtonScript(script);
            sendButtonClick();
            let counter = getLocalVar(buttonModel, 'Counter');
            let timesItLooped = getLocalVar(buttonModel, 'timesItLooped');
            assert.equal(counter, 6);
            assert.equal(timesItLooped, 5);
        });

        it("Can next repeat on if condition (withStartFinish)" , () => {
            let script = [
                "on click",
                "put 0 into Counter",
                "repeat with realCount = 2 to 7",
                "if realCount == 4 then next repeat",
                "put (Counter + 1) into Counter",
                "end repeat",
                "end click"
            ].join("\n");
            compileButtonScript(script);
            sendButtonClick();
            let counter = getLocalVar(buttonModel, "Counter");
            assert.equal(counter, 4);
        });        
    });
});




