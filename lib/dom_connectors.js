
import {appendToBody, create, disableContextMenu, isUnique, setDocumentTitle} from "./dom_basic.js";
import {hasProperty, isBoolean, isEventType, isFunction, isNumber, isString} from "./js_tools.js";

/* where ??
    const DISABLED = "disabled";
    setEnabled (enable) {
        console.log(this.tag.getAttribute(DISABLED), this.tag);
        // check for <button>, <command>, <fieldset>, <keygen>, <optgroup>, <option>, <select>, <textarea>, <input> ??
        if (enable) {
            if (this.tag.getAttribute(DISABLED) === DISABLED) {
                this.tag.removeAttribute(DISABLED);
            }
        } else {
            this.tag.setAttribute(DISABLED, DISABLED);
        }
    }
*/

/*
export const Fx = (function () {

    const fifo = [];

    let busy = false;

    const animate = function () {
        if (!busy && fifo.length > 0) {
            const anim = fifo.shift();


            if (hasProperty(anim, "component") && hasProperty(anim, "transformation")) {

                const tag = anim.component.getHTMLElement();
                tag.style.transform = anim.transformation;
                busy = true;
                if (hasProperty(anim, "repeat") && anim.repeat) {
                    fifo.push(anim);
                }
            }


        }
    };

    const core = {};

    core.add = function (...anims) {

        anims.forEach(elem => {
            fifo.push(elem);
        });

        animate();

        return Object.freeze(core);
    };

    return Object.freeze(core);

})();
*/

export const Layout = Object.freeze({
    FLEX: "flex",
    GRID: "grid"
});

/**
 * @param {HTMLElement} target
 * @param {Object} options
 * @param {Array<string>} allowedAttributes
 */
const setAttributesFromOptions = function (target, options, allowedAttributes) {
    if (target instanceof HTMLElement && options instanceof Object && allowedAttributes instanceof Array) {
        for (const attr in options) {
            if (allowedAttributes.includes(attr) && isBoolean(options[attr])) {
                target.setAttribute(attr, options[attr]);
                target[attr] = options[attr];
            }
        }
    }
};

const Component = class {

    /**
     * @param {string} tagName
     * @param {string} className
     */
    constructor (tagName, className = null) {

        this.tag = create(tagName, className);
        this.saveLastDisplay = null;

    }

    /** @param {string} className */
    addClass (className) {
        if (isString(className)) {
            this.tag.classList.add(className);
        }
    }
    /** @param {string} className */
    removeClass (className) {
        if (isString(className)) {
            this.tag.classList.remove(className);
        }
    }
    /** @param {string} className */
    hasClass (className) {
        return (isString(className)) ? this.tag.classList.contains(className) : false;
    }

    getHTMLElement () {
        return this.tag;
    }

    /** @param {AbstractContainer} container */
    set parent (container) {
        if (container instanceof AbstractContainer) {
            this.parentContainer = container;
        }
    }
    get parent () {
        return this.parentContainer;
    }

    /**
     * @param {string} type
     * @param {EventListener} listener
     */
    addEventListener (type, listener) {
        if (isEventType(type) && isFunction(listener)) {
            this.tag.addEventListener(type, listener);
        }
    }

    // removeEventListener

    set id (id) {
        if (isUnique(id)) {
            this.tag.id = id;
        }
    }
    get id () {
        return this.tag.id;
    }

    /**
     * @param {string} key
     * @param {string} value
     */
    setStyle (key, value) {
        if (isString(key) && isString(value, true)) {
            if (this.tag.style[key] !== undefined) {
                this.tag.style[key] = value;
            }
        }
    }
    /** @param {string} key */
    getStyle (key) {
        return (isString(key) && this.tag.style[key] !== undefined) ? this.tag.style[key] : "";
    }

    /**
     * @param {boolean} overrideDefault
     */
    show (overrideDefault = false) {
        let val = "";
        if (this.saveLastDisplay) {
            val = this.saveLastDisplay;
        }
        if (overrideDefault) {
            val = "block";
        }
        this.setStyle("display", val);
    }
    hide () {
        this.saveLastDisplay = this.tag.style.display;
        this.setStyle("display", "none");
    }

    remove () {
        this.tag.remove();
    }

    /** Returns the offset position in pixels to the nearest parent.
     *
     * @returns {{x: number, y: number}}
     */
    getOffsetPosition () {
        return {x: this.tag.offsetLeft, y: this.tag.offsetTop};
    }

    getOffsetSize () {
        return {width: this.tag.offsetWidth, height: this.tag.offsetHeight};
    }

    /** @returns {DOMRect} */
    getBounds () {
        return this.tag.getBoundingClientRect();
    }

    setAttribute (key, value = "") {
        if (isString(key)) {
            this.tag.setAttribute(key, value);
        }
    }

    // getAttribute

};

