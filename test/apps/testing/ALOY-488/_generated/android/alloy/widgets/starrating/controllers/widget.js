function WPATH(s) {
    var index = s.lastIndexOf("/");
    var path = -1 === index ? "starrating/" + s : s.substring(0, index) + "/starrating/" + s.substring(index + 1);
    return true && 0 !== path.indexOf("/") ? "/" + path : path;
}

function __processArg(obj, key) {
    var arg = null;
    if (obj) {
        arg = obj[key] || null;
        delete obj[key];
    }
    return arg;
}

function Controller() {
    new (require("/alloy/widget"))("starrating");
    this.__widgetId = "starrating";
    require("/alloy/controllers/BaseController").apply(this, Array.prototype.slice.call(arguments));
    this.__controllerPath = "widget";
    this.args = arguments[0] || {};
    if (arguments[0]) {
        __processArg(arguments[0], "__parentSymbol");
        __processArg(arguments[0], "$model");
        __processArg(arguments[0], "__itemTemplate");
    }
    var $ = this;
    var exports = {};
    $.__views.starrating = Ti.UI.createView({
        layout: "horizontal",
        width: Ti.UI.SIZE,
        backgroundColor: "transparent",
        id: "starrating"
    });
    $.__views.starrating && $.addTopLevelView($.__views.starrating);
    exports.destroy = function() {};
    _.extend($, $.__views);
    var args = arguments[0] || {}, stars = [], rating = 0, max = 5;
    var setRating = function(newRating) {
        newRating > max && (newRating = max);
        rating = newRating;
        for (var i = 0, l = stars.length; l > i; i++) stars[i].image = WPATH(i >= rating ? "star_off.png" : rating > i && i + 1 > rating ? "star_half.png" : "star.png");
    };
    exports.setRating = setRating;
    exports.getRating = function() {
        return rating;
    };
    var createStars = function(num, cb) {
        for (var i = 0; num > i; i++) {
            var star = Alloy.createWidget("starrating", "star").getView();
            !function() {
                var index = i;
                star.addEventListener("click", function() {
                    setRating(index + 1);
                    cb(index + 1);
                });
            }();
            stars.push(star);
            $.starrating.add(star);
        }
    };
    exports.init = function(callback) {
        var max = args.max || 5, initialRating = args.initialRating || 0, cb = callback || function() {};
        createStars(max, cb);
        setRating(initialRating);
        _.extend($.starrating, args);
    };
    _.extend($, exports);
}

var Alloy = require("/alloy"), Backbone = Alloy.Backbone, _ = Alloy._;

module.exports = Controller;