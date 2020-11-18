/**
 * FieldView
 * ---------------------------------
 * I am the view of an Field part.
 * I am an "interim" view intended to display
 * and edit plain text on a Card.
 * I should be replaced with a more comprehensive
 * implementation of Field/FieldView in the future.
 */
import PartView from './PartView.js';

const templateString = `
<style>
.field-textarea {
    white-space: pre-wrap;
}

:host {
    display: block;
    flex: 1;
    outline: none;
}
:host(:active),
:host(:focus){
    outline: none;
}
</style>
<div class="field-textarea" contenteditable resize="true"></div>`;

class FieldView extends PartView {
    constructor(){
        super();

        this.template = document.createElement('template');
        this.template.innerHTML = templateString;
        this._shadowRoot = this.attachShadow({mode: 'open'});
        this._shadowRoot.appendChild(
            this.template.content.cloneNode(true)
        );

        // Bind methods
        this.onInput = this.onInput.bind(this);
        this.textToHtml = this.textToHtml.bind(this);
        this.setupPropHandlers = this.setupPropHandlers.bind(this);

        this.setupPropHandlers();
    }

    setupPropHandlers(){
        /*
        this.onPropChange('textContent', (value, partId) => {
            let textArea = this._shadowRoot.querySelector('.field-textarea');
            textArea.innerHTML = this.textToHtml(value);
        });
        */
    }

    afterConnected(){
        let textArea = this._shadowRoot.querySelector('.field-textarea');
        textArea.addEventListener('input', this.onInput);
        document.execCommand("defaultParagraphSeparator", false, "br");
    }

    afterDisconnected(){
        let textArea = this._shadowRoot.querySelector('.field-textarea');
        textArea.removeEventListener('input', this.onInput);
    }

    afterModelSet(){
        // If we have a model, set the value of the textArea
        // to the current text of the field model
        let textArea = this._shadowRoot.querySelector('.field-textarea');
        let textContent = this.model.partProperties.getPropertyNamed(
            this.model,
            'textContent'
        );
        textArea.innerHTML = this.textToHtml(textContent);
    }

    textToHtml(text){
        // split on newline characters
        // text = text.split("\n");
        // wrap each line in a div
        // NOTE: <div> is the default element in contenteditable elements
        // for most browsers
        /*
        let html = "";
        text.forEach((line) => {
            if (!line){
                html += "<br>";
            } else {
                html += `<div>${line}</div>`;
            }
        });
        return html;
        */
        if(text){
            console.log(text);
            return text.replaceAll("\n", "<br>");
        } else {
            return "";
        }
    }

    htmlToText(html){
        // TODO this is very naive and ignores most possible structure
        if(html.innerHTML){
            return html.innerHTML.replaceAll("<br>", "\n");
        } else {
            return "";
        }
        /*
        let text = "";
        if (html.childNodes.length){
            for (let i=0; i < html.childNodes.length - 1; i++){
                let node = html.childNodes[i];
                text = text + node.textContent + "\n";
            };
            text += html.childNodes[html.childNodes.length - 1].textContent;
        }
        return text;
        */
    }

    onInput(event){
        event.stopPropagation();
        event.preventDefault();

        this.model.partProperties.setPropertyNamed(
            this.model,
            'textContent',
            this.htmlToText(event.target)
        );
    }
};

export {
    FieldView,
    FieldView as default
};