export const AbstractTextComponent = class extends Component {

    /** @param {string} text */
    set text (text) {
        if (isString(text, true)) {
            this.tag.textContent = text;
        }
    }

    get text () {
        return this.tag.textContent;
    }

};

export const TextComponent = class extends AbstractTextComponent {

    /**
     * @param {string} text
     * @param {string} className
     */
    constructor (text = null, className = null) {
        super("span", className);
        this.text = text;
    }

};

export const Link = class extends AbstractTextComponent {

    constructor (url, className = null) {

        super("a", className);

        this.setURL(url);
        this.setTarget("_blank");

    }

    /** @param {string} target */
    setTarget (target) {
        if (target === "_blank" || target === "_top" || target === "_self") {
            this.tag.setAttribute("target", target);
        }
    }

    /** @param {string} url */
    setURL (url) {
        if (isString(url)) {
            this.tag.setAttribute("href", url);
        }
    }

};

export const TextButton = class extends AbstractTextComponent {

    /**
     * @param {string} text
     * @param {EventListener} actionListener
     */
    constructor (text, actionListener = null) {

        super("button");

        this.text = text;
        this.addEventListener("click", actionListener);

    }

};

const ResourceComponent = class extends Component {

    /** @param {string} path */
    set src (path) {
        if (isString(path)) {
            this.tag.setAttribute("src", path);
        }
    }

    get src () {
        return this.tag.getAttribute("src");
    }

};

export const ImageComponent = class extends ResourceComponent {

    /**
     * @param {string} sourcePath
     * @param {string} className
     */
    constructor (sourcePath = null, className = null) {

        super("img", className);
        super.src = sourcePath;

    }

};

const MediaAttributes = ["autoplay", "controls", "loop", "muted"];
const AbstractMediaComponent = class extends ResourceComponent {

    play () {
        this.tag.play();
    }

    pause () {
        this.tag.pause();
    }

    setOptions (options) {
        setAttributesFromOptions(this.tag, options, MediaAttributes);
    }

};

export const AudioComponent = class extends AbstractMediaComponent {

    /**
     * @param {string} resourcePath
     * @param {string} className
     */
    constructor (resourcePath = null, className = null) {

        super("audio", className);
        super.src = resourcePath;

    }

};

export const VideoComponent = class extends AbstractMediaComponent {

    /**
     * @param {string} resourcePath
     * @param {string} className
     */
    constructor (resourcePath = null, className = null) {

        super("video", className);
        super.src = resourcePath;

    }

};

export const IconButton = class extends Component {

    /**
     * @param {string} iconId
     * @param {EventListener} listener
     */
    constructor (iconId, listener) {

        super("button", "Button Icon");

        this.addClass(iconId);

        this.addEventListener("click", listener);

    }

};

export const TextLabel = class extends AbstractTextComponent {

    /** @param {string} text */
    constructor (text) {

        super("span", "Label");

        this.text = text;

    }

};

export const FormLabel = class extends AbstractTextComponent {

    /** @param {string} text */
    constructor (text) {

        super("label");

        this.tag.setAttribute("for", text);
        this.text = text;

    }

};

export const InputType = Object.freeze({
    CheckBox: "checkbox",
    RadioButton: "radio",
    Textarea: "textarea",
    TextField: "text",
    File: "file"
});
export const InputComponent = class extends Component {

    /**
     * @param {string} type
     * @param {string} className
     */
    constructor (type, className = null) {

        super(null);

        if (isString(type) && type === InputType.Textarea) {
            this.tag = create("textarea");
        } else if (Object.values(InputType).includes(type)) {
            this.tag = create("input", className);
            this.setAttribute("type", type);
        }

    }

    set value (value) {
        this.tag.value = String(value);
    }
    get value () {
        return this.tag.value;
    }

    set name (name) {
        if (isString(name)) {
            this.tag.name = name;
        }
    }
    get name () {
        return this.tag.name;
    }

    setOptions (options) {
        //
    }

};

