/**
 * CardView
 * --------------------------------------------------
 * I am a webcomponent representation of a Card.
 */

import PartView from './PartView.js';

const templateString = `
                <style>
                </style>
                <slot></slot>
`;

class CardView extends PartView {
    constructor(){
        super();

        // Setup template and shadow root
        const template = document.createElement('template');
        template.innerHTML = templateString;
        this._shadowRoot = this.attachShadow({mode: 'open'});
        this._shadowRoot.appendChild(
            template.content.cloneNode(true)
        );

        // Bind component methods
        this.onClick = this.onClick.bind(this);
        this.onDrop = this.onDrop.bind(this);
        this.setupPropHandlers = this.setupPropHandlers.bind(this);
        this.layoutChanged = this.layoutChanged.bind(this);

        // Setup prop handlers
        this.setupPropHandlers();
    }

    setupPropHandlers(){
        this.onPropChange('layout', this.layoutChanged);
    }

    afterConnected(){
        // Check to see if the parent StackView has another
        // current card set. If not, and I am the first card
        // in the StackView, set myself to be the current card.
        let currentCard = Array.from(this.parentElement.children).find(childEl => {
            return childEl.classList.contains('current-card');
        });

        if(!currentCard){
            this.classList.add('current-card');
        }

        // Add event listeners
        this['onclick'] = this.onClick;
        this['ondragenter'] = (event) => {
            event.preventDefault();
        };
        this['ondragover'] = (event) => {
            event.preventDefault();
            event.dataTransfer.dropEffect = "copy";
        };
        this['ondrop'] = this.onDrop;
    }

    afterDisconnected(){
        // Remove event listeners
        this['onclick'] = null;
        this['ondragenter'] = null;
        this['ondragover'] = null;
        this['ondrop'] = null;
    }

    afterModelSet(){
        // We force update the layout after the
        // model has been set.
        let currentLayout = this.model.partProperties.getPropertyNamed(
            this.model,
            'layout'
        );
        this.layoutChanged(currentLayout);
    }

    onClick(event){
        if(event.button == 0 && event.shiftKey){
            event.preventDefault();
            event.stopPropagation();
            // TODO
            // in the future this should probably be a message
            if (event.altKey){
                this.openWorldCatalog();
            } else {
                // Disabling for now
                //this.openToolbox();
            }
        }
    }

    onDrop(event){
        event.preventDefault();
        let sourceModelId = event.dataTransfer.getData("text/plain");
        let sourceModel = window.System.partsById[sourceModelId];
        if(sourceModel._owner.id !== this.model.id){
            let msg = {
                type: "command",
                commandName : "copyModel",
                args: [sourceModelId, this.model.id],
                shouldIgnore: true
            };
            this.sendMessage(msg, sourceModel);
        }
    }

    layoutChanged(value, partId){
        // Layout stuff
        let layout = value;
        if(layout == 'list'){
            this.classList.add('list-layout');
        } else {
            this.classList.remove('list-layout');
        }
        let listDirection = this.model.partProperties.getPropertyNamed(
            this.model,
            'listDirection'
        );
        this.classList.remove(
            'list-row',
            'list-column'
        );
        if(layout && listDirection == 'row'){
            this.classList.add('list-row');
        } else if(layout && listDirection){
            this.classList.add('list-column');
        }
    }

};

export {
    CardView,
    CardView as default
};
