/**
 * MakeBelieveJS
 *
 * jQuery rip-off, but maybe even better than the original
 *
 */

'use strict';

const makeBelieve = class {

    _elements = [];

    constructor(selector) {
        this.selector = selector;
        this.refresh();
    }

    refresh() {
        const elements = document.querySelectorAll(this.selector);
        for (const element of elements) {
            this._elements.push(element);
        }
    };

    get type() {
        return Object.getPrototypeOf(this.selector);
    }

    get length() {
        return this._elements.length;
    }

    forEach(callback) {
        this._elements.forEach(callback);
    }

    parent(selector = undefined) {
        const el = this._elements[0];
        if (selector === undefined) {
            return el.parentElement;
        }

        if (selector.test('^[\\w\\.#]*$')) {
            return null;
        }

        const c = selector.match('(?<tag>^\\w*)\\.(?<className>\\w*)');
        if (c !== null) {
            const p = el.parentElement;

        }
    }

};

const makeBelieveInit = (selector) => {
    return new makeBelieve(selector);
};

window.__ = makeBelieveInit;
