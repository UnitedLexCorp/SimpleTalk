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

const haloButtonSVG = `
<svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-tool" width="24" height="24" viewbox="0 0 24 24" stroke-width="2" stroke="currentcolor" fill="none" stroke-linecap="round" stroke-linejoin="round">
  <path stroke="none" d="m0 0h24v24h0z" fill="none"/>
  <path d="m7 10h3v-3l-3.5 -3.5a6 6 0 0 1 8 8l6 6a2 2 0 0 1 -3 3l-6-6a6 6 0 0 1 -8 -8l3.5 3.5" />
</svg>
`;

const templateString = `
<style>
.field {
    display: flex;
    align-items: center;
    flex-direction: column;
    max-height: 100%important;
    height: 100%;
    width: 100%;
    overflow-y: auto;
    overflow-x: hidden;
}


.field-textarea-wrapper {
    width: 100%;
    height: 90%;
    background-color: var(--palette-cornsik);
}

.field-textarea {
    width: calc(100% - 5px);
    height: 100%;
    white-space: pre-wrap;
}

.field-toolbar {
    display: flex;
    justify-content: center;
    width: 100%;
    background-color: var(--palette-red);
    padding-top: 5px;
    padding-bottom: 5px;
    opacity: 1;
    transition: opacity .5s, transform 1s;
}

.field-toolbar > * {
    margin-right: 2px;
    margin-left: 2px;
}

.field-toolbar > *:active {
    outline: 2px solid #004b67;
}

:host {
    display: block;
    position: absolute;
    outline: none;
    resize: both;
}
:host(:active),
:host(:focus){
    outline: none;
}
</style>
<div class="field">
  <div class="field-toolbar">
      <select title="Mode" id="field-mode">
        <option class="heading" selected>- mode -</option>
        <option value="Bravo">Bravo</option>
        <option value="SimpleTalk" selected>SimpleTalk</option>
      </select>
      <select title="Font Name" id="field-fontname">
        <option class="heading" selected>- font -</option>
        <option value="Monospace" selected>Monospace</option>
        <option value="Times">Times</option>
        <option value="cursive">cursive</option>
        <option value="math">math</option>
      </select>
      <select title="Font Size" id="field-fontsize">
        <option class="heading" selected>- size -</option>
        <option value="1">X-small</option>
        <option value="2">Small</option>
        <option value="3" selected>Medium</option>
        <option value="4">Large</option>
        <option value="5">X-Large</option>
        <option value="6">XX-Large</option>
        <option value="7">Max</option>
      </select>
        <img title="Clean" id="field-clean" src="data:image/gif;base64,R0lGODlhFgAWAIQbAD04KTRLYzFRjlldZl9vj1dusY14WYODhpWIbbSVFY6O7IOXw5qbms+wUbCztca0ccS4kdDQjdTLtMrL1O3YitHa7OPcsd/f4PfvrvDv8Pv5xv///////////////////yH5BAEKAB8ALAAAAAAWABYAAAV84CeOZGmeaKqubMteyzK547QoBcFWTm/jgsHq4rhMLoxFIehQQSAWR+Z4IAyaJ0kEgtFoLIzLwRE4oCQWrxoTOTAIhMCZ0tVgMBQKZHAYyFEWEV14eQ8IflhnEHmFDQkAiSkQCI2PDC4QBg+OAJc0ewadNCOgo6anqKkoIQA7" />
        <!-- <img title="Print" onclick="printDoc();" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABYAAAAWCAYAAADEtGw7AAAABGdBTUEAALGPC/xhBQAAAAZiS0dEAP8A/wD/oL2nkwAAAAlwSFlzAAALEwAACxMBAJqcGAAAAAd0SU1FB9oEBxcZFmGboiwAAAAIdEVYdENvbW1lbnQA9syWvwAAAuFJREFUOMvtlUtsjFEUx//n3nn0YdpBh1abRpt4LFqtqkc3jRKkNEIsiIRIBBEhJJpKlIVo4m1RRMKKjQiRMJRUqUdKPT71qpIpiRKPaqdF55tv5vvusZjQTjOlseUkd3Xu/3dPzusC/22wtu2wRn+jG5So/OCDh8ycMJDflehMlkJkVK7KUYN+ufzA/RttH76zaVocDptRxzQtNi3mRWuPc+6cKtlXZ/sddP2uu9uXlmYXZ6Qm8v4Tz8lhF1H+zDQXt7S8oLMXtbF4e8QaFHjj3kbP2MzkktHpiTjp9VH6iHiA+whtAsX5brpwueMGdONdf/2A4M7ukDs1JW662+XkqTkeUoqjKtOjm2h53YFL15pSJ04Zc94wdtibr26fXlC2mzRvBccEbz2kiRFD414tKMlEZbVGT33+qCoHgha81SWYsew0r1uzfNylmtpx80pngQQ91LwVk2JGvGnfvZG6YcYRAT16GFtW5kKKfo1EQLtfh5Q2etT0BIWF+aitq4fDbk+ImYo1OxvGF03waFJQvBCkvDffRyEtxQiFFYgAZTHS0zwAGD7fG5TNnYNTp8/FzvGwJOfmgG7GOx0SAKKgQgDMgKBI0NJGMEImpGDk5+WACEwEd0ywblhGUZ4Hw5OdUekRBLT7DTgdEgxACsIznx8zpmWh7k4rkpJcuHDxCul6MDsmmBXDlWCH2+XozSgBnzsNCEE4euYV4pwCpsWYPW0UHDYBKSWu1NYjENDReqtKjwn2+zvtTc1vMSTB/mvev/WEYSlASsLimcOhOBJxw+N3aP/SjefNL5GePZmpu4kG7OPr1+tOfPyUu3BecWYKcwQcDFmwFKAUo90fhKDInBCAmvqnyMgqUEagQwCoHBDc1rjv9pIlD8IbVkz6qYViIBQGTJPx4k0XpIgEZoRN1Da0cij4VfR0ta3WvBXH/rjdCufv6R2zPgPH/e4pxSBCpeatqPrjNiso203/5s/zA171Mv8+w1LOAAAAAElFTkSuQmCC">-->
        <img title="Undo" id="field-undo" src="data:image/gif;base64,R0lGODlhFgAWAOMKADljwliE33mOrpGjuYKl8aezxqPD+7/I19DV3NHa7P///////////////////////yH5BAEKAA8ALAAAAAAWABYAAARR8MlJq7046807TkaYeJJBnES4EeUJvIGapWYAC0CsocQ7SDlWJkAkCA6ToMYWIARGQF3mRQVIEjkkSVLIbSfEwhdRIH4fh/DZMICe3/C4nBQBADs=" />
        <img title="Redo" id="field-redo" src="data:image/gif;base64,R0lGODlhFgAWAMIHAB1ChDljwl9vj1iE34Kl8aPD+7/I1////yH5BAEKAAcALAAAAAAWABYAAANKeLrc/jDKSesyphi7SiEgsVXZEATDICqBVJjpqWZt9NaEDNbQK1wCQsxlYnxMAImhyDoFAElJasRRvAZVRqqQXUy7Cgx4TC6bswkAOw==" />
        <img title="Remove formatting" id="field-removeFormat" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABYAAAAWCAYAAADEtGw7AAAABGdBTUEAALGPC/xhBQAAAAZiS0dEAP8A/wD/oL2nkwAAAAlwSFlzAAAOxAAADsQBlSsOGwAAAAd0SU1FB9oECQMCKPI8CIIAAAAIdEVYdENvbW1lbnQA9syWvwAAAuhJREFUOMtjYBgFxAB501ZWBvVaL2nHnlmk6mXCJbF69zU+Hz/9fB5O1lx+bg45qhl8/fYr5it3XrP/YWTUvvvk3VeqGXz70TvbJy8+Wv39+2/Hz19/mGwjZzuTYjALuoBv9jImaXHeyD3H7kU8fPj2ICML8z92dlbtMzdeiG3fco7J08foH1kurkm3E9iw54YvKwuTuom+LPt/BgbWf3//sf37/1/c02cCG1lB8f//f95DZx74MTMzshhoSm6szrQ/a6Ir/Z2RkfEjBxuLYFpDiDi6Af///2ckaHBp7+7wmavP5n76+P2ClrLIYl8H9W36auJCbCxM4szMTJac7Kza////R3H1w2cfWAgafPbqs5g7D95++/P1B4+ECK8tAwMDw/1H7159+/7r7ZcvPz4fOHbzEwMDwx8GBgaGnNatfHZx8zqrJ+4VJBh5CQEGOySEua/v3n7hXmqI8WUGBgYGL3vVG7fuPK3i5GD9/fja7ZsMDAzMG/Ze52mZeSj4yu1XEq/ff7W5dvfVAS1lsXc4Db7z8C3r8p7Qjf///2dnZGxlqJuyr3rPqQd/Hhyu7oSpYWScylDQsd3kzvnH738wMDzj5GBN1VIWW4c3KDon7VOvm7S3paB9u5qsU5/x5KUnlY+eexQbkLNsErK61+++VnAJcfkyMTIwffj0QwZbJDKjcETs1Y8evyd48toz8y/ffzv//vPP4veffxpX77z6l5JewHPu8MqTDAwMDLzyrjb/mZm0JcT5Lj+89+Ybm6zz95oMh7s4XbygN3Sluq4Mj5K8iKMgP4f0////fv77//8nLy+7MCcXmyYDAwODS9jM9tcvPypd35pne3ljdjvj26+H2dhYpuENikgfvQeXNmSl3tqepxXsqhXPyc666s+fv1fMdKR3TK72zpix8nTc7bdfhfkEeVbC9KhbK/9iYWHiErbu6MWbY/7//8/4//9/pgOnH6jGVazvFDRtq2VgiBIZrUTIBgCk+ivHvuEKwAAAAABJRU5ErkJggg==">
        <img title="Bold" id="field-bold" src="data:image/gif;base64,R0lGODlhFgAWAID/AMDAwAAAACH5BAEAAAAALAAAAAAWABYAQAInhI+pa+H9mJy0LhdgtrxzDG5WGFVk6aXqyk6Y9kXvKKNuLbb6zgMFADs=" />
        <img title="Italic" id="field-italic" src="data:image/gif;base64,R0lGODlhFgAWAKEDAAAAAF9vj5WIbf///yH5BAEAAAMALAAAAAAWABYAAAIjnI+py+0Po5x0gXvruEKHrF2BB1YiCWgbMFIYpsbyTNd2UwAAOw==" />
        <img title="Underline" id="field-underline" src="data:image/gif;base64,R0lGODlhFgAWAKECAAAAAF9vj////////yH5BAEAAAIALAAAAAAWABYAAAIrlI+py+0Po5zUgAsEzvEeL4Ea15EiJJ5PSqJmuwKBEKgxVuXWtun+DwxCCgA7" />
        <img title="Left align" id="field-justifyleft" style="display:none" src="data:image/gif;base64,R0lGODlhFgAWAID/AMDAwAAAACH5BAEAAAAALAAAAAAWABYAQAIghI+py+0Po5y02ouz3jL4D4JMGELkGYxo+qzl4nKyXAAAOw==" />
        <img title="Center align" id="field-justifycenter" style="display:none" src="data:image/gif;base64,R0lGODlhFgAWAID/AMDAwAAAACH5BAEAAAAALAAAAAAWABYAQAIfhI+py+0Po5y02ouz3jL4D4JOGI7kaZ5Bqn4sycVbAQA7" />
        <img title="Right align" id="field-justifyright" style="display:none" src="data:image/gif;base64,R0lGODlhFgAWAID/AMDAwAAAACH5BAEAAAAALAAAAAAWABYAQAIghI+py+0Po5y02ouz3jL4D4JQGDLkGYxouqzl43JyVgAAOw==" />
        <img title="Numbered list" id="field-insertorderedlist" style="display:none" src="data:image/gif;base64,R0lGODlhFgAWAMIGAAAAADljwliE35GjuaezxtHa7P///////yH5BAEAAAcALAAAAAAWABYAAAM2eLrc/jDKSespwjoRFvggCBUBoTFBeq6QIAysQnRHaEOzyaZ07Lu9lUBnC0UGQU1K52s6n5oEADs=" />
        <img title="Dotted list" id="field-insertunorderedlist" style="display:none" src="data:image/gif;base64,R0lGODlhFgAWAMIGAAAAAB1ChF9vj1iE33mOrqezxv///////yH5BAEAAAcALAAAAAAWABYAAAMyeLrc/jDKSesppNhGRlBAKIZRERBbqm6YtnbfMY7lud64UwiuKnigGQliQuWOyKQykgAAOw==" />
        <img title="Delete indentation" id="field-outdent" src="data:image/gif;base64,R0lGODlhFgAWAMIHAAAAADljwliE35GjuaezxtDV3NHa7P///yH5BAEAAAcALAAAAAAWABYAAAM2eLrc/jDKCQG9F2i7u8agQgyK1z2EIBil+TWqEMxhMczsYVJ3e4ahk+sFnAgtxSQDqWw6n5cEADs=" />
        <img title="Add indentation" id="field-indent" src="data:image/gif;base64,R0lGODlhFgAWAOMIAAAAADljwl9vj1iE35GjuaezxtDV3NHa7P///////////////////////////////yH5BAEAAAgALAAAAAAWABYAAAQ7EMlJq704650B/x8gemMpgugwHJNZXodKsO5oqUOgo5KhBwWESyMQsCRDHu9VOyk5TM9zSpFSr9gsJwIAOw==" />
        <!--<img title="Hyperlink" onclick="var sLnk=prompt('Write the URL here','http:\/\/');if(sLnk&&sLnk!=''&&sLnk!='http://'){formatDoc('createlink',sLnk)}" src="data:image/gif;base64,R0lGODlhFgAWAOMKAB1ChDRLY19vj3mOrpGjuaezxrCztb/I19Ha7Pv8/f///////////////////////yH5BAEKAA8ALAAAAAAWABYAAARY8MlJq7046827/2BYIQVhHg9pEgVGIklyDEUBy/RlE4FQF4dCj2AQXAiJQDCWQCAEBwIioEMQBgSAFhDAGghGi9XgHAhMNoSZgJkJei33UESv2+/4vD4TAQA7" />-->
        <img title="Cut" id="field-cut" src="data:image/gif;base64,R0lGODlhFgAWAIQSAB1ChBFNsRJTySJYwjljwkxwl19vj1dusYODhl6MnHmOrpqbmpGjuaezxrCztcDCxL/I18rL1P///////////////////////////////////////////////////////yH5BAEAAB8ALAAAAAAWABYAAAVu4CeOZGmeaKqubDs6TNnEbGNApNG0kbGMi5trwcA9GArXh+FAfBAw5UexUDAQESkRsfhJPwaH4YsEGAAJGisRGAQY7UCC9ZAXBB+74LGCRxIEHwAHdWooDgGJcwpxDisQBQRjIgkDCVlfmZqbmiEAOw==" />
   </div>
   <divi class="field-textarea-wrapper">
      <div class="field-textarea" contenteditable="true" spellcheck="false">
   </div>
  </div>
</div>`;


