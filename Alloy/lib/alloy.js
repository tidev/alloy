/**
 * @class Alloy
 * Top-level module for Alloy functions.
 *
 */
var 	   _ = require('alloy/underscore')._,
	Backbone = require('alloy/backbone');

exports.version = '1.0.0';
exports._ = _;
exports.Backbone = Backbone;

function ucfirst(text) {
    if (!text) { return text; }
    return text[0].toUpperCase() + text.substr(1);
};

exports.M = function(name, modelDesc, migrations) {
	var config = modelDesc.config;
    var type = (config.adapter ? config.adapter.type : null) || 'localDefault';
    if (type === 'localDefault') {
    	type = OS_MOBILEWEB ? 'localStorage' : 'sql';
    }

	var adapter = require('alloy/sync/'+type);
    var extendObj = {
		defaults: config.defaults,
        sync: function(method, model, opts) {
			var config = model.config || {};
			var adapterObj = config.adapter || {};
			var type = (config.adapter ? config.adapter.type : null) || 'localDefault';
			if (type === 'localDefault') {
		    	type = OS_MOBILEWEB ? 'localStorage' : 'sql';
		    }

			require('alloy/sync/'+type).sync(method,model,opts);
		}
	};

	var extendClass = {};

	// construct the model based on the current adapter type
	if (migrations) { extendClass.migrations = migrations; }

	// Run the pre model creation code, if any
    if (_.isFunction(adapter.beforeModelCreate)) {
    	config = adapter.beforeModelCreate(config, name) || config;
    }

    // Create the Model object
	var Model = Backbone.Model.extend(extendObj, extendClass);
	Model.prototype.config = config;

	// Extend the Model with extendModel(), if defined
	if (_.isFunction(modelDesc.extendModel)) {
		Model = modelDesc.extendModel(Model) || Model;
	}

	// Run the post model creation code, if any
	if (_.isFunction(adapter.afterModelCreate)) {
		adapter.afterModelCreate(Model, name);
	}

	return Model;
};

exports.C = function(name, modelDesc, model) {
    var extendObj = {
		model: model,
        sync: function(method, model, opts) {
			var config = (model.config || {});
			var type = (config.adapter ? config.adapter.type : null) || 'localDefault';
			if (type === 'localDefault') {
		    	type = OS_MOBILEWEB ? 'localStorage' : 'sql';
		    }

			require('alloy/sync/'+type).sync(method,model,opts);
		}
	};

	var Collection = Backbone.Collection.extend(extendObj);
	var config = Collection.prototype.config = model.prototype.config;

	var type = (config.adapter ? config.adapter.type : null) || 'localDefault';
	var adapter = require('alloy/sync/'+type);
	if (_.isFunction(adapter.afterCollectionCreate)) { adapter.afterCollectionCreate(Collection); }

	if (_.isFunction(modelDesc.extendCollection)) {
		Collection = modelDesc.extendCollection(Collection) || Collection;
	}

	return Collection;
};

/**
 * @method createWidget
 * Factory method for instantiating a widget controller. Creates and returns an instance of the
 * named widget.
 * @param {String} id Id of widget to instantiate.
 * @param {String} name Name of the view within the widget to instantiate ('widget' by default)
 * @param {*...} [args] Arguments to pass to the widget.
 * @return {Alloy.Controller} Alloy widget controller object.
 */
exports.createWidget = function(id, name, args) {
	return new (require('alloy/widgets/' + id + '/controllers/' + (name || 'widget')))(args);
}

/**
 * @method createController
 * Factory method for instantiating a controller. Creates and returns an instance of the
 * named controller.
 * @param {String} name Name of controller to instantiate.
 * @param {*...} [args] Arguments to pass to the controller.
 * @return {Alloy.Controller} Alloy controller object.
 */
exports.createController = function(name, args) {
	return new (require('alloy/controllers/' + name))(args);
}

/**
 * @method createModel
 * Factory method for instantiating a Backbone Model object. Creates and returns an instance of the
 * named model.
 *
 * See [Backbone.Model](http://backbonejs.org/#Model) in the Backbone.js documentation for
 * information on the methods and properties provided by the Model object.
 * @param {String} name Name of model to instantiate.
 * @param {*...} [args] Arguments to pass to the model.
 * @return {Backbone.Model} Backbone model object.
 */
exports.createModel = function(name, args) {
	return new (require('alloy/models/' + ucfirst(name)).Model)(args);
}

/**
 * @method createCollection
 * Factory method for instantiating a Backbone collection of model objects. Creates and returns a
 * collection for holding the named type of model objects.
 *
 * See [Backbone.Collection](http://backbonejs.org/#Collection) in the Backbone.js
 * documentation for  information on the methods and  properties provided by the
 * Collection object.
 * @param {String} name Name of model to hold in this collection.
 * @param {*...} [args] Arguments to pass to the collection.
 * @return {Backbone.Collection} Backbone collection object.
 */
