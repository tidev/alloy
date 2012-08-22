var Alloy = require('alloy'), 
	Backbone = Alloy.Backbone,
	_ = Alloy._;

/**
 * @class Alloy.Controller
 * The base class for Alloy controllers.
 */
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
        /**
         * @method getUIRoots
         * Returns a list fo the root UI elements associated with this controller. 
         * @return {Array.<(Titanium.UI.View|Alloy.Controller)>}
         */
		getUIRoots: function() {
			return roots;
		},
        /**
         * @method getUIRoot
         * Returns the specified root UI element associated with this controller. 
         * If no index is specified, returns the first top-level UI element.
         * @param {Number} index Root UI element to return. 
         * @return {Titanium.UI.View/Alloy.Controller}
         */
		getUIRoot: function(index) {
			return roots[index || 0];
		},
		__views: {},
        /**
         * @method getView
         * Returns the specified view associated with this controller.
         * 
         * If the named view is an Alloy widget, returns an Alloy controller object for 
         * the widget.
         * @param {String} id ID of the view to return.
         * @return {Titanium.UI.View/Alloy.Controller}
         */
		getView: function(id) {
			return this.__views[id];
		}
	});
}
module.exports = Controller;