function formatDoc(sCmd, sValue) {
  document.execCommand(sCmd, false, sValue); oDoc.focus();
}

class FieldView extends PartView {
    constructor(){
        super();

        // this.editorCompleter = this.simpleTalkCompleter;
        this.editorCompleter = null;

        this.template = document.createElement('template');
        this.template.innerHTML = templateString;
        this._shadowRoot = this.attachShadow({mode: 'open'});
        this._shadowRoot.appendChild(
            this.template.content.cloneNode(true)
        );

        // Bind methods
        this.onInput = this.onInput.bind(this);
        this.onClick = this.onClick.bind(this);
        this.textToHtml = this.textToHtml.bind(this);
        this.setupPropHandlers = this.setupPropHandlers.bind(this);
        this.setUpToolbar = this.setUpToolbar.bind(this);
        this._toolbarHandler = this._toolbarHandler.bind(this);
        this.setEditorMode = this.setEditorMode.bind(this);
        this.simpleTalkCompleter = this.simpleTalkCompleter.bind(this);
        this.initCustomHaloButton = this.initCustomHaloButton.bind(this);
        this.toggleMode = this.toggleMode.bind(this);

        this.setupPropHandlers();
    }

    setupPropHandlers(){
        // When the htmlContent changes I update the textContent property
        // this way anything that depends on the underlying content can
        // access it directly
        this.onPropChange('htmlContent', (value, id) => {
            let textArea = this._shadowRoot.querySelector('.field-textarea');
            this.model.partProperties.setPropertyNamed(
                this.model,
                'textContent',
                this.htmlToText(textArea)
            );
        });
    }

