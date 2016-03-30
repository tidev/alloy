function __processArg(obj, key) {
    var arg = null;
    if (obj) {
        arg = obj[key] || null;
        delete obj[key];
    }
    return arg;
}

function Controller() {
    function __alloyId20(e) {
        if (e && e.fromAdapter) return;
        __alloyId20.opts || {};
        var models = __alloyId19.models;
        var len = models.length;
        var __alloyId17 = [];
        for (var i = 0; len > i; i++) {
            var __alloyId16 = models[i];
            __alloyId16.__transform = _.isFunction(__alloyId16.transform) ? __alloyId16.transform() : __alloyId16.toJSON();
            var __alloyId18 = {
                title: _.template("{m.foo}", {
                    m: __alloyId16.__transform
                }, {
                    interpolate: /\{([\s\S]+?)\}/g
                })
            };
            __alloyId17.push(__alloyId18);
            __alloyId14.push(__alloyId18);
        }
        $.__views.__alloyId12.labels = __alloyId17;
    }
    function __alloyId29(e) {
        if (e && e.fromAdapter) return;
        __alloyId29.opts || {};
        var models = __alloyId28.models;
        var len = models.length;
        var __alloyId26 = [];
        for (var i = 0; len > i; i++) {
            var __alloyId25 = models[i];
            __alloyId25.__transform = _.isFunction(__alloyId25.transform) ? __alloyId25.transform() : __alloyId25.toJSON();
            var __alloyId27 = {
                title: _.template("{m.foo} and {m.bar}", {
                    m: __alloyId25.__transform
                }, {
                    interpolate: /\{([\s\S]+?)\}/g
                })
            };
            __alloyId26.push(__alloyId27);
            __alloyId23.push(__alloyId27);
        }
        $.__views.__alloyId21.labels = __alloyId26;
    }
    function __alloyId38(e) {
        if (e && e.fromAdapter) return;
        __alloyId38.opts || {};
        var models = __alloyId37.models;
        var len = models.length;
        var __alloyId35 = [];
        for (var i = 0; len > i; i++) {
            var __alloyId34 = models[i];
            __alloyId34.__transform = myTransformer(__alloyId34);
            var __alloyId36 = {
                title: _.template("{m.foo} and {m.bar}", {
                    m: __alloyId34.__transform
                }, {
                    interpolate: /\{([\s\S]+?)\}/g
                })
            };
            __alloyId35.push(__alloyId36);
            __alloyId32.push(__alloyId36);
        }
        $.__views.__alloyId30.labels = __alloyId35;
    }
    function __alloyId47(e) {
        if (e && e.fromAdapter) return;
        __alloyId47.opts || {};
        var models = __alloyId46.models;
        var len = models.length;
        var __alloyId44 = [];
        for (var i = 0; len > i; i++) {
            var __alloyId43 = models[i];
            __alloyId43.__transform = _.isFunction(__alloyId43.transform) ? __alloyId43.transform() : __alloyId43.toJSON();
            var __alloyId45 = {
                title: _.template("{m.foo}", {
                    m: __alloyId43.__transform
                }, {
                    interpolate: /\{([\s\S]+?)\}/g
                })
            };
            __alloyId44.push(__alloyId45);
            __alloyId41.push(__alloyId45);
        }
        $.__views.__alloyId39.labels = __alloyId44;
    }
    function __alloyId56(e) {
        if (e && e.fromAdapter) return;
        __alloyId56.opts || {};
        var models = __alloyId55.models;
        var len = models.length;
        var __alloyId53 = [];
        for (var i = 0; len > i; i++) {
            var __alloyId52 = models[i];
            __alloyId52.__transform = _.isFunction(__alloyId52.transform) ? __alloyId52.transform() : __alloyId52.toJSON();
            var __alloyId54 = {
                title: _.template("{m.foo} and {m.bar}", {
                    m: __alloyId52.__transform
                }, {
                    interpolate: /\{([\s\S]+?)\}/g
                })
            };
            __alloyId53.push(__alloyId54);
            __alloyId50.push(__alloyId54);
        }
        $.__views.__alloyId48.labels = __alloyId53;
    }
    function __alloyId65(e) {
        if (e && e.fromAdapter) return;
        __alloyId65.opts || {};
        var models = __alloyId64.models;
        var len = models.length;
        var __alloyId62 = [];
        for (var i = 0; len > i; i++) {
            var __alloyId61 = models[i];
            __alloyId61.__transform = myTransformer(__alloyId61);
            var __alloyId63 = {
                title: _.template("{m.foo} and {m.bar}", {
                    m: __alloyId61.__transform
                }, {
                    interpolate: /\{([\s\S]+?)\}/g
                })
            };
            __alloyId62.push(__alloyId63);
            __alloyId59.push(__alloyId63);
        }
        $.__views.__alloyId57.labels = __alloyId62;
    }
    function myTransformer(model) {
        var transformed = model.toJSON();
        transformed.foo = transformed.foo + "D";
        transformed.bar = transformed.bar + "T";
        return transformed;
    }
    require("alloy/controllers/BaseController").apply(this, Array.prototype.slice.call(arguments));
    this.__controllerPath = "index";
    this.args = arguments[0] || {};
    if (arguments[0]) {
        {
            __processArg(arguments[0], "__parentSymbol");
        }
        {
            __processArg(arguments[0], "$model");
        }
        {
            __processArg(arguments[0], "__itemTemplate");
        }
    }
    var $ = this;
    var exports = {};
    Alloy.Models.instance("transformless");
    Alloy.Models.instance("transformer");
    Alloy.Collections.instance("transformless");
    Alloy.Collections.instance("transformer");
    $.__views.index = Ti.UI.createWindow({
        backgroundColor: "#fff",
        fullscreen: false,
        exitOnClose: true,
        layout: "vertical",
        id: "index"
    });
    $.__views.index && $.addTopLevelView($.__views.index);
    $.__views.__alloyId8 = Ti.UI.createLabel({
        top: 30,
        id: "__alloyId8"
    });
    $.__views.index.add($.__views.__alloyId8);
    $.__views.__alloyId9 = Ti.UI.createLabel({
        id: "__alloyId9"
    });
    $.__views.index.add($.__views.__alloyId9);
    $.__views.__alloyId10 = Ti.UI.createLabel({
        id: "__alloyId10"
    });
    $.__views.index.add($.__views.__alloyId10);
    $.__views.__alloyId11 = Ti.UI.createLabel({
        id: "__alloyId11"
    });
    $.__views.index.add($.__views.__alloyId11);
    var __alloyId14 = [];
    var __alloyId19 = Alloy.Collections["transformless"] || transformless;
    __alloyId19.on("fetch destroy change add remove reset", __alloyId20);
    $.__views.__alloyId12 = Ti.UI.createButtonBar({
        labels: __alloyId14,
        id: "__alloyId12"
    });
    $.__views.index.add($.__views.__alloyId12);
    var __alloyId23 = [];
    var __alloyId28 = Alloy.Collections["transformless"] || transformless;
    __alloyId28.on("fetch destroy change add remove reset", __alloyId29);
    $.__views.__alloyId21 = Ti.UI.createButtonBar({
        labels: __alloyId23,
        id: "__alloyId21"
    });
    $.__views.index.add($.__views.__alloyId21);
    var __alloyId32 = [];
    var __alloyId37 = Alloy.Collections["transformless"] || transformless;
    __alloyId37.on("fetch destroy change add remove reset", __alloyId38);
    $.__views.__alloyId30 = Ti.UI.createButtonBar({
        labels: __alloyId32,
        id: "__alloyId30"
    });
    $.__views.index.add($.__views.__alloyId30);
    var __alloyId41 = [];
    var __alloyId46 = Alloy.Collections["transformer"] || transformer;
    __alloyId46.on("fetch destroy change add remove reset", __alloyId47);
    $.__views.__alloyId39 = Ti.UI.createButtonBar({
        labels: __alloyId41,
        id: "__alloyId39"
    });
    $.__views.index.add($.__views.__alloyId39);
    var __alloyId50 = [];
    var __alloyId55 = Alloy.Collections["transformer"] || transformer;
    __alloyId55.on("fetch destroy change add remove reset", __alloyId56);
    $.__views.__alloyId48 = Ti.UI.createButtonBar({
        labels: __alloyId50,
        id: "__alloyId48"
    });
    $.__views.index.add($.__views.__alloyId48);
    var __alloyId59 = [];
    var __alloyId64 = Alloy.Collections["transformer"] || transformer;
    __alloyId64.on("fetch destroy change add remove reset", __alloyId65);
    $.__views.__alloyId57 = Ti.UI.createButtonBar({
        labels: __alloyId59,
        id: "__alloyId57"
    });
    $.__views.index.add($.__views.__alloyId57);
    var __alloyId66 = function() {
        var transformed = _.isFunction(Alloy.Models.transformless.transform) ? Alloy.Models.transformless.transform() : Alloy.Models.transformless.toJSON();
        $.__alloyId8.text = _.template("{m.foo}", {
            m: transformed
        }, {
            interpolate: /\{([\s\S]+?)\}/g
        });
        $.__alloyId9.text = _.template("{m.foo} and {m.bar}", {
            m: transformed
        }, {
            interpolate: /\{([\s\S]+?)\}/g
        });
    };
    Alloy.Models.transformless.on("fetch change destroy", __alloyId66);
    var __alloyId67 = function() {
        var transformed = _.isFunction(Alloy.Models.transformer.transform) ? Alloy.Models.transformer.transform() : Alloy.Models.transformer.toJSON();
        $.__alloyId10.text = _.template("{m.foo}", {
            m: transformed
        }, {
            interpolate: /\{([\s\S]+?)\}/g
        });
        $.__alloyId11.text = _.template("{m.foo} and {m.bar}", {
            m: transformed
        }, {
            interpolate: /\{([\s\S]+?)\}/g
        });
    };
    Alloy.Models.transformer.on("fetch change destroy", __alloyId67);
    exports.destroy = function() {
        __alloyId19 && __alloyId19.off("fetch destroy change add remove reset", __alloyId20);
        __alloyId28 && __alloyId28.off("fetch destroy change add remove reset", __alloyId29);
        __alloyId37 && __alloyId37.off("fetch destroy change add remove reset", __alloyId38);
        __alloyId46 && __alloyId46.off("fetch destroy change add remove reset", __alloyId47);
        __alloyId55 && __alloyId55.off("fetch destroy change add remove reset", __alloyId56);
        __alloyId64 && __alloyId64.off("fetch destroy change add remove reset", __alloyId65);
        Alloy.Models.transformless && Alloy.Models.transformless.off("fetch change destroy", __alloyId66);
        Alloy.Models.transformer && Alloy.Models.transformer.off("fetch change destroy", __alloyId67);
    };
    _.extend($, $.__views);
    Alloy.Models.transformless.set({
        foo: "FOO",
        bar: "BAR"
    });
    Alloy.Models.transformer.set({
        foo: "FOO",
        bar: "BAR"
    });
    Alloy.Collections.transformless.reset([ {
        foo: "1 FOO",
        bar: "1 BAR"
    }, {
        foo: "2 FOO",
        bar: "2 BAR"
    } ]);
    Alloy.Collections.transformer.reset([ {
        foo: "1 FOO",
        bar: "1 BAR"
    }, {
        foo: "2 FOO",
        bar: "2 BAR"
    } ]);
    $.index.open();
    _.extend($, exports);
}

var Alloy = require("alloy"), Backbone = Alloy.Backbone, _ = Alloy._;

module.exports = Controller;