const DEFAULT_SELECTION_SIZE = 10;
export const SelectionList = class extends Component {

    /** @param {string} className */
    constructor (className = null) {

        super("select", className);

        this.setRows(DEFAULT_SELECTION_SIZE);

    }

    /**
     * @param {string} key
     * @param {string} value
     */
    addItem (key, value) {

        const option = create("option");
        option.textContent = key;
        option.setAttribute("value", value);
        this.tag.appendChild(option);

    }

    /** @param {number} size */
    setRows (size) {
        if (isNumber(size)) {
            this.tag.setAttribute("size", String(size));
        }
    }

};

const AbstractContainer = class extends Component {

    /**
     * @param {Component} component
     * @param {number} index
     */
    addComponent (component, index = -1) {
        if (component instanceof Component) {
            component.parent = this;
            if (isNumber(index)) {
                if (index === -1) {
                    this.tag.appendChild(component.getHTMLElement());
                } else if (index === 0) {
                    this.tag.insertBefore(component.getHTMLElement(), this.tag.firstChild);
                } else {
                    // TODO
                }
            }
        }
    }
    /**
     * @param {Component} newComponent
     * @param {Component} oldComponent
     */
    replaceComponent (newComponent, oldComponent) {
        if (newComponent instanceof Component && oldComponent instanceof Component) {
            this.tag.replaceChild(newComponent.getHTMLElement(), oldComponent.getHTMLElement());
        }
    }

    /** @param {Array<Component>} components */
    append (...components) {
        components.forEach(comp => this.addComponent(comp));
    }

    /** @returns {HTMLCollection} */
    getChildren () {
        return this.tag.children;
    }

    clear () {
        this.tag.innerHTML = "";
    }

};

export const Container = class extends AbstractContainer {

    /** @param {string} className */
    constructor (className = null) {

        super("div", className);

    }

};

export const Paragraph = class extends AbstractContainer {

    /** @param {string} className */
    constructor (className = null) {
        super("p", className);
    }

};

export const ListItem = class extends AbstractTextComponent {

    /**
     * @param {string} text
     * @param {string} className
     */
    constructor (text = null, className = null) {
        super("li", className);
        this.text = text;
    }

};

export const ListContainer = class extends AbstractContainer {

    /**
     * @param {string} className
     * @param {boolean} ordered
     */
    constructor (className = null, ordered = false) {

        const tag = (ordered) ? "ol" : "ul";

        super(tag, className);

    }

    /** @param {ListItem} item */
    addItem (item) {

        if (item instanceof ListItem) {

            super.addComponent(item);

        }

    }

    /** @param {ListItem} item */
    addComponent (item) {

        this.addItem(item);

    }

};

export const AbstractApplication = class extends Container {

    /** @param {string} title */
    constructor (title = null) {

        super("Application");

        this.setTitle(title);

        if (isString(title)) {
            title = title.replace(/\s/g, "_");
        }

        this.addClass(title);

        appendToBody(this.tag);

    }

    /** @param {string} title */
    setTitle (title) {
        setDocumentTitle(title);
    }

    /** @param {boolean} enable */
    setContextMenuEnabled (enable = true) {
        if (!enable) {
            disableContextMenu();
        }
    }

};

export const Fx = (function () {

    const queue = [];

    const core = {};

    core.scrollTop = function (component, val) {
        if (component instanceof Component && isNumber(val)) {
            const tag = component.getHTMLElement();
            if (tag.scrollTop !== val) {
                tag.scrollTop = val;
            }
        }
    };

    core.add = function (...anims) {
        //
    };

    core.fadeIn = function (component, transitionEnd = null) {
        if (component instanceof Component) {
            component.setStyle("opacity", "1");

            if (isFunction(transitionEnd)) {
                component.getHTMLElement().ontransitionend = transitionEnd;
            }
        }
    };

    core.fadeOut = function (component, transitionEnd = null) {
        if (component instanceof Component) {
            component.setStyle("opacity", "0");

            if (isFunction(transitionEnd)) {
                component.getHTMLElement().ontransitionend = transitionEnd;
            }
        }
    };

    return Object.freeze(core);
})();