    afterConnected(){
        let textArea = this._shadowRoot.querySelector('.field-textarea');
        textArea.addEventListener('input', this.onInput);
        textArea.focus();
        // document.execCommand("defaultParagraphSeparator", false, "br");
        this.setUpToolbar();
        // we hide the toolbar by default and open it only when the halo is open
        let toolbar = this._shadowRoot.querySelector('.field-toolbar');
        // toolbar.style.top = `${toolbar.clientHeight + 5}px`;
        // toolbar.style.visibility = "hidden";
        // prevent the default tab key to leave focus on the field
        this.addEventListener("keydown", (event) => {
            if(event.key==="Tab"){
                event.preventDefault();
                document.execCommand('insertHTML', false, '&#x9');
            };
        });
        this.addEventListener('click', this.onClick);
        if(!this.haloButton){
            this.initCustomHaloButton();
        }
    }

    afterDisconnected(){
        let textArea = this._shadowRoot.querySelector('.field-textarea');
        textArea.removeEventListener('input', this.onInput);
        this.removeEventListener('click', this.onClick);
    }

    afterModelSet(){
        // If we have a model, set the value of the textArea
        // to the current text of the field model
        let textArea = this._shadowRoot.querySelector('.field-textarea');
        let htmlContent = this.model.partProperties.getPropertyNamed(
            this.model,
            'htmlContent'
        );
        textArea.innerHTML = htmlContent;
        // set the textContent property
        this.model.partProperties.setPropertyNamed(
            this.model,
            'textContent',
            this.htmlToText(textArea)
        );
    }

