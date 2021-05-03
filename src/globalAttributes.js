
import {isNumber} from "../lib/js_tools.js";


let mapOffsetX = 0;
let mapOffsetY = 0;

/*
const getMapOffset = function () {
    return {x: mapOffsetX, y: mapOffsetY};
};
*/

const setOffset = function (x, y) {
    if (isNumber(x) && isNumber(y)) {
        mapOffsetX = x;
        mapOffsetY = y;
    }
};

export {mapOffsetX, mapOffsetY, setOffset};
