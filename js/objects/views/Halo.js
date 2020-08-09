/**
 * Halo
 * -------------------------------------------------
 * I am a webcomponent that wraps another PartView
 * when it is currently in edit mode. I show myself
 * as a halo of options around the target part.
 * Though I appear to 'wrap around' my target part,
 * I am one of its children in DOM terms.
 */

const templateString = `
                <style>
                 @keyFrames onAppear {
                     0% {
                         opacity: 0.01;
                         transform: scale(0.5);
                     }

                     100% {
                         opacity: 1.0;
                         transform: scale(1.0);
                     }
                 }
                 :host {
                     display: block;
                     position: absolute;
                     top: -30px;
                     left: -30px;
                     width: calc(100% + 60px);
                     height: calc(100% + 60px);
                     border: 1px solid red;
                     animation: onAppear 0.1s;
                 }

                 .st-halo-resizer {
                     display: block;
                     position: absolute;
                     left: 100%;
                     top: 100%;
                     width: 25px;
                     height: 25px;
                     border-radius: 100%;
                     background-color: red;
                 }

                 .st-halo-rotater {
                     display: block;
                     position: absolute;
                     left: -25px;
                     top: 100%;
                     width: 25px;
                     height: 25px;
                     border-radius: 100%;
                     background-color: blue;
                 }
                </style>
                <div class="st-halo-resizer"></div>
                <div class="st-halo-rotater"></div>
`;

class Halo extends HTMLElement {
    constructor(){
        super();

        this.template = document.createElement('template');
        this.template.innerHTML = templateString;
        this._shadowRoot = this.attachShadow({mode: 'open'});
        this._shadowRoot.appendChild(this.template.content.cloneNode(true));

        // Bound methods
        this.resizeMouseDown = this.resizeMouseDown.bind(this);
        this.resizeMouseMove = this.resizeMouseMove.bind(this);
        this.resizeMouseUp = this.resizeMouseUp.bind(this);
        this.onClick = this.onClick.bind(this);
        this.onMouseDown = this.onMouseDown.bind(this);
        this.onMouseUp = this.onMouseUp.bind(this);
        this.onMouseMove = this.onMouseMove.bind(this);
    }

    connectedCallback(){
        if(this.isConnected){
            // Get the current bounding box size of the
            // parent element, which is the element
            // we are putting this halo "on"
            this.targetElement = this.getRootNode().host;
            this.targetElement.style.position = "relative";
            this.targetElement.classList.add('editing');

            // Set the resizer click and drag
            // events
            this.resizer = this._shadowRoot.querySelector('.st-halo-resizer');
            this.resizer.addEventListener('mousedown', this.resizeMouseDown);

            // Bind click events for host (this) element.
            // IF we prevent propagation, it should disable
            // all click events on the wrapped element as long
            // as the halo is present
            this.addEventListener('click', this.onClick);

            // Add mouseDown listener which will use
            // basic mouse listeners to implement dragging
            // the target element.
            this.addEventListener('mousedown', this.onMouseDown);
        }
    }

    disconnectedCallback(){
        this.removeEventListener('mousedown', this.onMouseDown);
        this.resizer.removeEventListener('mousedown', this.resizeMouseDown);
        this.removeEventListener('click', this.onClick);
        this.targetElement.style.position = "";
        this.targetElement.classList.remove('editing');
    }

    onClick(event){
        event.stopPropagation();
    }

    resizeMouseDown(event){
        document.addEventListener('mousemove', this.resizeMouseMove);
        document.addEventListener('mouseup', this.resizeMouseUp);
        event.stopPropagation();
    }

    resizeMouseUp(event){
        document.removeEventListener('mousemove', this.resizeMouseMove);
        document.removeEventListener('mouseup', this.resizeMouseUp);
    }

    resizeMouseMove(event){
        let oldWidth = parseInt(this.targetElement.style.width);
        let oldHeight = parseInt(this.targetElement.style.height);
        let newWidth = oldWidth + event.movementX;
        let newHeight = oldHeight + event.movementY;

        this.targetElement.style.width = `${newWidth}px`;
        this.targetElement.style.height = `${newHeight}px`;
    }

    onMouseDown(event){
        document.addEventListener('mousemove', this.onMouseMove);
        document.addEventListener('mouseup', this.onMouseUp);
    }

    onMouseUp(event){
        document.removeEventListener('mousemove', this.onMouseMove);
        document.removeEventListener('mouseup', this.onMouseUp);
    }

    onMouseMove(event){
        let oldTop = parseInt(this.targetElement.style.top);
        let oldLeft = parseInt(this.targetElement.style.left);
        let newTop = event.movementY + oldTop;
        let newLeft = event.movementX + oldLeft;

        this.targetElement.style.top = `${newTop}px`;
        this.targetElement.style.left = `${newLeft}px`;
    }
}

export {
    Halo,
    Halo as default
}