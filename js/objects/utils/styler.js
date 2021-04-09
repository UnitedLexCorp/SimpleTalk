const cssStyler = (styleObj, propertyName, propertyValue) => {
    let computedStyles = window.getComputedStyle(document.documentElement);

    switch(propertyName){
    case "background-transparency":
        if(propertyValue == "default"){
            console.log(`background-transparency default`);
            styleObj['--skin-background-transparency'] = false;
        } else {
            console.log(`background-transparency ${propertyValue}`);
            styleObj['--skin-background-transparency'] = propertyValue;
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


export {
    cssStyler,
    cssStyler as default
};
