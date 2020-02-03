/**
 * MakeBelieveJS
 *
 * jQuery rip-off, but maybe even better than the original
 *
 */

'use strict';

const getType = (object) => {
    return object.constructor.name;
};

const toCamelCase = (subject, separator = ' ') => {
    subject = subject.toLowerCase().split('-');

    subject.forEach(function (item, index) {
        if (index > 0) {
            subject[index] = subject[index][0].toUpperCase() + subject[index].substr(1);
        }
    });

    return subject.join('');
};

const matchAncestor = (child, selector) => {
    const parent = child.parentElement;

    if (parent === null) {
        return {};
    }

    if (parent.matches(selector)) {
        return parent;
    }
    return matchAncestor(parent, selector)
};

const makeBelieve = class {

    constructor(selector) {
        if (getType(selector) === 'String') {
            this._elements = document.querySelectorAll(selector);
        } else if (getType(selector) === 'Array') {
            this._elements = selector;
        } else {
            this._elements = [selector];
        }
    }

    get length() {
        return this._elements.length;
    }

    forEach(callback) {
        this._elements.forEach(callback);
    }

    css(property, value) {
        property = toCamelCase(property);
        this.forEach(function (n, i) {
            n.style[property] = value;
        });
        return this;
    }

    ancestor(selector) {
        let ancestors = [];
        this.forEach(function (n, i) {
            ancestors.push(matchAncestor(n, selector));
        });
        return new makeBelieve(ancestors);
    }

    parent(selector = '*') {
        let parents = [];
        this.forEach(function (n, i) {
            if (n.parentElement.matches(selector)) {
                parents.push(n.parentElement);
            }
        });
        return new makeBelieve(parents);
    }

    toggleClass(className) {
        this.forEach(function (n, i) {
            if (n.classList.contains(className)) {
                n.classList.remove(className);
            } else {
                n.classList.add(className);
            }
        });
        return this;
    }

    insertText(text) {
        this.forEach(function (n, i) {
            n.innerText = text;
        });
        return this;
    }

    prepend(subject) {
        if (getType(subject) === 'String') {
            const el = document.createElement('template');
            el.innerHTML = subject;
            subject = el.content.cloneNode(true);
        }

        this.forEach(function (n, i) {
            n.prepend(subject);
        });
        return this;
    }

    append(subject) {
        if (getType(subject) === 'String') {
            const el = document.createElement('template');
            el.innerHTML = subject;
            subject = el.content.cloneNode(true);
        }

        this.forEach(function (n, i) {
            n.append(subject);
        });
        return this;
    }

    onSubmit(callback) {
        this.forEach(function (n, i) {
            n.addEventListener('submit', callback);
        });
        return this;
    }

    onInput(callback) {
        this.forEach(function (n, i) {
            n.addEventListener('input', callback);
        });
        return this;
    }

    onClick(callback) {
        this.forEach(function (n, i) {
            n.addEventListener('click', callback);
        });
        return this;
    }

    delete() {
        this.forEach(function (n, i) {
            n.parentElement.removeChild(n);
        });
    }
};

const makeBelieveInit = (selector) => {
    return new makeBelieve(selector);
};

const ajaxDefaults = {
    url: null,
    timeout: null,
    data: {},
    headers: [],
    success: null,
    fail: null,
    beforeSend: null,
};

const ajax = (config) => {
    const c = {...ajaxDefaults, ...config};

    let xhr = new XMLHttpRequest();
    xhr.open(c.method, c.url, true);

    if (c.beforeSend !== null) {
        c.beforeSend(xhr);
    }

    if (c.timeout !== null) {
        xhr.timeout = c.timeout * 1000;
    }

    c.headers.forEach(function (h) {
        xhr.setRequestHeader(h[0], h[1]);
    });

    xhr.onerror = c.fail;

    xhr.onload = function () {
        if (xhr.status === 200 && c.success !== null) {
            c.success(xhr.response)
        }
    };

    xhr.send(c.data);
};

window.__ = makeBelieveInit;

window.__.ajax = ajax;