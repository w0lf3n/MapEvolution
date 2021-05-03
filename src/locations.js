
import {Container, Fx, ImageComponent} from "../lib/dom_connectors.js";
import {Cache} from "../lib/cache.js";


/** @type {Cache} */
const locations = new Cache();
/** @type {Cache} */
const animations = new Cache();

/** @type {Container} */
let container = null;

const fadeInById = function (id) {
    Fx.fadeIn(locations.getItem(id));
};

const move = function (id, x, y) {
    console.log("move", id);
    locations.getItem(id).setStyle("transform", `translate(${x}px, ${y}px)`);
};

const createLocation = function (path, position, size) {

    const loc = new ImageComponent(path, "Location");

    loc.setStyle("left", position.x + "px");
    loc.setStyle("top", position.y + "px");
    loc.setStyle("width", size.width + "px");
    loc.setStyle("height", size.height + "px");

    return loc;
};

const replace = function (id, path) {

    console.log("replace", id);

    /** @type {ImageComponent} */
    const oldLocation = locations.getItem(id);

    const newLocation = createLocation(
        path,
        oldLocation.getOffsetPosition(),
        oldLocation.getOffsetSize()
    );

    Fx.fadeOut(oldLocation, () => {
        oldLocation.remove();
    });

    container.addComponent(newLocation);
    Fx.fadeIn(newLocation, () => {
        locations.setItem(id, newLocation);
    });

};

const exists = (id) => locations.hasItem(id);

/**
 * @param {string} id
 * @param {string} path
 * @param {{x: number, y: number}} position
 * @param {{width: number, height: number}} size
 *
 * @returns {boolean} Returns true if it is a new location and false if the location already exists.
 */
const add = function (name, path, position, size) {

    if (exists(name)) {

        if (path) {

            animations.setItem(name, () => {
                replace(name, path);
            });

        } else if (position instanceof Object) {

            const offset = locations.getItem(name).getOffsetPosition();

            // move only if there is no path and therefore no location to create
            if (position.x !== offset.x || position.y !== offset.y) {
                animations.setItem(name, () => {
                    move(name, position.x - offset.x, position.y - offset.y);
                });
            }
        }

    } else {

        const loc = createLocation(path, position, size);
        locations.setItem(name, loc);
        container.addComponent(loc);

    }

};

const animate = function (name) {

    if (exists(name)) {
        if (animations.hasItem(name)) {
            animations.getItem(name)();
            // console.log(animations);
        } else {
            fadeInById(name);
        }
    }

};

const getPositionOf = (name) => (exists(name)) ? locations.getItem(name).getOffsetPosition() : null;

const getSizeOf = (name) => (exists(name)) ? locations.getItem(name).getOffsetSize() : null;

const init = function () {

    container = new Container("Locations");
    container.addClass("Maximize");

    return container;

};

const show = function () {

    container.setStyle("opacity", "1");

};

export {add, animate, getPositionOf, getSizeOf, init, show};
