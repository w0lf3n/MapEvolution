
import {Container, TextButton, TextComponent} from "../lib/dom_connectors.js";
import {EventType, isFunction} from "../lib/js_tools.js";
import {State} from "../lib/statestack.js";


/**
 * @param {Container} parent
 *
 * @returns {State}
 */
const createWelcomeScreen = function (parent, action) {

    const state = new State();
    state.enter = function () {

        const container = new Container("Welcome");
        container.addClass("Center");

        const playAnimationButton = new TextButton();
        if (isFunction(action)) {
            playAnimationButton.addEventListener(EventType.click, (event) => {

                event.stopPropagation();

                container.hide();

                action();

            });
        }
        playAnimationButton.addClass("bi-play-btn");

        /*
        const showCreditsButton = new TextButton();
        showCreditsButton.addClass("bi-card-text");
        */

        /*
        const playYourselfButton = new TextButton();
        playYourselfButton.addClass("bi-controller");
        */

        const buttonContainer = new Container("Buttons");
        buttonContainer.append(playAnimationButton); // playYourselfButton, showCreditsButton

        container.append(
            new TextComponent("The unofficial", "Unofficial"),
            new TextComponent("Map Evolution", "Subtitle"),
            buttonContainer
        );

        parent.addComponent(container);

    };

    return state;

};


export {createWelcomeScreen};
