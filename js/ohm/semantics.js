/* I am dictionary that represent semantics actions
 * associated with the SimpleTalk grammar. For every
 * node-rule in the grammar I offer and action, or a
 * function that takes as it's argument the string values
 * at the corresponding node.
 */

// helpers
const quoteRemove = function(string){
    return string.slice(1, string.length-1);
}

let simpleTalkSemantics = {
    Script: function(scriptParts, _) {
        return scriptParts.parse();
    },

    _terminal: function() {
    },

    Command_answer: function(answer, stringLiteral){
        let msg = {
            type: "command",
            commandName: "answer",
            args: [
                stringLiteral.parse()
            ]
        };
        return msg;
    },

    Command_goToDirection: function(goToLiteral, nextPrevious, systemObject){
        let args = [];
        args.push(nextPrevious.sourceString);
        if (systemObject.sourceString){
            args.push(systemObject.sourceString);
        }

        let msg = {
            type: "command",
            commandName: "go to direction",
            args: args
        };
        return msg;
    },

    Command_goToByReference: function(goToLiteral, systemObject, objectId){
        let args = [];
        args.push(systemObject.sourceString);
        args.push(objectId.sourceString);

        let msg = {
            type: "command",
            commandName: "go to reference",
            args: args
        };
        return msg;
    },

    Command_deleteModel: function(deleteLiteral, thisLiteral, systemObject, objectId){
        let args = [];
        if (!objectId.sourceString){
            args.push(undefined);
        } else {
            args.push(objectId.sourceString);
        }
        args.push(systemObject.sourceString);

        let msg = {
            type: "command",
            commandName: "deleteModel",
            args: args
        };
        return msg;
    },

    Command_putVariable: function(putLiteral, value, intoLiteral, variableName){

        let args = [
            value.parse(),
            variableName.parse().name
        ];
        let msg = {
            type: "command",
            commandName: 'putInto',
            args
        };
        return msg;
        
    },

    Command_addModel: function(addLiteral, newObject, name, toLiteral, context, targetObjectType, targetObjectId){
        // TODO: a command like "add card to this stack 20" does not make sense, since you should either designate
        // the target by context "this" or by id. Here we should throw some sort of uniform error.
        let args = [];
        if(context.sourceString && targetObjectId.sourceString){
            throw "Semantic Error (Add model rule): only one of context or targetObjectId can be provided";
        }
        if(context.sourceString === "current" && !["card", "stack"].includes(targetObjectType.sourceString.toLowerCase())){
            throw "Semantic Error (Add model rule): context 'current' can only apply to 'card' or 'stack' models";
        }
        args.push(newObject.sourceString);
        args.push(targetObjectId.sourceString);
        args.push(targetObjectType.sourceString);
        args.push(context.sourceString);
        name = name.sourceString;
        // remove the string literal wrapping quotes
        if (name){
            name =name.slice(1, name.length - 1);
        }
        args.push(name);

        let msg = {
            type: "command",
            commandName: "newModel",
            args: args
        };
        return msg;
    },

    Command_setProperty: function(setLiteral, propertyName, toLiteral,  propertyValue, inLiteral, context, targetObjectType, targetObjectId){
        let args = [];
        if(context.sourceString && targetObjectId.sourceString){
            throw "Semantic Error (Set background rule): only one of context or targetObjectId can be provided";
        }
        if(context.sourceString === "current" && !["card", "stack"].includes(targetObjectType.sourceString.toLowerCase())){
            throw "Semantic Error (Set background rule): context 'current' can only apply to 'card' or 'stack' models";
        }
        // remove the quotes from string literals
        args.push(quoteRemove(propertyName.sourceString));
        args.push(quoteRemove(propertyValue.sourceString));
        args.push(targetObjectId.sourceString);
        args.push(targetObjectType.sourceString);
        args.push(context.sourceString);

        let msg = {
            type: "command",
            commandName: "setProperty",
            args: args
        };
        return msg;
    },

    command_arbitrary: function(name){
        let msg = {
            type: "command",
            commandName: name.sourceString,
            args: []
        };
        return msg;
    },

    MessageHandlerOpen: function(literalOn, messageName, parameterList, newLine){
        return [messageName.sourceString, parameterList];
    },

    MessageHandler: function(handlerOpen, statementList, handlerClose){
        let open = handlerOpen.parse();
        let handlerName = open[0];
        let paramList = open[1].parse();
        // let parsedParams = paramList.parse();
        // TODO: do we want messageHandler a la HT to be of type 'command'
        return ["command", handlerName, paramList, statementList.parse()[0]];
    },

    StatementList: function(list){
        return list.parse();
    },

    StatementLine: function(statement, newline){
        return statement.parse();
    },

    ParameterList: function(paramString){
        // TODO is the ohm way of doing this? or should we
        // walk the tree?
        return paramString.sourceString.split(",")[0];
    },

    stringLiteral: function(openQuote, text, closeQuote){
        return text.sourceString;
    },

    integerLiteral: function(negativeSign, integer){
        let int = parseInt(integer.sourceString);
        let hasNegative = (negativeSign.sourceString == "-");
        if(hasNegative){
            return -1 * int;
        }
        return int;
    },

    anyLiteral: function(theLiteral){
        return theLiteral.parse();
    },

    floatLiteral: function(negativeSign, onesPlace, decimal, restPlace){
        let floatString = `${onesPlace.sourceString}.${restPlace.sourceString}`;
        let hasNegative = (negativeSign.sourceString == "-");
        let result = parseFloat(floatString);
        if(hasNegative){
            return -1 * result;
        }
        return result;
    },

    variableName: function(text){
        let result = {
            isVariable: true,
            name: text.sourceString
        };
        return result;
    }
}

export {simpleTalkSemantics, simpleTalkSemantics as default}
