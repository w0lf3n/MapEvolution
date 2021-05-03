
import {hasProperty, isString} from "../lib/js_tools.js";
import {addMap} from "./maps.js";
import {AnimationStack} from "./animations.js";
import {Container} from "../lib/dom_connectors.js";
import {LocationState} from "./locationState.js";
import {State} from "../lib/statestack.js";
import {TitleState} from "./titleState.js";


const VersionState = class extends State {

    /**
     * @param {{version:string,res:string,loc:{}}} data
     * @param {Container} container
     */
    constructor (data, fadeOut = true) {

        super();

        if (hasProperty(data, "ver") && isString(data.ver)) {
            this.version = data.ver;
        }

        if (hasProperty(data, "name") && isString(data.name)) {
            this.name = data.name;
        }

        if (hasProperty(data, "date") && isString(data.date)) {
            this.release = new Intl.DateTimeFormat("en-Gb", {dateStyle: "long"}).format(new Date(data.date));
        }

        this.html = null;

        if (hasProperty(data, "map")) {

            this.html = addMap(data.map);

        }

        if (hasProperty(data, "loc") && data.loc instanceof Array) {
            this.locations = data.loc.sort((locA, locB) => locA.name > locB.name);
        }

        this.fadeOut = fadeOut;

    }

    /** @override */
    enter () {

        if (this.version) {
            AnimationStack.push(new TitleState("Version " + this.version, this.name, this.release));
        }

    }

    /** @override */
    update () {

        if (this.locations instanceof Array && this.locations.length > 0) {

            AnimationStack.push(new LocationState(this.locations.shift()));

        } else {

            AnimationStack.pop();

        }
    }

    /** @override */
    exit () {

        if (this.html instanceof Container && this.fadeOut) {
            this.html.setStyle("opacity", "0");
        }

        // console.log(Stats.get());

    }

};

export {VersionState};
