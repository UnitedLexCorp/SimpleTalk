const cssVars = {
    // Color Scheme
    "skin-primary-color-rgb": "83, 58, 113",
    "skin-secondary-color-rgb": "97, 132, 216",
    "skin-tertiary-color-rgb": "80, 197, 183",
    "skin-alt1-color-rgb": "156, 236, 91",
    "skin-alt2-color-rgb": "240, 244, 101",

    // General Font Constants
    "skin-font-size": 14,
    "skin-font-weight": 600,
    "skin-font-family": "sans-serif",
    "skin-text-color-dark": "black",
    "skin-text-color-light": "white",

    // Misc
    "skin-box-shadow": "0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)"
};

const materialCSS = `
<style class="skin-style">
    st-window {
        --skin-win-bar-background-rgb: ${cssVars['skin-secondary-color-rgb']};
        --skin-win-bar-text-color: ${cssVars['skin-text-color-light']};
        --skin-win-bar-min-height: 30px;
        --skin-win-bar-close-button-content: "u2A2F";
        --skin-win-bar-button-height: auto;
        --skin-win-bar-button-width: auto;
        --skin-win-bar-button-background-color: transparent;
        --skin-win-bar-button-border-radius: none;
        --skin-win-pane-border-width: 1px;
        --skin-win-pane-border-rgb: 150, 150, 150;
        --skin-win-pane-worder-alpha: 0.5;
        box-shadow: ${cssVars["skin-box-shadow"]};
    }
</style>
`;

const materialDefinition = {
    "*": {
        
    },
    "button": {
        "variants": {
            "default": {
                "border-top-style": "solid",
                "border-right-style": "solid",
                "border-bottom-style": "solid",
                "border-left-style": "solid",
                "border-top-width": 0,
                "border-bottom-width": 0,
                "border-left-width": 0,
                "border-right-width": 0,
                "corner-top-left-round": 3,
                "corner-top-right-round": 3,
                "corner-bottom-left-round": 3,
                "corner-bottom-right-round": 3,
                "text-size": 18,
                "text-color": "white",
                "shadow-left": 0,
                "shadow-top": 1,
                "shadow-blur": 2,
                "shadow-color": "rgba(0,0,0,0.24)",
                "shadow-transparency": 0.24,
                "background-color": "rgba(83, 58, 113)"
            }
        }
    }
};

let skin = {
    styleTag: materialCSS,
    variables: cssVars,
    styles: materialDefinition
};

export {
    skin as material,
    skin as default
};
