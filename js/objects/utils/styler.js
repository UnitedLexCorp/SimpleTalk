// Add more colors as needed
const basicCSSColors = {
    black: {hex: "#000000", r: 0, g: 0, b: 0},
		silver: {hex: "#C0C0C0", r: 192, g: 192, b: 192},
		gray: {hex: "#808080", r: 128, g: 128, b: 128},
		white: {hex: "#FFFFFF", r: 255, g: 255, b: 255},
		maroon: {hex: "#800000", r: 128, g: 0, b: 0},
		red: {hex: "#FF0000", r: 255, g: 0, b: 0},
		purple: {hex: "#800080", r: 128, g: 0, b: 128},
		fuchsia: {hex: "#FF00FF", r: 255, g: 0, b: 255},
		green: {hex: "#008000", r: 0, g: 128, b: 0},
		lime: {hex: "#00FF00", r: 0, g: 255, b: 0},
		olive: {hex: "#808000", r: 128, g: 128, b: 0},
		yellow: {hex: "#FFFF00", r: 255, g: 255, b: 0},
		navy: {hex: "#000080", r: 0, g: 0, b: 128},
		blue: {hex: "#0000FF", r: 0, g: 0, b: 255},
		teal: {hex: "#008080", r: 0, g: 128, b: 128},
		aqua: {hex: "#00FFFF", r: 0, g: 255, b: 255},
};

const cssStyler = (styleObj, propertyName, propertyValue) => {
    let computedStyles = window.getComputedStyle(document.documentElement);

    switch(propertyName){
    case "background-transparency":
        if(propertyValue == "default"){
            console.log(`background-transparency default`);
            styleObj['--skin-background-transparency'] = null;
        } else {
            console.log(`background-transparency ${propertyValue}`);
            styleObj['--skin-background-transparency'] = propertyValue;
        }
        break;

    case "background-color":
        if(propertyValue == "default"){
            styleObj['--skin-background-color-rgb'] = null;
        } else {
            styleObj['--skin-background-color-rgb'] = _colorToRGBList(propertyValue);
        }
        break;

    case "box-shadow":
        if(propertyValue == "default"){
            styleObj['--skin-box-shadow'] = null;
        } else {
            styleObj['--skin-box-shadow'] = propertyValue;
        }
        break;
    case "top":
        _setOrNot(styleObj, "top",  _intToPx(propertyValue));
        break;

    case "left":
        _setOrNot(styleObj, "left",  _intToPx(propertyValue));
        break;

    case "width":
        _setOrNot(styleObj, "width",  _intToPx(propertyValue));
        break;

    case "height":
        _setOrNot(styleObj, "height",  _intToPx(propertyValue));
        break;

    case "rotate":
        _setOrNot(styleObj, "transform",  _intToRotateDeg(propertyValue));
        break;

    case "hide":
        if(propertyValue === true){
            styleObj["display"] = "none";
        } else if(propertyValue === false){
            styleObj["display"] = null;
        }
        break;

    case "transparency":
        _setOrNot(styleObj, "opacity",  propertyValue);
        break;

    case "left-margin":
    case "right-margin":
    case "top-margin":
    case "bottom-margin":
        var splitName = propertyName.split("-");
        var cssName = splitName.reverse().join("-");
        if(propertyValue == "default"){
            styleObj[cssName] = false; // Unset
        } else {
            _setOrNot(styleObj, cssName, _intToPx(propertyValue));
        }
        break;

    case "left-padding":
    case "right-padding":
    case "top-padding":
    case "bottom-padding":
        var splitName = propertyName.split("-");
        var cssName = splitName.reverse().join("-");
        if(propertyValue == "default"){
            styleObj[cssName] = false; // Unset
        } else {
            _setOrNot(styleObj, cssName, _intToPx(propertyValue));
        }
        break;
    }

    
    
    return styleObj;
};


/** Utility Functions **/
const _intToPx = (n) => {
    if(n !== null && n !== undefined){
        if(typeof(n) === "string"){
            if(n == "fill"){
                return "100%";
            } else if(["thin", "medium", "thick"].indexOf(n) > -1){
                return n;
            }
            n = n.split("px")[0];
        }
        return `${n}px`;
    }
};

const _setOrNot = (styleObj, name, value) => {
    if(value !== null && value !== undefined){
        styleObj[name] = value;
    }
};

const _intToRotateDeg = (n) => {
    if(n !== null && n !== undefined){
        if(typeof(n) === "string"){
            n = n.split("deg")[0];
        }
        return `rotate(${n}deg)`;
    }
};

// Convert colors to a variable-friendly list of rgb values,
// ex: `255, 255, 255` (rather than enclosed rgb/rgba)
// change a css color RGB values, preserving the A(lpha) value
const _colorToRGBList = (STColor) => {
    if(!STColor){
        return;
    }
    let r, g, b, _;
    // ST colors are RGB
    if(STColor.startsWith("rgb")){
        [r, g, b] = STColor.match(/\d+/g);
    } else {
        let colorInfo = basicCSSColors[STColor];
        if(colorInfo){
            r = colorInfo["r"];
            g = colorInfo["g"];
            b = colorInfo["b"];
        } else {
            return;
        }
    }
    return `${r}, ${g}, ${b}`;
};


export {
    cssStyler,
    cssStyler as default
};
