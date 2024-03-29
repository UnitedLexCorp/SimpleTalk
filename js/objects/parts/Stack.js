/**
 * Stack
 * ----------------------------
 * I am the Stack Part.
 * I represent a collection of Card parts,
 * along with some extra configurability.
 */
import Part from './Part.js';
import Card from './Card.js';
import {
    BasicProperty
} from '../properties/PartProperties.js';

class Stack extends Part {
    constructor(owner, name, deserializing=false){
        super(owner);
        this.acceptedSubpartTypes = ["card", "window", "button", "area", "field", "drawing", "image", "audio"];

        // Set up Stack specific
        // PartProperties
        this.partProperties.newBasicProp(
            'cantPeek',
            false
        );
        this.partProperties.newBasicProp(
            'resizable',
            false
        );


        // Will hold the card-based index,
        // which here is zero-indexed, of the
        // card that is the current card for this
        // Stack.
        this.partProperties.newBasicProp(
            'current',
            0
        );

        // If we are initializing with a name,
        // set the name property
        if(name){
            this.partProperties.setPropertyNamed(
                this,
                'name',
                name
            );
        }

        // Bind general methods
        this.sendOpenCardTo = this.sendOpenCardTo.bind(this);
        this.sendCloseCardTo = this.sendCloseCardTo.bind(this);

        // Bind stack navigation methods
        this.goToNextCard = this.goToNextCard.bind(this);
        this.goToPrevCard = this.goToPrevCard.bind(this);
        this.goToCardById = this.goToCardById.bind(this);
        this.goToNthCard = this.goToNthCard.bind(this);
    }

    goToNextCard(){
        let cards = this.subparts.filter(subpart => {
            return subpart.type == 'card';
        });
        if(cards.length < 2){
            return;
        }
        let currentIdx = this.currentCardIndex;
        let currentCard = cards[currentIdx];
        let nextIdx = currentIdx + 1;
        if(nextIdx >= cards.length){
            nextIdx = (nextIdx % cards.length);
        }
        this.partProperties.setPropertyNamed(
            this,
            'current',
            nextIdx
        );
        let nextCard = cards[nextIdx];
        if(nextCard.id != currentCard.id){
            this.sendCloseCardTo(currentCard);
            this.sendOpenCardTo(nextCard);
        }
    }

    goToCardById(anId){
        let cards = this.subparts.filter(subpart => {
            return subpart.type == 'card';
        });
        let found = cards.find(card => {
            return card.id == anId;
        });
        if(!found){
            throw new Error(`The card id: ${anId} cant be found on this stack`);
        }
        let currentCard = this.currentCard;
        let cardIdx = cards.indexOf(found);
        this.partProperties.setPropertyNamed(
            this,
            'current',
            cardIdx
        );
        let nextCard = cards[cardIdx];
        if(currentCard.id != nextCard.id){
            this.sendCloseCardTo(currentCard);
            this.sendOpenCardTo(nextCard);
        }
    }

    goToPrevCard(){
        let cards = this.subparts.filter(subpart => {
            return subpart.type == 'card';
        });
        if(cards.length < 2){
            return;
        }
        let currentIdx = this.currentCardIndex;
        let currentCard = cards[currentIdx];
        let nextIdx = currentIdx - 1;
        if(nextIdx < 0){
            nextIdx = cards.length + nextIdx;
        }
        this.partProperties.setPropertyNamed(
            this,
            'current',
            nextIdx
        );
        let nextCard = cards[nextIdx];
        if(currentCard.id != nextCard.id){
            this.sendCloseCardTo(currentCard);
            this.sendOpenCardTo(nextCard);
        }
    }

    goToNthCard(anIndex){
        // NOTE: We are using 1-indexed values
        // per the SimpleTalk system
        let trueIndex = anIndex - 1;
        let cards = this.subparts.filter(subpart => {
            return subpart.type == 'card';
        });
        if(trueIndex < 0 || trueIndex > cards.length -1){
            console.warn(`Cannot navigate to card number ${anIndex} -- out of bounds`);
            return;
        }
        let currentCard = this.currentCard;
        this.partProperties.setPropertyNamed(
            this,
            'current',
            trueIndex
        );
        let nextCard = cards[trueIndex];
        if(currentCard.id != nextCard.id){
            this.sendCloseCardTo(currentCard);
            this.sendOpenCardTo(nextCard);
        }
    }

    sendCloseCardTo(aCard){
        this.sendMessage(
            {
                type: 'command',
                commandName: 'closeCard',
                args: [],
                shouldIgnore: true
            },
            aCard
        );
    }

    sendOpenCardTo(aCard){
        this.sendMessage(
            {
                type: 'command',
                commandName: 'openCard',
                args: [],
                shouldIgnore: true
            },
            aCard
        );
    }

    get type(){
        return 'stack';
    }

    get currentCardIndex(){
        return this.partProperties.getPropertyNamed(
            this,
            'current'
        );
    }

    get currentCard(){
        let cards = this.subparts.filter(subpart => {
            return subpart.type == 'card';
        });
        if(cards.length){
            return cards[this.currentCardIndex];
        }
        return null;
    }
};

export {
    Stack,
    Stack as default
};
