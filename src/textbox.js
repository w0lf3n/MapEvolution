
import {Container, Paragraph, TextComponent} from "../lib/dom_connectors.js";
import {hasProperty, hasValue, isString} from "../lib/js_tools.js";


/** @type {Container} */
let container = null;
let titleComponent = null;
/** @type {Container} */
let infoContainer = null;


export const init = function (x, y) {

    container = new Container("TextBox");

    container.setStyle("left", x + "px");
    container.setStyle("top", y + "px");

    titleComponent = new TextComponent(null, "Title");
    infoContainer = new Container("Information");

    container.append(titleComponent, infoContainer);

    return container;
};

export const calculateAndSetPosition = function (x, y, width, height) {

    const boundsSelf = container.getBounds();

    height = height + 20;

    if (y > 400) {
        y = y - boundsSelf.height - 20;
    } else {
        y = y + height;
    }

    const middleRef = x + width * 0.5;
    const middleSelf = boundsSelf.width * 0.5;

    container.setStyle(
        "transform",
        `translate(${Math.round(middleRef - middleSelf)}px, ${y}px)`
    );

};

export const setTitle = function (title) {
    titleComponent.text = title;
};

export const Task = Object.freeze({
    NEW: "bi-plus-circle-fill",
    CHANGE: "bi-capslock-fill", // bi-pencil-fill / bi-capslock-fill
    INFO: "bi-info-circle-fill"
});

export const Misc = Object.freeze({
    LOCKED: "bi-lock-fill"
});

export const Target = Object.freeze({
    LOCATION: "bi-house-fill", // bi-geo-alt-fill
    ROOM: "bi-door-open-fill",
    CHARACTER: "bi-person-fill",
    MINIGAME: "bi-puzzle-fill"
});

const createInformation = function (textObject) {

    const paragraph = new Paragraph();

    if (hasProperty(textObject, "task") && hasValue(Task, textObject.task)) {

        const task = new TextComponent(null, "Icon");
        task.addClass("Task");
        task.addClass(textObject.task);
        paragraph.addComponent(task);

    }

    if (hasProperty(textObject, "target") && hasValue(Target, textObject.target)) {

        const target = new TextComponent(null, "Icon");
        target.addClass("Target");
        target.addClass(textObject.target);
        paragraph.addComponent(target);

    }

    if (hasProperty(textObject, "text") && isString(textObject.text)) {

        const text = new TextComponent();
        if (textObject.text === Misc.LOCKED) {
            text.addClass("Icon");
            text.addClass("Lock");
            text.addClass(textObject.text);
        } else {
            text.addClass("Text");
            text.text = textObject.text;
        }
        paragraph.addComponent(text);

    }

    return paragraph;

};

/** @param {Array<string>} content */
export const setContent = function (content = []) {

    infoContainer.clear();

    if (content instanceof Array) {
        content.forEach(item => infoContainer.addComponent(createInformation(item)));
    }

};

export const show = function () {
    container.setStyle("opacity", "1");
};

export const hide = function () {
    container.setStyle("opacity", "0");
};

export const clear = function () {

    hide();

    titleComponent.text = "";
    infoContainer.clear();

};