    setUpToolbar(){
        let textArea = this._shadowRoot.querySelector('.field-textarea');
        let toolbar = this._shadowRoot.querySelector('.field-toolbar');
        toolbar.childNodes.forEach((node) => {
            // current id contains the command and the value, maybe this is too implicit
            // format "field-command-value"
            // TODO
            if(node.id){
                let [_, command, value] = node.id.split("-");
                let eventName = "click";
                if(command === "fontsize"){
                    eventName = "change";
                }
                node.addEventListener(eventName, (event) => {this._toolbarHandler(event, command, value);})
            }
        });
    }

    _toolbarHandler(event, command, value){
        let textArea = this._shadowRoot.querySelector('.field-textarea');
        if(command === "clean"){
            if(confirm('Are you sure?')){
                textArea.innerHTML = "";
            };
            return true;
        } else if(["fontsize", "fontname"].indexOf(command) > -1){
            value = event.target.value;
        } else if(command === "mode"){
            this.setEditorMode(event.target.value);
        }
        // execute the command
        document.execCommand(command, false, value);
        this.model.partProperties.setPropertyNamed(
            this.model,
            'htmlContent',
            this.htmlToText(textArea)
        );
        textArea.focus();
    }

    // I set the selected editor mode, removing or adding corresponding
    // toolbard elements, as well as adding editor helpers/utilities.
    setEditorMode(mode){
        let toolbarElementNames = ["insertorderedlist", "insertunorderedlist", "justifyleft", "justifycenter", "justifyright"];
        let display = "inherit";
        this.editorCompleter = undefined;
        // spellcheck
        let textArea = this._shadowRoot.querySelector('.field-textarea');
        textArea.setAttribute("spellcheck", "true");
        if(mode === "SimpleTalk"){
            display = "none";
            // this.editorCompleter = this.simpleTalkCompleter;
            textArea.setAttribute("spellcheck", "false");
        }
        toolbarElementNames.forEach((name) => {
            let idSelector = "#field-" + name;
            let element = this._shadowRoot.querySelector(idSelector);
            element.style.display = display;
        });
    }

