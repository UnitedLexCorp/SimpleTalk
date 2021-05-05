/**
 * StackView
 * ----------------------------------------------
 * I am a Webcomponent (custom element) representing
 * the view of a Stack.
 * I take up the full width of the current viewport
 * when I am being displayed.
 * My child elements are BackgroundView and CardView
 */

import PartView from './PartView.js';
import Stack from '../parts/Stack.js';

// by default, stacks are hidden unless they're
// the current stack, or else they have the class
// window-stack (suggesting there's window part
// who wishes to display it)
const templateString = `<slot></slot>`;

class StackView extends PartView {
    constructor(){
        super();

        // Setup templating and shadow dom
        const template = document.createElement('template');
        template.innerHTML = templateString;
        this._shadowRoot = this.attachShadow({mode: 'open'});
        this._shadowRoot.appendChild(
            template.content.cloneNode(true)
        );

        // Halo settings. Cards don't want
        //a halo to open
        this.wantsHalo = false;

        // Handle current-ness prop change
        this.onPropChange('current', this.handleCurrentChange);
        this.onPropChange('skin', (val) => {
            this.loadSkinStyle(val);
        });

        // Bind methods
        this.handleCurrentChange = this.handleCurrentChange.bind(this);
        this.loadSkinStyle = this.loadSkinStyle.bind(this);
    }

    afterModelSet(){
        // Do an initial setting of the
        // current card
        this.handleCurrentChange();
    }

    handleCurrentChange(){
        // The value of the current prop is the card index
        // (0-indexed) of the child Card that should be the
        // current one. We remove the current-card class from
        // all others and add it to the specified index.
        let currentCard = this.querySelector('.current-card');
        let nextCurrentIndex = this.model.partProperties.getPropertyNamed(
            this.model,
            'current'
        );
        let cards = Array.from(this.querySelectorAll(':scope > st-card'));
        let nextCurrentCard = cards[nextCurrentIndex];
        if(nextCurrentCard){
            nextCurrentCard.classList.add('current-card');
        } else {
            return;
        }
        if(currentCard){
            currentCard.classList.remove('current-card');
        }
    }

    loadSkinStyle(aSkinName){
        if(!window.System.skins[aSkinName]){
            return console.warn(`Could not find skin named "${aSkinName}"`);
        }

        let skinDef = window.System.skins[aSkinName];

        // Load the contents of the style element from the skin def
        // and prepend to this element's children.
        let temp = document.createElement('template');
        temp.innerHTML = skinDef.styleTag;
        let styleTag = temp.content.cloneNode(true);
        let existingTag = this.querySelector('style.skin-style');
        if(existingTag){
            existingTag.replaceWith(styleTag);
        } else {
            this.prepend(styleTag);
        }
    }
};

export {
    StackView,
    StackView as default
};
