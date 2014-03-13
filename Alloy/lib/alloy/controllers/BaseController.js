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
	var roots = [];
	var self = this;

	function getControllerParam() {
		return self.__widgetId ? {
			widgetId: self.__widgetId,
			name: self.__controllerPath
		} : self.__controllerPath;
	}

	this.__iamalloy = true;
	_.extend(this, Backbone.Events, {
		__views: {},
		__proxyProperties: {},
		setParent: function(parent) {
			var len = roots.length;

			if (!len) { return; }

			if (parent.__iamalloy) {
				this.parent = parent.parent;
			} else {
				this.parent = parent;
			}

			for (var i = 0; i < len; i++) {
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
		addProxyProperty: function(key, value) {
			this.__proxyProperties[key] = value;
		},
		removeProxyProperty: function(key) {
			delete this.__proxyProperties[key];
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
		removeView: function(id) {
			delete this[id];
			delete this.__views[id];
		},

		getProxyProperty: function(name) {
			return this.__proxyProperties[name];
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

		/**
		 * @method destroy
		 * Frees binding resources associated with this controller and its
		 * UI components. It is critical that this is called when employing
		 * model/collection binding in order to avoid potential memory leaks.
		 * $.destroy() should be called whenever a controller's UI is to
		 * be "closed" or removed from the app. For more details, see the
		 * example app found here:
		 * https://github.com/appcelerator/alloy/tree/master/test/apps/models/binding_destroy
		 */
		destroy: function(){
			// destroy() is defined during the compile process based on
			// the UI components and binding contained within the controller.
		},

		// getViewEx for advanced parsing and element traversal
		getViewEx: function(opts) {
			var recurse = opts.recurse || false;
			if (recurse) {
				var view = this.getView();
				if (!view) {
					return null;
				} else if (view.__iamalloy) {
					return view.getViewEx({ recurse: true });
				} else {
					return view;
				}
			} else {
				return this.getView();
			}
		},

		// getProxyPropertyEx for advanced parsing and element traversal
		getProxyPropertyEx: function(name, opts) {
			var recurse = opts.recurse || false;
			if (recurse) {
				var view = this.getProxyProperty(name);
				if (!view) {
					return null;
				} else if (view.__iamalloy) {
					return view.getProxyProperty(name, { recurse: true });
				} else {
					return view;
				}
			} else {
				return this.getView(name);
			}
		},

		/**
		 * @method createStyle
		 * Creates a dictionary of properties based on the specified styles.
		 *
		 * You can use this dictionary with the view object's
		 * {@link Titanium.UI.View#method-applyProperties applyProperties} method
		 * or a create object method, such as {@link Titanium.UI#method-createView Titanium.UI.createView}.
		 * @param {AlloyStyleDict} opts Dictionary of styles to apply.
		 * @return {Dictionary}
		 * @since 1.2.0
		 */
		createStyle: function(opts) {
			return Alloy.createStyle(getControllerParam(), opts);
		},

		/*
		 * Documented in docs/apidoc/controller.js
		 */
		UI: {
			create: function(apiName, opts) {
				return Alloy.UI.create(getControllerParam(), apiName, opts);
			}
		},

		/**
		 * @method addClass
		 * Adds a TSS class to the specified view object.
		 *
		 * You can apply additional styles with the `opts` parameter.
		 * @param {Object} proxy View object to which to add class(es).
		 * @param {Array<String>/String} classes Array or space-separated list of classes to apply.
		 * @param {Dictionary} [opts] Dictionary of properties to apply after classes have been added.
		 * @since 1.2.0
		 */
		addClass: function(proxy, classes, opts) {
			return Alloy.addClass(getControllerParam(), proxy, classes, opts);
		},

		/**
		 * @method removeClass
		 * Removes a TSS class from the specified view object.
		 *
		 * You can apply additional styles after the removal with the `opts` parameter.
		 * @param {Object} proxy View object from which to remove class(es).
		 * @param {Array<String>/String} classes Array or space-separated list of classes to remove.
		 * @param {Dictionary} [opts] Dictionary of properties to apply after the class removal.
		 * @since 1.2.0
		 */
		removeClass: function(proxy, classes, opts) {
			return Alloy.removeClass(getControllerParam(), proxy, classes, opts);
		},

		/**
		 * @method resetClass
		 * Sets the array of TSS classes for the target View object, adding the classes specified and
		 * removing any applied classes that are not specified.
		 *
		 * You can apply classes or styles after the reset using the `classes` or `opts` parameters.
		 * @param {Object} proxy View object to reset.
		 * @param {Array<String>/String} [classes] Array or space-separated list of classes to apply after the reset.
		 * @param {Dictionary} [opts] Dictionary of properties to apply after the reset.
		 * @since 1.2.0
		 */
		resetClass: function(proxy, classes, opts) {
			return Alloy.resetClass(getControllerParam(), proxy, classes, opts);
		}
	});
};
module.exports = Controller;
