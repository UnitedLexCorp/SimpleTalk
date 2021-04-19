/**
 * ButtonView
 * ---------------------------------------------------
 * I am a webcomponent representing a Button.
 */
import PartView from './PartView.js';

const templateString = `
                <style>
                 .st-button-label {
                     user-select: none;
                     pointer-events: none;
                 }
                </style>
                <span class="st-button-label">
                    <slot></slot><!-- Text of the Name -->
                </span>
`;

class ButtonView extends PartView {
    constructor(){
        super();

        this.template = document.createElement('template');
        this.template.innerHTML = templateString;
        this._shadowRoot = this.attachShadow({mode: 'open'});
        this._shadowRoot.appendChild(this.template.content.cloneNode(true));

        // Bound methods
        this.onMouseDown = this.onMouseDown.bind(this);
        this.onMouseUp = this.onMouseUp.bind(this);
        this.onMouseEnter = this.onMouseEnter.bind(this);
        this.onClick = this.onClick.bind(this);
        this.setupPropHandlers = this.setupPropHandlers.bind(this);
        this.updatePartStyle = this.updatePartStyle.bind(this);

        // Setup prop change handlers
        this.setupPropHandlers();
    }

    setupPropHandlers(){
        this.onPropChange('name', (value, partId) => {
            this.innerText = value;
        });
        this.onPropChange('text-color', (value) =>{
            this.style.color = value;
        });
        this.onPropChange('style', this.updatePartStyle);
    }

    afterConnected(){
        // Setup mouse event handling
        this['onmousedown'] = this.onMouseDown;
        this['onmouseup'] = this.onMouseUp;
        this['onmouseenter'] = this.onMouseEnter;
        this['onclick'] = this.onClick;
    }

    afterDisconnected(){
        this['onmousedown'] = null;
        this['onmouseup'] = null;
        this['onmouseenter'] = null;
        this['onclick'] = null;
    }

    afterModelSet(){
        let buttonName = this.model.partProperties.getPropertyNamed(this, "name");
        if(buttonName){
            this.innerText = buttonName;
        };
        this.updatePartStyle();
    }

    // We overwrite the PartView.onHaloOpenEditor for the moment
    // TODO when all editors are properly established this can
    // be moved back to the base class, and remove from here
    onHaloOpenEditor(){
        // Send the message to open a script editor
        // with this view's model as the target
        this.model.sendMessage({
            type: 'command',
            commandName: 'openEditor',
            args: [this.model.id],
            shouldIgnore: true // Should ignore if System DNU
        }, this.model);
    }

    onClick(event){
        if(event.button == 0){
            if(event.shiftKey){
                // prevent triggering the on click message
                event.preventDefault();
                this.onHaloActivationClick(event);
            } else if(!this.hasOpenHalo){
                // Send the click command message to self
                this.model.sendMessage({
                    type: 'command',
                    commandName: 'click',
                    args: [],
                    shouldIgnore: true // Should ignore if System DNU
                }, this.model);
            }
        }
    }

    onMouseDown(event){
        if(event.shiftKey){
            event.preventDefault();
        } else if(!this.hasOpenHalo){
            this.classList.add('active');
        }

        this.model.sendMessage({
            type: 'command',
            commandName: 'mouseDown',
            args: [],
            shouldIgnore: true
        }, this.model);
    }

    onMouseUp(event){
        if(event.shiftKey){
            event.preventDefault();
        } else if(!this.hasOpenHalo){
            // Send the mouseUp command
            // message to Button Part.
            this.model.sendMessage({
                type: 'command',
                commandName: 'mouseUp',
                args: [],
                shouldIgnore: true // Should ignore if System DNU
            }, this.model);
            this.classList.remove('active');
        }
    }

    onMouseEnter(event){
        this.model.sendMessage({
            type: 'command',
            commandName: 'mouseEnter',
            args: [],
            shouldIgnore: true
        }, this.model);
    }

    updatePartStyle(){
        let partStyle = this.model.partProperties.getPropertyNamed(
            this.model,
            'style'
        );
        if(partStyle && partStyle != ""){
            this.setAttribute("part-style", partStyle);
        } else {
            this.removeAttribute("part-style");
        }
    }

    // Overwriting the base class open/close editor methods
    openEditor(){
        window.System.openEditorForPart(this.model.id);
    }

    closeEditor(){
        window.System.closeEditorForPart(this.model.id);
    }
};

export {
    ButtonView,
    ButtonView as default
};
