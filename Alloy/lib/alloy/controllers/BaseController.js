var Alloy = require('alloy'), 
	Backbone = Alloy.Backbone,
	_ = Alloy._;

var Controller = function() {
	var roots = [];

	this.__iamalloy = true;
	_.extend(this, Backbone.Events, {
		__views: {},
		setParent: function(parent) {
			if (parent.__iamalloy) {
				this.parent = parent.parent;
			} else {
				this.parent = parent;
			}

			for (var i = 0, l = roots.length; i < l; i++) {
				if (roots[i].__iamalloy) {
					roots[i].setParent(this.parent);
				} else {
					this.parent.add(roots[i]);
				}
			}
		},
		addTopLevelView: function(view) {
			roots.push(view);
		},
		getTopLevelViews: function() {
			return roots;
		},
		getView: function(id) {
			if (typeof id === 'undefined' || id === null) {
				return roots[0];
			}
			return this.__views[id];
		},
		getViews: function() {
			return this.__views;
		}
	});
}
module.exports = Controller;
