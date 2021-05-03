
import * as Locations from "./locations.js";
import * as Marker from "./marker.js";
import * as Stats from "./statistics.js";
import * as TextBox from "./textbox.js";

import {addAnimation, AnimationStack} from "./animations.js";
import {hasProperty, isNumber, isString} from "../lib/js_tools.js";
import {mapOffsetX, mapOffsetY} from "./globalAttributes.js";
import {State} from "../lib/statestack.js";


const createResourcePath = (resource = null) => (isString(resource)) ? "res/locations/" + resource + ".png" : null;
const createPosition = (x = null, y = null) => (isNumber(x) && isNumber(y)) ? {x, y} : null;
const createSize = (width = null, height = null) => (isNumber(width) && isNumber(height)) ? {width, height} : null;

const calculateDelay = (size) => (isNumber(size) && size > 1) ? size * 1000 : 1500;

const LocationState = class extends State {

    constructor (data) {

        super();

        this.name = data.name || null;
        this.path = createResourcePath(data.res);
        this.position = createPosition(mapOffsetX + data.x, mapOffsetY + data.y);
        this.size = createSize(data.width, data.height);

        const newLocation = Stats.addLocation(this.name);
        Locations.add(this.name, this.path, this.position, this.size);

        const rooms = (hasProperty(data, "bgs") && isString(data.bgs)) ? data.bgs.split(";") : null;

        this.info = [];

        const locationInfo = {};
        if (newLocation) {

            locationInfo.task = TextBox.Task.NEW;

            if (rooms === null) {

                locationInfo.text = TextBox.Misc.LOCKED;

            }

        } else if (this.path) {

            locationInfo.task = TextBox.Task.CHANGE;

        }

        if (hasProperty(locationInfo, "task") || hasProperty(locationInfo, "text")) {
            locationInfo.target = TextBox.Target.LOCATION;
            this.info.push(locationInfo);
        }

        if (hasProperty(data, "info") && isString(data.info)) {
            data.info.split(";").forEach(info => this.info.push({task: TextBox.Task.INFO, text: info}));
        }

        if (rooms instanceof Array) {
            rooms.forEach(room => {

                const newRoom = Stats.addRoom(this.name, room);

                const roomInfo = {};
                roomInfo.target = TextBox.Target.ROOM;

                if (newRoom) {
                    roomInfo.task = TextBox.Task.NEW;
                } else {
                    roomInfo.task = TextBox.Task.CHANGE;
                }
                roomInfo.text = room;

                this.info.push(roomInfo);

            });
        }

    }

    /** @override */
    enter () {

        const position = (this.position) ? this.position : Locations.getPositionOf(this.name);
        const size = (this.size) ? this.size : Locations.getSizeOf(this.name);

        TextBox.setTitle(this.name);
        TextBox.setContent(this.info);
        TextBox.calculateAndSetPosition(position.x, position.y, size.width, size.height);

        Marker.setPosition(position.x - 5, position.y - 5);
        Marker.setSize(size.width, size.height);

    }

    /** @override */
    update () {

        addAnimation(() => {
            AnimationStack.pop();
        });

        addAnimation(() => {
            Marker.hide();
            TextBox.hide();
        }, calculateDelay(this.info.length));

        // TODO check if there is something to animate
        addAnimation(() => {
            Locations.animate(this.name);
        });

        addAnimation(() => {
            Marker.show();
            TextBox.show();
        });

    }

    /** @override */
    exit () {

        TextBox.clear();

    }

};

export {LocationState};