exports.createCollection = function(name, args) {
	return new (require('alloy/models/' + ucfirst(name)).Collection)(args);
}

function isTabletFallback() {
	return !(Math.min(
		Ti.Platform.displayCaps.platformHeight,
		Ti.Platform.displayCaps.platformWidth
	) < 700);
}

/**
 * @property {Boolean} isTablet
 * `true` if the current device is a tablet.
 *
 */
exports.isTablet = (function() {
	if (OS_IOS) {
		return Ti.Platform.osname === 'ipad';
	} else if (OS_ANDROID) {
		var psc = Ti.Platform.Android.physicalSizeCategory;
		return psc === Ti.Platform.Android.PHYSICAL_SIZE_CATEGORY_LARGE ||
		       psc === Ti.Platform.Android.PHYSICAL_SIZE_CATEGORY_XLARGE;
	} else if (OS_MOBILEWEB) {
		return !(Math.min(
			Ti.Platform.displayCaps.platformHeight,
			Ti.Platform.displayCaps.platformWidth
		) < 400);
	} else {
		return isTabletFallback();
	}
})();

/**
 * @property {Boolean} isHandheld
 * `true` if the current device is a handheld device (not a tablet).
 *
 */
exports.isHandheld = !exports.isTablet;

/**
 * @property {Object} Globals
 * An object for storing globally accessible variables and functions.
 * Alloy.CFG is accessible in any controller in your app:
 *
 *     Alloy.Globals.someGlobalObject = { key: 'value' };
 *     Alloy.Globals.someGlobalFunction = function(){};
 *
 * Alloy.Globals can be accessed in other non-controller Javascript files
 * like this:
 *
 *     var theObject = require('alloy').Globals.someGlobalObject;
 *
 */
exports.Globals = {};

/**
 * @property {Object} Models
 * An object for storing globally accessible Alloy models. Singleton models
 * created via markup will be stored on this object.
 *
 *     <Model src="myModel"/>
 *
 * The above markup would effectively generate the following code:
 *
 *     Alloy.Models.myModel = Alloy.createModel('MyModel');
 *
 * Alloy.Models.myModel would then be accessible in any controller in your app.
 *
 */
exports.Models = {};

/*
 * Creates a singleton instance of a Model based on the given model, or
 * returns an existing instance if one has already been created.
 * Documented in docs/apidoc/model.js for docs site.
 */
 exports.Models.instance = function(name) {
 	return exports.Models[name] || (exports.Models[name] = exports.createModel(name));
 };

/**
 * @property {Object} Collections
 * An object for storing globally accessible Alloy collections. Singleton collections
 * created via markup will be stored on this object.
 *
 *     <Collection src="myModel"/>
 *
 * The above markup would effectively generate the following code:
 *
 *     Alloy.Collections.myModel = Alloy.createCollection('MyModel');
 *
 * Alloy.Collections.myModel would then be accessible in any controller in your app.
 *
 */
exports.Collections = {};

/*
 * Creates a singleton instance of a Collection based on the given model, or
 * returns an existing instance if one has already been created.
 * Documented in docs/apidoc/collection.js for docs site.
 */
 exports.Collections.instance = function(name) {
 	return exports.Collections[name] || (exports.Collections[name] = exports.createCollection(name));
 };

/**
 * @property {Object} CFG
 * An object that stores Alloy configuration values as defined in your app's
 * app/config.json file. Here's what a typical config.json file might look
 * like in an Alloy app.
 *
 *     {
 *         "global": { "key": "defaultValue", "anotherKey": 12345 },
 *         "env:development": {},
 *         "env:test": {},
 *         "env:production": {},
 *         "os:ios": { "key": "iosValue" },
 *         "os:android": { "key": "androidValue" },
 *         "dependencies": {}
 *     }
 *
 * If this app was compiled for iOS, the Alloy.CFG would look like this:
 *
 *     Alloy.CFG = {
 *         "key": "iosValue",
 *         "anotherKey": 12345
 *     }
 *
 * Alloy.CFG is accessible in any controller in your app, and can be accessed
 * in other non-controller Javascript files like this:
 *
 *     var theKey = require('alloy').CFG.key;
 *
 */
exports.CFG = require('alloy/CFG');

if (OS_ANDROID) {
	exports.Android = {};
	exports.Android.menuItemCreateArgs = ['itemId', 'groupId', 'title', 'order', 'actionView', 'checkable', 'checked', 'enabled', 'icon', 'showAsAction', 'titleCondensed', 'visible'];
}