    simpleTalkCompleter(element){
        let textContent = this.htmlToText(element);
        let startOfHandlerRegex = /^on\s(\w+)(\s|\n)+$/;
        let match = textContent.match(startOfHandlerRegex);
        if(match){
            let messageName = match[1];
            // if input break is a new line then an extra
            // <div></br></div> has beed added into the elemen alreadyt
            let tabLine = "\t\n";
            if(match[2] === "\n"){
                tabLine= "";
            }
            textContent = `${tabLine}end ${messageName}`;
            let htmlContent = this.textToHtml(textContent);
            element.insertAdjacentHTML("beforeend", htmlContent);
        }
        return element.innerHTML;
    }

    /*
     * I convert raw text to html respecting the Firefox
     * contenteditable attribute guidelnes.
     * This means that single lins of text are left as is;
     * multiline text, i.e. text which includes "\n", is
     * wrapped in <div></div> for every line; and the last
     * line gets a <br> tag inserted before the </div> to reflect
     * the "on-enter-key" behavior.
     */
    textToHtml(text){
        if(text){
            if(text.includes("\n")){
                text = "<div>" + text + "<br></div>";
                return text.replace(/\n/g, "</div><div>");
            } else {
                return text;
            }
        } else {
            return "";
        }
    }

    htmlToText(element){
        // TODO this is very naive and ignores most possible structure
        if(element.innerHTML){
            // first replace all the "</div><div>" with line breaks
            let cleanHTML =  element.innerHTML.replace(/<\/div><div>/g, "\n");
            // then remove all html
            let tempElement = document.createElement("div");
            tempElement.innerHTML = cleanHTML;
            let cleanText = tempElement.textContent;
            tempElement.remove();
            return cleanText;
        } else {
            return "";
        }
    }

