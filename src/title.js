
import {Container, TextComponent} from "../lib/dom_connectors.js";


let container = null;

let main = null;
let sub = null;
let info = null;


export const init = function () {

    container = new Container("TitleBox");
    container.addClass("Center");

    main = new TextComponent(null, "Main");
    sub = new TextComponent(null, "Sub");
    info = new TextComponent(null, "Info");

    container.append(main, sub, info);

    return container;
};

export const setMain = function (text) {
    main.text = text;
};

export const setSub = function (text) {
    if (text) {
        sub.text = text;
        sub.show();
    } else {
        sub.hide();
    }
};

export const setInfo = function (text) {
    if (text) {
        info.text = text;
        info.show();
    } else {
        info.hide();
    }
};

export const set = function (mainText, subText, infoText) {
    setMain(mainText);
    setSub(subText);
    setInfo(infoText);
};

export const show = function () {
    container.setStyle("opacity", "1");
};

export const hide = function () {
    container.setStyle("opacity", "0");
};

export const clear = function () {

    hide();

    set("", "", "");

};
