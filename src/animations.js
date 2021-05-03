
import * as Tick from "../lib/tick.js";

import {isFunction, isNumber} from "../lib/js_tools.js";
import {State, StateStack} from "../lib/statestack.js";


const AnimationStack = new StateStack();

const loop = function (dt) {

    if (AnimationStack.isEmpty()) {

        Tick.stop();

    } else {

        AnimationStack.update(dt);

    }

};

const AnimationState = class extends State {

    constructor (method, delay) {

        super();

        if (isFunction(method)) {
            this.method = method;
        }

        if (isNumber(delay)) {
            this.delay = delay;
        }

        this.time = 0;

    }

    /** @override */
    update (dt) {

        this.time = this.time + dt;

        if (this.delay && this.time > this.delay && this.method) {

            this.method();

            AnimationStack.pop();

        }

    }

};

const addAnimation = function (method, delay = 500) {

    if (isFunction(method) && isNumber(delay)) {

        AnimationStack.push(new AnimationState(method, delay));

    }

};

const start = function () {
    Tick.start(loop);
};

const stop = function () {
    Tick.stop();
};

export {addAnimation, AnimationStack, AnimationState, start, stop};
