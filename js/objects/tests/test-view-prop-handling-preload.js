/**
 * PartView Property Change Handler Testing
 * --------------------------------------------------
 * Test the ability of PartView descendants to properly
 * use the convenience methods for registering property
 * listeners from their models.
 */
import chai from 'chai';
const assert = chai.assert;
import PartView from '../views/PartView.js';
import Part from '../parts/Part.js';

// Create a test view and part combo
class TestView extends PartView {
    constructor(){
        super();
    }
};

class TestPart extends Part {
    constructor(){
        super();
        this.partProperties.newBasicProp(
            'test-property',
            false
        );
    }
};

// Register these with the system
System.registerPart('test', TestPart);
System.registerView('test', TestView);
window.customElements.define('st-test', TestView);

describe('Test use of #onPropChange registration', () => {
    let testView;
    let testModel;
    it('Can create View/Model pair', () => {
        testView = document.createElement('st-test');
        testModel = new TestPart();
        testView.setModel(testModel);
        assert.exists(testView);
        assert.exists(testModel);
        assert.equal(testModel, testView.model);
    });
    it('Can register prop change handler on view (adds to internal dict)', () => {
        let handler = function(newVal, partId){
            // 'this' context will be the view instance
            // when this function is called in reaction to
            // a property change on the view's model
            this.__val = newVal;
            this.__partId = partId;
        };
        testView.onPropChange('test-property', handler);
        assert.equal(
            testView.propChangeHandlers['test-property'],
            handler
        );
    });
    it('View reacts to test property change using handler', () => {
        testModel.partProperties.setPropertyNamed(
            testModel,
            'test-property',
            true
        );
        assert.isTrue(testView.__val); // See previous test
        assert.equal(
            testView.__partId, // See previous test
            testModel.id
        );
    });
});

describe('Test event partProperty handling', () => {
    let testView;
    let testModel;
    testView = document.createElement('st-test');
    testModel = new TestPart();
    testView.setModel(testModel);
    // event callback helpers
    let result = 0;
    let clickHandler = function(){
        result += 1;
    };
    it('Initial "events" property is an empty Map object', () => {
        let events = testModel.partProperties.getPropertyNamed(testModel, "events");
        assert.equal(events.size, 0);
    });
    it('Initial "events" property is an empty Map object', () => {
        let events = testModel.partProperties.getPropertyNamed(testModel, "events");
        assert.equal(events.size, 0);
    });
    it('Setting an "eventRespond" property adds to the "events" property', () => {
        testModel.partProperties.setPropertyNamed(
            testModel,
            'eventRespond',
            "click"
        );
        let events = testModel.partProperties.getPropertyNamed(testModel, "events");
        assert.equal(1, events.size);
        assert.exists(events.has("click"));
    });
    it('Setting an "eventRespond" property sets the "on[event]" attribute on the view DOM element', () => {
        assert.isNotNull(testView["onclick"]);
        assert.equal("function", typeof testView["onclick"]);
    });
    it('Dispatching the event', () => {
        testModel._commandHandlers["click"] = clickHandler;
        let event = new window.MouseEvent('click');
        assert.doesNotThrow(() => testView.dispatchEvent(event));
        assert.equal(1, result);
    });
    it('Setting an "eventIgnore" property removes from the "events" property', () => {
        testModel.partProperties.setPropertyNamed(
            testModel,
            'eventIgnore',
            "click"
        );
        let events = testModel.partProperties.getPropertyNamed(testModel, "events");
        assert.isFalse(events.has("click"));
        assert.equal(0, events.size);
    });
    it('Setting an "eventIgnore" property removes "on[event] attribute from the view DOM element', () => {
        assert.isNull(testView["onclick"]);
    });
    it('Dispatching a removed event does not throw an error and does not do anything', () => {
        let event = new window.MouseEvent('click');
        assert.doesNotThrow(() => testView.dispatchEvent(event));
        assert.equal(1, result);
    });
});
