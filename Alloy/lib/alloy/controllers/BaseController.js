var Alloy = require('alloy'), 
	Backbone = Alloy.Backbone,
	_ = Alloy._;

var Controller = function() {
	var roots = [];

	this.__iamalloy = true;
	_.extend(this, Backbone.Events, {
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
		addRoot: function(view) {
			roots.push(view);
		},
		getUIRoots: function() {
			return roots;
		},
		getUIRoot: function(index) {
			return roots[index || 0];
		},
		__views: {},
		getView: function(id) {
			return this.__views[id];
		}
	});
}
module.exports = Controller;
