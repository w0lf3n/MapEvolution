
import {addTrack, playTrack} from "./audio.js";
import {AnimationStack, start as startAnimation, stop as stopAnimation} from "./animations.js";
import {EventType, JSONLoader} from "../lib/js_tools.js";
import {init as initLocations, show as showLocations} from "./locations.js";
import {init as initMaps, show as showMaps} from "./maps.js";

import {Application} from "../lib/gui.js";
import {createCredits} from "./credits.js";
import {createWelcomeScreen} from "./welcome.js";
import {init as initMarker} from "./marker.js";
import {init as initTextBox} from "./textbox.js";
import {init as initTitle} from "./title.js";

import {VersionState} from "./versionStates.js";


const app = new Application("Map History");

const prepareExecution = function (data) {

    AnimationStack.push(createCredits(app.getRootPane()));

    data.forEach((review, index) => {
        let fadeOut = true;
        if (index === 0) {
            fadeOut = false;
        }
        AnimationStack.push(new VersionState(review, fadeOut));
    });

    playTrack("maintheme");

    showMaps();
    showLocations();

};

const init = function (data) {

    const root = app.getRootPane();

    root.append(
        initMaps(),
        initLocations(),
        initMarker(),
        initTextBox(),
        initTitle()
    );

    /*
    root.addEventListener(EventType.click, () => {
        stopAnimation();
    });
    */

    addTrack("res/music_map.ogg", "maintheme");

    AnimationStack.push(createWelcomeScreen(root, () => {

        prepareExecution(data);

        startAnimation();

    }));

};

const review = function (...mapVersions) {

    if (mapVersions instanceof Array) {

        const jsonList = [];
        mapVersions.forEach(version => {
            jsonList.push("dat/map-" + version + ".json");
        });

        JSONLoader(...jsonList).then(data => {

            init(data);

        });

    }

};

review(
    "0-08-0",
    "0-07-0",
    "0-06-0",
    "0-05-0",
    "0-04-0",
    "0-03-0",
    "0-02-0",
    "0-01-0"
);
