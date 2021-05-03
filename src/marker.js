
import {Container} from "../lib/dom_connectors.js";
import {isNumber} from "../lib/js_tools.js";


let container = null;


export const init = function (x, y) {

    container = new Container("Marker");

    if (isNumber(x)) {
        container.setStyle("left", x + "px");
    }

    if (isNumber(y)) {
        container.setStyle("top", y + "px");
    }

    return container;

};

export const setPosition = function (x, y) {

    if (isNumber(x) && isNumber(y)) {
        container.setStyle("transform", `translate(${x}px, ${y}px)`);
    }

};

export const setSize = function (width, height) {

    if (isNumber(width)) {
        container.setStyle("width", String(width) + "px");
    }

    if (isNumber(height)) {
        container.setStyle("height", String(height) + "px");
    }

};

export const show = function () {
    container.setStyle("opacity", "1");
};

export const hide = function () {
    container.setStyle("opacity", "0");
};
