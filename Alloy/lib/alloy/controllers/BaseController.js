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
		__events: [],
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

		 * #### Example
		 * The following example displays the `id` of each top-level view associated with the
		 * controller:

	// index.js
	var views = $.getTopLevelViews();
	for (each in views) {
		var view = views[each];
		console.log(view.id);
	}		 

		 * 				
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
		 * #### Example
		 * The following example gets a reference to a `<Window/>` object
		 * with the `id` of "loginWin" and then calls its [open()](Titanium.UI.Window) method.

	var loginWindow = $.getView('loginWin');
	loginWindow.open();		 
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
		 * #### Example
		 * Given the following XML view:

	<Alloy>
		<TabGroup id="tabs">
			<Tab title="Tab 1" icon="KS_nav_ui.png" id="tab1">
				<Window title="Tab 1" id="win1">
					<Label id="label1">I am Window 1</Label>
				</Window>
			</Tab>
			<Tab title="Tab 2" icon="KS_nav_views.png" id="tab2">
				<Window title="Tab 2" id="wind2">
					<Label id="label2">I am Window 2</Label>
				</Window>
			</Tab>
		</TabGroup>
		<View id="otherview"></View>
	</Alloy>		 

		* The following view-controller outputs the id of each view in the hierarchy.

	var views = $.getViews();
	for (each in views) {
		var view = views[each];
		console.log(view.id);
	}	

	[INFO] :   win1
	[INFO] :   label1
	[INFO] :   tab1
	[INFO] :   wind2
	[INFO] :   label2
	[INFO] :   tab2
	[INFO] :   tabs
	[INFO] :   otherview

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
		 * be "closed" or removed from the app. See the [Destroying Data Bindings](#!/guide/Destroying_Data_Bindings)
		 * test application for an example of this approach.

		 * #### Example
		 * In the following example the view-controller for a {@link Titanium.UI.Window Window} object named `dialog`
		 * calls its `destroy()` method in response to the Window object being closed.


	$.dialog.addEventListener('close', function() {
		$.destroy();
	});		 
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
		 *
		 * You can use this dictionary with the view object's
		 * {@link Titanium.UI.View#method-applyProperties applyProperties} method
		 * or a create object method, such as {@link Titanium.UI#method-createView Titanium.UI.createView}.
		 * #### Examples
		 * The following creates a new style object that is passed as a parameter 
		 * to the {@link Titanium.UI#method-createLabel Ti.UI.createLabel()} method.

	var styleArgs = {
	apiName: 'Ti.UI.Label',
		classes: ['blue','shadow','large'],
		id: 'tester',
		borderWidth: 2,
		borderRadius: 16,
		borderColor: '#000'
	};
	var styleObject = $.createStyle(styleArgs);
	testLabel = Ti.UI.createLabel(styleObject);	 

		 * The next example uses the {@link Titanium#method-applyProperties applyProperties()} method
		 * to apply a style object to an existing Button control (button not shown).

	var style = $.createStyle({
		classes: args.button,
		apiName: 'Button',
		color: 'blue'
	});
	$.button.applyProperties(style);
		 * @param {AlloyStyleDict} opts Dictionary of styles to apply.
		 *
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
		 * You can apply additional styles with the `opts` parameter. To use this method
		 * effectively you may need to enable autostyling
		 * on the target XML view. See [Autostyle](#!/guide/Dynamic_Styles-section-37530415_DynamicStyles-Autostyle)
		 * in the Alloy developer guide.
		 * #### Example
		 * The following adds the TSS classes ".redbg" and ".bigger" to a {@link Titanium.UI.Label}
		 * object proxy `label1`, and also sets the label's `text` property to "Cancel".

	// index.js
	$.addClass($.label1, 'redbg bigger', {text: "Cancel"});

The 'redbg' and 'bigger' classes are shown below:

	// index.tss
	".redbg" : {
		color: 'red'
	}
	".bigger": {
		font : {
		   fontSize: '36'    
		}
	}	

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
		 * To use this method effectively you may need to enable autostyling
		 * on the target XML view. See [Autostyle](#!/guide/Dynamic_Styles-section-37530415_DynamicStyles-Autostyle)
		 * in the Alloy developer guide.
		 * #### Example
		 * The following removes the "redbg" and "bigger" TSS classes from a {@link Titanium.UI.Label}
		 * object proxy `label1`, and also sets the label's `text` property to "...".

	$.removeClass($.label1, 'redbg bigger', {text: "..."});

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
		 * To use this method effectively you may need to enable autostyling
		 * on the target XML view. See [Autostyle](#!/guide/Dynamic_Styles-section-37530415_DynamicStyles-Autostyle)
		 * in the Alloy developer guide.

		 * #### Example
		 * The following removes all previously applied styles on `label1` and then applies
		 * the TSS class 'no-style'.

	$.resetClass($.label1, 'no-style');
		 * @param {Object} proxy View object to reset.
		 * @param {Array<String>/String} [classes] Array or space-separated list of classes to apply after the reset.
		 * @param {Dictionary} [opts] Dictionary of properties to apply after the reset.
		 * @since 1.2.0
		 */
		resetClass: function(proxy, classes, opts) {
			return Alloy.resetClass(getControllerParam(), proxy, classes, opts);
		},

		/**
		 * @method updateViews
		 * Applies a set of properties to view elements associated with this controller.
		 * This method is useful for setting properties on repeated elements such as 
		 * {@link Titanium.UI.TableViewRow TableViewRow} objects, rather than needing to have a controller 
		 * for those child controllers.
		 * #### Example
		 * The following example uses this method to update a Label inside a TableViewRow object
		 * before adding it to a TableView.

		 * View-controller file: controllers/index.js

	for (var i=0; i < 10; i++) {
	  var row = Alloy.createController("tablerow");
	  row.updateViews({
	  	"#theLabel": {
	  		text: "I am row #" + i
	  	}
	  });  
	  $.tableView.appendRow(row.getView());
	};

			 * XML view: views/tablerow.xml

	<Alloy>
		<TableViewRow>
			<Label id="theLabel"></Label>
		</TableViewRow>
	</Alloy>	 

			 * XML view: views/index.xml

	<TableView id="tableView">
	</TableView>			 
		 * @param {Object} args An object whose keys are the IDs (in form '#id') of views to which the styles will be applied.
		 * @since 1.4.0

		 */
		updateViews: function(args) {
			var views = this.getViews();
			if(_.isObject(args)) {
				_.each(_.keys(args), function(key) {
					var elem = views[key.substring(1)];
					if (key.indexOf('#') === 0 && key !== '#' && _.isObject(elem) && typeof elem.applyProperties === 'function') {
						// apply the properties but make sure we're applying them to a Ti.UI object (not a controller)
						elem.applyProperties(args[key]);
					}
				});
			}
			return this;
		},

		/**
		 * @method addListener
		 * Add a tracked event listeners to a view proxy object.
		 *
		 * #### Example
		 * addEventListener wrapper, add an event to tracking target.

	$.addListener($.aView, 'click', onClick);

		 * @param {Object} [proxy] Proxy view object to listen to.
		 * @param {String} [type] Event type to listen to.
		 * @param {Function} [callback] Callback to receive event.
		 */
		addListener: function(proxy, type, callback) {
			if (!proxy.id) {
				proxy.id = _.uniqueId('__trackId');

				if (_.has(this.__views, proxy.id)) {
					Ti.API.error('$.addListener: ' + proxy.id + ' was conflict.');
					return;
				}
			}

			proxy.addEventListener(type, callback);
			this.__events.push({
				id: proxy.id,
				view: proxy,
				type: type,
				handler: callback
			});

			return proxy.id;
		},

		/**
		 * @method getListener
		 * Get the event listeners associated with a combination of
		 * view proxy object, event type.
		 *
		 * #### Example
		 * Get the all events.

	var listener = $.getListener();

		 * @param {Object} [proxy] Proxy view object to remove from.
		 * @param {String} [type] Event type to remove.
		 */

		getListener: function(proxy, type) {
			return _.filter(this.__events, function(event, index) {
				if ((!proxy || proxy.id === event.id) &&
					(!type || type === event.type)) {
					return true;
				}

				return false;
			});
		},

		/**
		 * @method removeListener
		 * Remove the event listeners associated with a combination of
		 * view proxy object, event type and/or callback.
		 *
		 * #### Example
		 * When is closed window, remove the all events.

	<Alloy>
		<Window onOpen="doOpen" onClose="doClose">
			<Label id="label" onClick="doClick">Hello, world</Label>
		</Window>
	</Alloy>		 

	function doClose() {
		$.removeListener();
	}
		 * @param {Object} [proxy] Proxy view object to remove from.
		 * @param {String} [type] Event type to remove.
		 * @param {Function} [callback] Callback to remove.
		 */
		removeListener: function(proxy, type, callback) {
			_.each(this.__events, function(event, index) {
				if ((!proxy || proxy.id === event.id) &&
					(!type || type === event.type) &&
					(!callback || callback === event.handler)) {
					event.view.removeEventListener(event.type, event.handler);
					delete self.__events[index];
				}
			});
			return this;
		}
	});
};
module.exports = Controller;
