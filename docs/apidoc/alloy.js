/**
 * @class Alloy
 * Top-level module for Alloy functions.
 *
 * Alloy is an application framework built on top of the Titanium SDK designed to help rapidly
 * develop high quality applications and reduce maintenance.
 *
 * Alloy uses the model-view-controller architecture to separate the application into three
 * components:
 *
 *  * **Models** provide the data of the application. Alloy utilizes **Backbone Model and Collection**
 *     objects for this functionality.
 *
 *  * **Views** provide the UI components to interact with the application, written using **XML markup**
 *    and **Titanium Stylesheets (TSS)**, which abstracts the UI components of the Titanium API.
 *
 *  * **Controllers** provide the glue layer between the Model and View components as well as
 *    additional application logic using the **Alloy API** and **Titanium API**.
 *
 * The API documentation provided here is used with Alloy Controllers and Widget Controllers to
 * interact with the View and Model components of the application or widget.
 *
 * For guides on using Alloy, see
 * [Alloy Framework](http://docs.appcelerator.com/platform/latest/#!/guide/Alloy_Framework).
 */

/**
 * @method createWidget
 * Factory method for instantiating a widget controller. Creates and returns an instance of the
 * named widget.
 * @param {String} id Id of widget to instantiate.
 * @param {String} [name="widget"] Name of the view within the widget to instantiate ('widget' by default)
 * @param {Object} [args] Arguments to pass to the widget.
 * @return {Alloy.Controller} Alloy widget controller object.
 */

/**
 * @method createController
 * Factory method for instantiating a controller. Creates and returns an instance of the
 * named controller.
 * @param {String} name Name of controller to instantiate.
 * @param {Object} [args] Arguments to pass to the controller.
 * @return {Alloy.Controller} Alloy controller object.
 */

/**
 * @method createModel
 * Factory method for instantiating a Backbone Model object. Creates and returns an instance of the
 * named model.
 *
 * See [Backbone.Model](http://docs.appcelerator.com/backbone/0.9.2/#Model) in the Backbone.js documentation for
 * information on the methods and properties provided by the Model object.
 * @param {String} name Name of model to instantiate.
 * @param {Object} [args] Arguments to pass to the model.
 * @return {Backbone.Model} Backbone model object.
 */

/**
 * @method createCollection
 * Factory method for instantiating a Backbone collection of model objects. Creates and returns a
 * collection for holding the named type of model objects.
 *
 * See [Backbone.Collection](http://docs.appcelerator.com/backbone/0.9.2/#Collection) in the Backbone.js
 * documentation for  information on the methods and  properties provided by the
 * Collection object.
 * @param {String} name Name of model to hold in this collection.
 * @param {Object} [args] Arguments to pass to the collection.
 * @return {Backbone.Collection} Backbone collection object.
 */

/**
 * @property {Boolean} isTablet
 * `true` if the current device is a tablet.
 *
 */

/**
 * @property {Boolean} isHandheld
 * `true` if the current device is a handheld device (not a tablet).
 *
 */


/**
 * @property {Object} Globals
 * An object for storing globally accessible variables and functions.
 * Alloy.Globals is accessible in any controller in your app:
 *
 *     Alloy.Globals.someGlobalObject = { key: 'value' };
 *     Alloy.Globals.someGlobalFunction = function(){};
 *
 * Alloy.Globals can be accessed in other non-controller Javascript files
 * like this:
 *
 *     var theObject = require('/alloy').Globals.someGlobalObject;
 *
 */

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

 /*
 * Creates a singleton instance of a Model based on the given model, or
 * returns an existing instance if one has already been created.
 * Documented in docs/apidoc/model.js for docs site.
 */

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

 /*
 * Creates a singleton instance of a Collection based on the given model, or
 * returns an existing instance if one has already been created.
 * Documented in docs/apidoc/collection.js for docs site.
 */

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
 *     var theKey = require('/alloy').CFG.key;
 *
 */
