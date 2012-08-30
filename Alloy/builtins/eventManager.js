var listeners = {};

exports.addEventListener = exports.on = function (name, func) {
    if (!listeners[name]) {
        listeners[name] = [];
    }
    listeners[name].push(func);
    return exports;
};

exports.clearEventListeners = function () {
    for (var name in listeners) {
        for (var l in listeners[name]) {
            delete listeners[name][l];
        }
        delete listeners[name];
    }
};

exports.fireEvent = function (name, data) {
    if (!listeners[name]) {
        return;
    }
    for (var l in listeners[name]) {
        listeners[name][l](data);
    }
    return exports;
};

exports.curryFireEvent = function (name, data) {
    return function () {
        if (!listeners[name]) {
            return;
        }
        for (var l in listeners[name]) {
            listeners[name][l](data);
        }
        return exports;
    }
};

exports.removeEventListener = exports.off = function (name, func) {
    for (var l in listeners[name]) {
        if (listeners[name][l] === func) {
            listeners[name].splice(l, 1);
            break;
        }
    }
    return exports;
};