
import * as Title from "./title.js";

import {AnimationStack} from "./animations.js";
import {isString} from "../lib/js_tools.js";
import {State} from "../lib/statestack.js";


export const TitleState = class extends State {

    /**
     * @param {string} title
     * @param {string} subtitle
     * @param {string} info
     */
    constructor (title, subtitle = null, info = null) {

        super();

        this.time = 0;

        if (isString(title)) {
            this.title = title;
        }

        if (isString(subtitle)) {
            this.subtitle = subtitle;
        }

        if (isString(info)) {
            this.info = info;
        }

    }

    /** @override */
    update (dt) {

        this.time = this.time + dt;

        if (this.time > 5000) {

            AnimationStack.pop();

        } else if (this.time > 4000) {

            Title.hide();

        } else if (this.time > 500) {

            Title.show();

        } else if (this.time > 0) {

            Title.set(this.title, this.subtitle, this.info);

        }

    }

    /** @override */
    exit () {

        Title.clear();

    }

};
