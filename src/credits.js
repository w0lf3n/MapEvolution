
import {addAnimation, AnimationStack, AnimationState, stop as stopAnimation} from "./animations.js";
import {Container, TextComponent} from "../lib/dom_connectors.js";
import {State} from "../lib/statestack.js";
import {stop as stopAudio} from "./audio.js";

// copyright explain your work: try to find the latest fixed version of an update to play through and compare the available content
// for 0.12.0 -> use 0.12.1
// for 0.12.5 -> use 0.12.7
// for 0.13.0 -> use 0.13.1
// for 0.14.5 -> use 0.14.5.2
//  "visit the website" "https://summertimesaga.com/"
// "support the project" "https://www.patreon.com/summertimesaga"
// "All rights of all the artwork and music used are reserved to Kompas Productions.", "Copyright"

// played all the versions to confirm that updates are accessible ingame


const createCredits = function (parent) {

    const credits = new Container("Credits Maximize");
    credits.hide();
    parent.addComponent(credits);

    const copyright = new Container("Content Copyright Center");
    copyright.append(
        new TextComponent("All images and music © 2021 Kompas Productions. All Rights Reserved"),
        new TextComponent("All icons from Bootstrap Icons v1.4.0. MIT License")
    );

    const thanks = new Container("Content");
    thanks.hide();
    thanks.addClass("Center");
    thanks.addComponent(new TextComponent("Thanks for watching!"));

    credits.append(copyright, thanks);

    const state = new State();
    state.update = function () {

        // use add addAnimation();
        // check how to use delay is working

        // main overlay rgba(0, 0, 0, 0.5/7) + test white font
        // 1) copyright
        // 2) statistics
        // 3) origin of dates & names of versions, locations and rooms from wiki & ingame history
        // 4) explain changes to logo & first base map
        // 5) thanks for watching & consider to support and visit the project +links
        //    -> fade to black and music, hype for next update (tech update)

        /*
        addAnimation(() => {
            AnimationStack.pop();
            // AnimationStack.pop();
        });

        addAnimation(() => {
            thanks.hide();
        }, 10000);
        */

        addAnimation(() => {
            thanks.show();
            stopAudio();
            stopAnimation();
        });

        addAnimation(() => {
            copyright.hide();
        }, 10000);

        addAnimation(() => {
            credits.show();
        });
    };

    return state;

};

export {createCredits};
