var Alloy = require("alloy"), Backbone = Alloy.Backbone, _ = Alloy._, Controller = function() {
    var roots = [], controllerEvents = {};
    this.__iamalloy = !0;
    _.extend(this, Backbone.Events, {
        __views: {},
        setParent: function(parent) {
            parent.__iamalloy ? this.parent = parent.parent : this.parent = parent;
            for (var i = 0, l = roots.length; i < l; i++) roots[i].__iamalloy ? roots[i].setParent(this.parent) : this.parent.add(roots[i]);
        },
        addTopLevelView: function(view) {
            roots.push(view);
        },
        getTopLevelViews: function() {
            return roots;
        },
        getView: function(id) {
            return typeof id == "undefined" || id === null ? roots[0] : this.__views[id];
        },
        getViews: function() {
            return this.__views;
        },
        destroy: function() {},
        getViewEx: function(opts) {
            var recurse = opts.recurse || !1;
            if (recurse) {
                var view = this.getView();
                return view.__iamalloy ? view.getViewEx({
                    recurse: !0
                }) : view;
            }
            return this.getView();
        }
    });
};

module.exports = Controller;