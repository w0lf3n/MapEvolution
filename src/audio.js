
import {hasProperty, isString} from "../lib/js_tools.js";
import {AudioComponent} from "../lib/dom_connectors.js";


const tracks = {};

/** @type {AudioComponent} */
let music = null;

music = new AudioComponent();
music.setOptions({autoplay: false, loop: true});

const hasTrack = (name) => isString(name) && hasProperty(tracks, name);

const addTrack = function (src, name = null) {

    if (isString(src)) {

        if (!isString(name)) {
            name = src;
        }

        if (!hasTrack(name)) {
            tracks[name] = src;
        }

    }

};

const playTrack = function (name) {

    if (hasTrack(name)) {

        music.setAttribute("src", tracks[name]);
        music.play();

    }

};

const stop = function () {

    music.pause();

};

export {addTrack, playTrack, stop};
