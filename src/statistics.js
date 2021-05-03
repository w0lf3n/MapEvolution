
import {Cache} from "../lib/cache.js";
import {isString} from "../lib/js_tools.js";

const stats = new Cache();

export const addLocation = function (name) {

    let isNew = false;

    if (isString(name)) {

        let item = stats.getItem(name);

        if (item) {

            item.count = item.count + 1;

        } else {

            item = {name, count: 1, rooms: {}};

            isNew = true;

        }

        stats.setItem(name, item);

    }

    return isNew;
};

export const addRoom = function (locationName, roomName) {

    let newRoom = false;

    if (isString(roomName) && isString(locationName)) {

        const location = stats.getItem(locationName);
        if (locationName) {

            let item = location[roomName];

            if (item) {

                item.count = item.count + 1;

            } else {

                // item = {name: roomName, count: 1};
                location[roomName] = {name: roomName, count: 1};

                newRoom = true;

            }

            // stats.setItem(roomName, item);

        }

    }

    return newRoom;
};

export const get = () => stats;
