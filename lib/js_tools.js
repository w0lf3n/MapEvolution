
/**
 * @param {number} val
 *
 * @returns {boolean}
 */
export const isNumber = val => typeof val === "number" && isFinite(val);
/**
 * Checks if the parameter is of type "string" and then if it's not empty.
 *
 * @param {string} str
 * @param {boolean} ignoreEmpty
 *
 * @returns {boolean}
 */
export const isString = function (str, ignoreEmpty = false) {
    const result = typeof str === "string";
    return (ignoreEmpty) ? result : result && str.length > 0;
};
/**
 * @param {Function} func
 *
 * @returns {boolean}
 * */
export const isFunction = func => func instanceof Function;
/**
 * @param {boolean} bool
 *
 * @returns {boolean}
 */
export const isBoolean = bool => typeof bool === "boolean";

export const EventType = {
    click: "click",
    change: "change",
    input: "input",
    keyup: "keyup",
    mouseenter: "mouseenter",
    mouseleave: "mouseleave",
    mouseup: "mouseup"
};
/**
 * @param {string} type
 *
 * @returns {boolean}
 */
export const isEventType = type => (Object.values(EventType).includes(type));

/** Checks, if a top level property (key) exists in an object
 *
 * @param {Object} obj
 * @param {string} prop
 *
 * @returns {boolean}
 */
export const hasProperty = (obj, prop) => (obj instanceof Object && isString(prop)) ? Object.prototype.hasOwnProperty.call(obj, prop) : false;
/** Checks, if a value exists in a flat object
 *
 * @param {Object} obj
 * @param {any} val
 *
 * @returns {boolean}
 */
export const hasValue = (obj, val) => (obj instanceof Object) ? Object.values(obj).includes(val) : false;

/**
 * @param {Function} loader
 * @param  {Array<string>} url
 * @returns {Promise<any[]> | Promise<any>}
 */
const AbstractLoader = function (loader, url) {

    let promise = null;

    if (loader instanceof Function) {
        promise = (url.length > 1) ? Promise.all(url.map(path => loader(path))) : loader(url[0]);
    }

    return promise;
};

/**
 * @param {String} url
 *
 * @returns {Promise}
 */
const loadJSON = (url) => {

    const headers = new Headers();
    headers.append("Content-Type", "application/json");

    /** @type {RequestInit} */
    const options = {
        method: "GET",
        headers,
        mode: (url.includes("../")) ? "cors" : "same-origin"
    };

    if (!url.endsWith(".json")) {
        url = url + ".json";
    }

    const request = new Request(url);
    return fetch(request, options).then((response) => response.json());
};
/** @param  {...string} url */
export const JSONLoader = (...url) => AbstractLoader(loadJSON, url);

/** load image asynchronously
 *
 * @param {String} path
 *
 * @returns {Promise}
 */
const loadImage = (path) => {
    const img = new Image();
    img.src = path;
    return img.decode();
};
/** @param  {...string} url */
export const ImageLoader = (...url) => AbstractLoader(loadImage, url);
