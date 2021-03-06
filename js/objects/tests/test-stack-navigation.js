/**
 * Stack Navigation Tests
 * ----------------------------------------
 * Test the ability of StackViews to properly
 * navigate between cards (ie, go to next card,
 * go to card 2, etc)
 */

/* NOTE: This test module does NOT
 * use the preload.js file
 */
import 'jsdom-global/register';
import chai from 'chai';
const assert = chai.assert;

import StackView from '../views/StackView.js';
import Stack from '../parts/Stack.js';
import CardView from '../views/CardView.js';
import Card from '../parts/Card.js';
import World from '../parts/WorldStack.js';
import WorldView from '../views/WorldView.js';

window.customElements.define('st-stack', StackView);
window.customElements.define('st-card', CardView);
window.customElements.define('st-world', WorldView);

let stackView;
let stackModel;
let worldView;
let worldModel;

describe('World Navigation Tests', () => {
    describe('Setup of WorldView', () => {
        it('Can initialize a WorldView with model', () => {
            worldModel = new World(null);
            worldView = document.createElement('st-world');
            worldView.setModel(worldModel);
            assert.exists(worldModel);
            assert.exists(worldView);
            assert.equal(worldModel, worldView.model);
        });
        it('World part has no Stacks on initialization', () => {
            let stackParts = worldModel.subparts.filter(part => {
                return part.type == 'stack';
            });

            assert.equal(stackParts.length, 0);
        });
        it('We can add two Stacks to the world', () => {
            let stack1 = new Stack(worldModel);
            let stack2 = new Stack(worldModel);
            let stack3 = new Stack(worldModel);

            worldModel.addPart(stack1);
            worldModel.addPart(stack2);
            worldModel.addPart(stack3);

            let stackParts = worldModel.subparts.filter(part => {
                return part.type == 'stack';
            });

            assert.equal(stackParts.length, 3);
        });
        it('Can append StackViews from the models', () => {
            worldModel.subparts.filter(part => {
                return part.type == 'stack';
            }).forEach(stackModel => {
                let stackElement = document.createElement('st-stack');
                stackElement.setModel(stackModel);
                worldView.appendChild(stackElement);
            });
            // assumes that the first stack has id 1!
            worldView.goToStackById(1);

            let first = worldView.querySelector('st-stack:first-child');
            let second = worldView.querySelector('st-stack:nth-child(2)');

            assert.exists(first);
            assert.exists(second);
            assert.equal(first.getAttribute('class'), 'current-stack');
            assert.equal(
                worldView.querySelectorAll('st-stack').length,
                3
            );
        });
        it('First child stackView is set to current stack', () => {
            let firstStackView = worldView.querySelector('st-stack:first-child');
            assert.isTrue(
                firstStackView.classList.contains('current-stack')
            );
        });
        it('Other stackView is NOT set to current-stack', () => {
            let otherStacks = worldView.querySelectorAll(
                'st-stack:not(:first-child)'
            );

            otherStacks.forEach(cardView => {
                assert.isFalse(
                    cardView.classList.contains('current-stack')
                );
            });
        });
    });
    describe('Stack Navigation', () => {
        it('#goToNextStack: Can go to next (2nd) stack from current (1st)', () => {
            let first = worldView.querySelector('st-stack:nth-child(1)');
            let second = worldView.querySelector('st-stack:nth-child(2)');
            assert.isTrue(first.classList.contains('current-stack'));
            assert.isFalse(second.classList.contains('current-stack'));

            // Do the navigation
            worldView.goToNextStack();

            assert.isFalse(first.classList.contains('current-stack'));
            assert.isTrue(second.classList.contains('current-stack'));
        });
        it('#goToPrevStack: Can go to prev (1st) stack from current (2nd)', () => {
            let first = worldView.querySelector('st-stack:nth-child(1)');
            let second = worldView.querySelector('st-stack:nth-child(2)');
            assert.isFalse(first.classList.contains('current-stack'));
            assert.isTrue(second.classList.contains('current-stack'));

            // Do the navigation
            worldView.goToPrevStack();

            assert.isTrue(first.classList.contains('current-stack'));
            assert.isFalse(second.classList.contains('current-stack'));
        });
        it('looping forward and backward through stacks cycles around', () => {
            let first = worldView.querySelector('st-stack:nth-child(1)');

            // first stack is curent, and going next 3 times returns it to current
            assert.isTrue(first.classList.contains('current-stack'));
            worldView.goToNextStack();
            assert.isFalse(first.classList.contains('current-stack'));
            worldView.goToNextStack();
            worldView.goToNextStack();
            assert.isTrue(first.classList.contains('current-stack'));

            // repeat shuffle backwards
            worldView.goToPrevStack();
            assert.isFalse(first.classList.contains('current-stack'));
            worldView.goToPrevStack();
            worldView.goToPrevStack();
            assert.isTrue(first.classList.contains('current-stack'));
        });
        it('#goToStackById: Can go to 3rd stack by id (and return)', () => {
            let first = worldView.querySelector('st-stack:nth-child(1)');
            let third = worldView.querySelector('st-stack:nth-child(3)');

            assert.isTrue(first.classList.contains('current-stack'));
            assert.isFalse(third.classList.contains('current-stack'));

            // Do the navigation
            worldView.goToStackById(third.getAttribute("part-id"));

            assert.isTrue(third.classList.contains('current-stack'));
            assert.isFalse(first.classList.contains('current-stack'));

            // Reset the navigation
            worldView.goToStackById(first.getAttribute("part-id"));
            assert.isTrue(first.classList.contains('current-stack'));
            assert.isFalse(third.classList.contains('current-stack'));
        });
    });
});

