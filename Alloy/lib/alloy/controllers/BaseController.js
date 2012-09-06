var Alloy = require('alloy'), 
	Backbone = Alloy.Backbone,
	_ = Alloy._;

/**
 * @class Alloy.Controller
 * @extends Backbone.Events
 * The base class for Alloy controllers.
 *
 * Each controller is associated with a UI hierarchy, defined in an XML file in the
 * `views` folder. Each element in the view hierarchy is either a Titanium {@link Titanium.UI.View View}
 * or another Alloy controller or widget. Each Alloy controller or widget can additionally contain
 * Titanium Views and/or more controllers and widgets.
 *
 */
var Controller = function() {
	var roots = [],
		controllerEvents = {};

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

		/**
		 * @method getTopLevelViews
		 * Returns a list of the root view elements associated with this controller.
		 *
		 * @return {Array.<(Titanium.UI.View|Alloy.Controller)>}
		 */
		getTopLevelViews: function() {
			return roots;
		},

		/**
		 * @method getView
		 * Returns the specified view associated with this controller.
		 *
		 * If no `id` is specified, returns the first top-level view.
		 *
		 * @param {String} [id] ID of the view to return.
		 * @return {Titanium.UI.View/Alloy.Controller}
		 */
		getView: function(id) {
			if (typeof id === 'undefined' || id === null) {
				return roots[0];
			}
			return this.__views[id];
		},
		/**
		 * @method getViews
		 * Returns a list of all IDed view elements associated with this controller.
		 *
		 * @return {Array.<(Titanium.UI.View|Alloy.Controller)>}
		 */
		getViews: function() {
			return this.__views;
		},

		// getViewEx for advanced parsing and element traversal
		getViewEx: function(opts) {
			var recurse = opts.recurse || false;
			if (recurse) {
				var view = this.getView();
				if (view.__iamalloy) {
					return view.getViewEx({ recurse: true });
				} else {
					return view;
				}
			} else {
				return this.getView();
			}
		},
		
		/**
		 * @method on
		 * Add an event listener to the controller object, which can be fired manually later by the control
		 *
		 * @param {String} [evt] the name of the event you wish to listen for on this controller
		 * @param {Function} [cb] the callback function to be fired when this event is triggered
		 * @return callback added
		 */
		on: function(evt,cb) {
			controllerEvents[evt] || (controllerEvents[evt] = []);
			controllerEvents[evt].push(cb);
		},
		
		/**
		 * @method off
		 * Remove an event listener to the controller object for the given event
		 *
		 * @param {String} [evt] the name of the event you wish to remove from this controller
		 * @param {Function} [cb] the callback function to be fired when this event is 
		 * @return callback added
		 */
		off: function (evt,cb) {
			controllerEvents[evt] = _.without(controllerEvents[evt], cb);
		},
		
		/**
		 * @method fire
		 * Fire an event on this controller, with the given data
		 *
		 * @param {String} [evt] the name of the event you wish to fire on this controller
		 * @param {Object} [data] the callback function to be fired when this event is triggered
		 * @return callback added
		 */
		fire: function(evt,data) {
			_.each(controllerEvents[evt], function(cb) {
				cb.call(this, data);
			});
		}
	});
}
module.exports = Controller;
