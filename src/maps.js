
import {Container, TextComponent} from "../lib/dom_connectors.js";
import {hasProperty, isNumber, isString} from "../lib/js_tools.js";
import {Misc, Target, Task} from "./textbox.js";
import {setOffset} from "./globalAttributes.js";


/** @type {Container} */
let container = null;
/** @type {Container} */
let legend = null;

let currentMap = null;
let currentWidth = 0;
let currentHeight = 0;
let currentOffsetX = 0;
let currentOffsetY = 0;

/** @param {Object} resource {src: path string, width: pixel number, height: pixel number} */
const addMap = function (resource) {

    currentMap = new Container("Map");

    if (hasProperty(resource, "src") && isString(resource.src)) {

        currentMap.setStyle("background-image", `url(res/maps/${resource.src}.jpg)`);
    }

    if (hasProperty(resource, "width") && isNumber(resource.width)
    && hasProperty(resource, "height") && isNumber(resource.height)) {

        const parentSize = container.getBounds();

        currentWidth = resource.width;
        currentHeight = resource.height;

        currentOffsetX = Math.round((parentSize.width - currentWidth) * 0.5);
        currentOffsetY = Math.round((parentSize.height - currentHeight) * 0.5);

        setOffset(currentOffsetX, currentOffsetY);

        currentMap.setStyle("width", currentWidth + "px");
        currentMap.setStyle("height", currentHeight + "px");

        currentMap.setStyle("left", currentOffsetX + "px");
        currentMap.setStyle("top", currentOffsetY + "px");

        legend.setStyle("left", currentOffsetX + "px");
        legend.setStyle("top", currentOffsetY + "px");

    }

    container.addComponent(currentMap);

};

const createLegend = function () {

    legend = new Container("Legend");

    legend.append(

        new TextComponent("new", "Icon Task " + Task.NEW),

        new TextComponent("changed", "Icon Task " + Task.CHANGE),

        new TextComponent("location", "Icon Target " + Target.LOCATION),
        new TextComponent("room", "Icon Target " + Target.ROOM),

        new TextComponent("additional info", "Icon Task " + Task.INFO),

        new TextComponent("not accessible", "Icon Misc " + Misc.LOCKED)

        // new TextComponent(null, "Icon Target " + Target.CHARACTER),
        // new TextComponent(null, "Icon Target " + Target.MINIGAME)

    );

    container.addComponent(legend);
};

/** @param {Container} target */
const init = function () {

    container = new Container("Maps");
    container.addClass("Maximize");

    // init timetable

    createLegend();

    return container;

};

const show = function () {

    container.setStyle("opacity", "1");

};

export {addMap, init, show};