describe('Stack Navigation Tests', () => {
    describe('Setup of StackView', () => {
        it('Can initialize a StackView with model', () => {
            stackModel = new Stack(null);
            stackView = document.createElement('st-stack');
            stackView.setModel(stackModel);
            assert.exists(stackModel);
            assert.exists(stackView);
            assert.equal(stackModel, stackView.model);
        });
        it('Stack part has only one Card subpart', () => {
            let cardParts = stackModel.subparts.filter(part => {
                return part.type == 'card';
            });

            assert.equal(1, cardParts.length);
        });
        it('Can append the StackView to body', () => {
            document.body.appendChild(stackView);
            let found = document.body.querySelector('st-stack');
            let foundElementId = found.getAttribute('part-id');

            assert.exists(found);
            assert.equal(foundElementId, stackModel.id.toString());
        });
        it('Stack part STILL has only one Card subpart', () => {
            let cardParts = stackModel.subparts.filter(part => {
                return part.type == 'card';
            });

            assert.equal(1, cardParts.length);
        });
        it('StackView has no CardView children yet', () => {
            let numCards = stackView.querySelectorAll('st-card').length;
            assert.equal(0, numCards);
        });
        it('Can create 2 additional cards (stack model has one by default)', () => {
            let card2 = new Card(stackModel);
            let card3 = new Card(stackModel);

            stackModel.addPart(card2);
            stackModel.addPart(card3);

            assert.include(stackModel.subparts, card2);
            assert.include(stackModel.subparts, card3);
        });
        it('Stack model should have 3 cards total now', () => {
            let subCards = stackModel.subparts.filter(subpart => {
                return subpart.type == 'card';
            });
            assert.equal(
                subCards.length,
                3
            );
        });
        it('Can append StackViews from the models', () => {
            stackModel.subparts.filter(part => {
                return part.type == 'card';
            }).forEach(cardModel => {
                let cardElement = document.createElement('st-card');
                cardElement.setModel(cardModel);
                stackView.appendChild(cardElement);
            });
            let first = stackView.querySelector('st-card:first-child');
            let second = stackView.querySelector('st-card:nth-child(2)');
            let third = stackView.querySelector('st-card:nth-child(3)');

            assert.exists(first);
            assert.exists(second);
            assert.exists(third);
            assert.include(Array.from(first.classList), 'current-card');
            assert.equal(
                3,
                stackView.querySelectorAll('st-card').length
            );
        });
        it('First child CardView is set to current card', () => {
            let firstCardView = stackView.querySelector('st-card:first-child');
            assert.isTrue(
                firstCardView.classList.contains('current-card')
            );
        });
        it('Other CardViews are NOT set to current-card', () => {
            let otherCards = stackView.querySelectorAll(
                'st-card:not(:first-child)'
            );

            otherCards.forEach(cardView => {
                assert.isFalse(
                    cardView.classList.contains('current-card')
                );
            });
        });
    });

    describe('Basic 3 card navigation', () => {
        it('#goToNextCard: Can go to next (2nd) card from current (1st)', () => {
            let firstCard = stackView.querySelector('st-card:nth-child(1)');
            let secondCard = stackView.querySelector('st-card:nth-child(2)');
            assert.isTrue(firstCard.classList.contains('current-card'));
            assert.isFalse(secondCard.classList.contains('current-card'));

            // Do the navigation
            stackView.goToNextCard();

            assert.isFalse(firstCard.classList.contains('current-card'));
            assert.isTrue(secondCard.classList.contains('current-card'));
        });

        it('#goToNextCard: Can go to next (3rd) card from current (2nd)', () => {
            let secondCard = stackView.querySelector('st-card:nth-child(2)');
            let thirdCard = stackView.querySelector('st-card:nth-child(3)');
            assert.isTrue(secondCard.classList.contains('current-card'));
            assert.isFalse(thirdCard.classList.contains('current-card'));

            // Do the navigation
            stackView.goToNextCard();
            assert.isFalse(secondCard.classList.contains('current-card'));
            assert.isTrue(thirdCard.classList.contains('current-card'));
        });

        it('#goToNextCard loops back to first card when at last stack card', () => {
            let thirdCard = stackView.querySelector('st-card:nth-child(3)');
            let firstCard = stackView.querySelector('st-card:nth-child(1)');
            assert.isTrue(thirdCard.classList.contains('current-card'));
            assert.isFalse(firstCard.classList.contains('current-card'));

            // Do the navigation. We expect it to 'loop around'
            // back to the first card
            stackView.goToNextCard();
            assert.isFalse(thirdCard.classList.contains('current-card'));
            assert.isTrue(firstCard.classList.contains('current-card'));
        });

        it('#goToPrevCard: loops back to the last card from the first', () => {
            let lastCard = stackView.querySelector('st-card:last-child');
            let firstCard = stackView.querySelector('st-card:first-child');
            assert.isTrue(firstCard.classList.contains('current-card'));
            assert.isFalse(lastCard.classList.contains('current-card'));

            // Do the navigation. Expect to look back to last card
            stackView.goToPrevCard();
            assert.isFalse(firstCard.classList.contains('current-card'));
            assert.isTrue(lastCard.classList.contains('current-card'));
        });

        it('#goToPrevCard: goes back to 2nd card from 3rd (last)', () => {
            let lastCard = stackView.querySelector('st-card:last-child');
            let middleCard = stackView.querySelector('st-card:nth-child(2)');
            assert.isTrue(lastCard.classList.contains('current-card'));
            assert.isFalse(middleCard.classList.contains('current-card'));

            // Do the navigation
            stackView.goToPrevCard();
            assert.isFalse(lastCard.classList.contains('current-card'));
            assert.isTrue(middleCard.classList.contains('current-card'));
        });

        it('#goToPrevCard: goes back to 1st card from 2nd', () => {
            let secondCard = stackView.querySelector('st-card:nth-child(2)');
            let firstCard = stackView.querySelector('st-card:first-child');
            assert.isTrue(secondCard.classList.contains('current-card'));
            assert.isFalse(firstCard.classList.contains('current-card'));

            // Do the navigation
            stackView.goToPrevCard();
            assert.isFalse(secondCard.classList.contains('current-card'));
            assert.isTrue(firstCard.classList.contains('current-card'));
        });

        it('#goToCardById: go to 2nd card by id', () => {
            let secondCard = stackView.querySelector('st-card:nth-child(2)');
            let firstCard = stackView.querySelector('st-card:first-child');
            assert.isTrue(firstCard.classList.contains('current-card'));
            assert.isFalse(secondCard.classList.contains('current-card'));

            // Do the navigation
            stackView.goToCardById(secondCard.getAttribute("part-id"));
            assert.isFalse(firstCard.classList.contains('current-card'));
            assert.isTrue(secondCard.classList.contains('current-card'));

            // Undo the navigation
            stackView.goToCardById(firstCard.getAttribute("part-id"));
            assert.isTrue(firstCard.classList.contains('current-card'));
            assert.isFalse(secondCard.classList.contains('current-card'));
        });
    });

    describe('Nth Card navigation ("go to card 1, etc")', () => {
        it('Can go from first card to third card', () => {
            let firstCard = stackView.querySelector('st-card:first-child');
            let thirdCard = stackView.querySelector('st-card:nth-child(3)');
            assert.isTrue(firstCard.classList.contains('current-card'));
            assert.isFalse(thirdCard.classList.contains('current-card'));

            // Do the navigation. goToNthCard uses 1-indexed values
            stackView.goToNthCard(3);
            assert.isFalse(firstCard.classList.contains('current-card'));
            assert.isTrue(thirdCard.classList.contains('current-card'));
        });

        it('Can go from third card to second card', () => {
            let thirdCard = stackView.querySelector('st-card:nth-child(3)');
            let secondCard = stackView.querySelector('st-card:nth-child(2)');
            assert.isTrue(thirdCard.classList.contains('current-card'));
            assert.isFalse(secondCard.classList.contains('current-card'));

            // Do the navigation.
            stackView.goToNthCard(2);
            assert.isFalse(thirdCard.classList.contains('current-card'));
            assert.isTrue(secondCard.classList.contains('current-card'));
        });

        it('Throws an error when attempting to navigate to card 0 (should be 1 indexed)', () => {
            assert.throws(
                stackView.goToNthCard.bind(0),
                Error
            );
        });

        it('Throws an error when attempting to navigate to a negative number', () => {
            assert.throws(
                stackView.goToNthCard.bind(-13),
                Error
            );
        });

        it('Has no effect if you navigate to positive number that is more than num cards', () => {
            // NOTE: Not sure if this is the expected behavior. Need
            // to check and write an appropriate test here if not.
            let currentCard = stackView.querySelector('st-card.current-card');
            stackView.goToNthCard(51);
            assert.isTrue(currentCard.classList.contains('current-card'));
            stackView.querySelectorAll('st-card:not(.current-card)').forEach(el => {
                assert.isFalse(el.classList.contains('current-card'));
            });
        });
    });
});