    onInput(event){
        event.stopPropagation();
        event.preventDefault();

        let innerHTML = event.target.innerHTML;

        if(this.editorCompleter){
            innerHTML = this.editorCompleter(event.target);
        }

        this.model.partProperties.setPropertyNamed(
            this.model,
            'htmlContent',
            innerHTML
        );
    }

    onClick(event){
        if(event.button == 0){
            // if the shift key is pressed we toggle the halo
            if(event.shiftKey){
                event.preventDefault();
                event.stopPropagation();
                if(this.hasOpenHalo){
                    this.closeHalo();
                    // toolbar.style.top = `${toolbar.clientHeight + 5}px`;
                    // toolbar.style.visibility = "hidden";
                } else {
                    this.openHalo();
                    // toolbar.style.top = `-${toolbar.clientHeight + 5}px`;
                    // toolbar.style.visibility = "unset";
                }
            }
        }

    }
    initCustomHaloButton(){
        this.haloButton = document.createElement('div');
        this.haloButton.id = "halo-field-toggle-mode";
        this.haloButton.classList.add('halo-button');
        this.haloButton.innerHTML = haloButtonSVG;
        this.haloButton.style.marginRight = "6px";
        this.haloButton.setAttribute('slot', 'bottom-row');
        this.haloButton.setAttribute('title', 'Toggle field tools');
        this.haloButton.addEventListener('click', this.toggleMode);
    }

    openHalo(){
        // Override default. Here we add a custom button
        // when showing.
        let foundHalo = this.shadowRoot.querySelector('st-halo');
        if(!foundHalo){
            foundHalo = document.createElement('st-halo');
            this.shadowRoot.appendChild(foundHalo);
        }
        foundHalo.append(this.haloButton);
    }

    toggleMode(){
        // we hide the toolbar by default and open it only when the halo is open
        let toolbar = this._shadowRoot.querySelector('.field-toolbar');
        let textarea = this._shadowRoot.querySelector('.field-textarea');
        if (toolbar.style.opacity === "0"){
            toolbar.style.opacity = "1";
            textarea.setAttribute("contenteditable", "true");
        } else {
            toolbar.style.opacity = "0";
            textarea.setAttribute("contenteditable", "false");
        }
        let currentMode = this.getAttribute('mode');
        let nextMode = 'viewing'; // By default, set to viewing
        let isEmpty = (!currentMode || currentMode == undefined || currentMode == "");
        if(currentMode == 'viewing' || isEmpty){
            nextMode = 'editing';
        }
        this.model.partProperties.setPropertyNamed(
            this.model,
            'mode',
            nextMode
        );
    }


};

export {
    FieldView,
    FieldView as default
};
