
import * as TextBox from "./textbox.js";

import {AnimStack} from "./animationStack.js";
import {isString} from "../lib/js_tools.js";
import {State} from "../lib/statestack.js";


export const TextBoxState = class extends State {

    /**
     * @param {string} title
     * @param {string} text
     */
    constructor (title, text) {

        super();

        this.time = 0;

        if (isString(title)) {
            this.title = title;
        }

        if (isString(text)) {
            this.text = text;
        }


    }

    /** @override */
    update (dt) {

        this.time = this.time + dt;

        if (this.time > 5000) {

            AnimStack.pop();

        } else if (this.time > 4000) {

            TextBox.hide();

        } else if (this.time > 500) {

            TextBox.show();

        }

    }

    /** @override */
    enter () {

        TextBox.setTitle(this.title);
        TextBox.setText(this.text);

    }

    /** @override */
    exit () {

        TextBox.clear();

    }

};
