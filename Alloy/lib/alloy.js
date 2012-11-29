/**
 * @class Alloy
 * Top-level module for Alloy functions.
 * 
 */
var 	   _ = require('alloy/underscore')._,
	Backbone = require('alloy/backbone');
	
exports._ = _;
exports.Backbone = Backbone;

function ucfirst(text) {
    if (!text) { return text; }
    return text[0].toUpperCase() + text.substr(1);
};

// Ti.Analytics.featureEvent('alloy.start', {
// 	guid: Ti.Platform.id,
// 	tiversion: Ti.version,
// 	osname: Ti.Platform.osname,
// 	osversion: Ti.Platform.version,
// 	locale: Ti.Platform.locale
// });

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

			require('alloy/sync/'+type).sync(model,method,opts);
		}
	};

	var extendClass = {};

	// construct the model based on the current adapter type
	if (migrations) { extendClass.migrations = migrations; }
    if (_.isFunction(adapter.beforeModelCreate)) { config = adapter.beforeModelCreate(config) || config; }
	var Model = Backbone.Model.extend(extendObj, extendClass); 
	Model.prototype.config = config;
	if (_.isFunction(adapter.afterModelCreate)) { adapter.afterModelCreate(Model); }
	
	if (_.isFunction(modelDesc.extendModel)) {
		Model = modelDesc.extendModel(Model) || Model;
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

			require('alloy/sync/'+type).sync(model,method,opts);
		}
	};

	var Collection = Backbone.Collection.extend(extendObj); 
	var config = Collection.prototype.config = model.prototype.config;

	var type = (config.adapter ? config.adapter.type : null) || 'localDefault';
	var adapter = require('alloy/sync/'+type);
	if (_.isFunction(adapter.afterCollectionCreate)) { adapter.afterCollectionCreate(Collection); }

	if (_.isFunction(modelDesc.extendModel)) {
		Collection = modelDesc.extendCollection(Collection) || Collection;
	}
	
	return Collection;
};

exports.A = function(t, type, parent) {
	_.extend(t,Backbone.Events);
	
	(function() {
		
		// we are going to wrap addEventListener and removeEventListener
		// with on, off so we can use the Backbone events
		var al = t.addEventListener,
			rl = t.removeEventListener,
			oo = t.on,
			of = t.off,
			tg = t.trigger,
		   cbs = {},
		   ctx = _.extend({}, Backbone.Events);

		if (!al || !rl) {
			return;
		}

		t.trigger = function() {
			ctx.trigger.apply(ctx, Array.prototype.slice.apply(arguments));
		}

		t.on = function(e,cb,context) {
			var wcb = function(evt) {
				try {
					_.bind(tg,ctx,e,evt)();
				}
				catch(E) {
					Ti.API.error("Error triggering '"+e+"' event: "+E);
				}
			};

			if (!cbs[e]) {
				cbs[e] = {};
				if (OS_IOS) {
					al(e, wcb);
				} else {
					al.call(t, e, wcb);
				}
			}
			cbs[e][cb] = wcb;

			_.bind(oo,ctx,e,cb,context)();
		};

		t.off = function(e,cb,context) {
			var f = cbs[e] ? cbs[e][cb] : null;
			if (f) {
				_.bind(of,ctx,e,cb,context)();
				delete cbs[e][cb];
				
				if (cbs[e].length === 0) {
					delete cbs[e];
					if (OS_IOS) {
						rl(e, f);
					} else {
						rl.call(t, e, f);
					}
				}
				f = null;
			}
		};
		
	})();
	
	return t;
}

/**
 * @method getWidget
 * Factory method for instantiating a widget controller. Creates and returns an instance of the 
 * named widget.
 * @param {String} id Id of widget to instantiate.
 * @param {String} name Name of the view within the widget to instantiate ('widget' by default)
 * @param {*...} [args] Arguments to pass to the widget.
 * @return {Alloy.Controller} Alloy widget controller object.
 *
 * @deprecated 1.0 Use {Alloy#createWidget} instead
 */
exports.getWidget = function(id, name, args) {
	Ti.API.warn('Alloy.getWidget() is deprecated, use Alloy.createWidget() instead.');
	return exports.createWidget(id, name, args);
}

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
 * @method getController
 * Factory method for instantiating a controller. Creates and returns an instance of the 
 * named controller.
 * @param {String} name Name of controller to instantiate.
 * @param {*...} [args] Arguments to pass to the controller.
 * @return {Alloy.Controller} Alloy controller object.
 *
 * @deprecated 1.0 Use {Alloy#createController} instead
 */
exports.getController = function(name, args) {
	Ti.API.warn('Alloy.getController() is deprecated, use Alloy.createController() instead.');
	return exports.createController(name, args);
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
 * @method getModel
 * Factory method for instantiating a Backbone Model object. Creates and returns an instance of the 
 * named model.
 *
 * See [Backbone.Model](http://backbonejs.org/#Model) in the Backbone.js documentation for 
 * information on the methods and properties provided by the Model object.
 * @param {String} name Name of model to instantiate.
 * @param {*...} [args] Arguments to pass to the model.
 * @return {Backbone.Model} Backbone model object.
 *
 * @deprecated 1.0 Use {Alloy#createModel} instead
 */
exports.getModel = function(name, args) {
	Ti.API.warn('Alloy.getModel() is deprecated, use Alloy.createModel() instead.');
	return exports.createModel(name, args);
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
 * @method getCollection
 * Factory method for instantiating a Backbone collection of model objects. Creates and returns a
 * collection for holding the named type of model objects.
 *
 * See [Backbone.Collection](http://backbonejs.org/#Collection) in the Backbone.js
 * documentation for  information on the methods and  properties provided by the
 * Collection object.
 * @param {String} name Name of model to hold in this collection.
 * @param {*...} [args] Arguments to pass to the collection.
 * @return {Backbone.Collection} Backbone collection object.
 *
 * @deprecated 1.0 Use {Alloy#createCollection} instead
 */
exports.getCollection = function(name, args) {
	Ti.API.warn('Alloy.getCollection() is deprecated, use Alloy.createCollection() instead.');
	return exports.createCollection(name, args);
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
 * @property {Boolean} [readOnly=false] isTablet
 * `true` if the current device is a tablet.
 *
 */
exports.isTablet = (function() {
	if (OS_IOS) {
		return Ti.Platform.osname === 'ipad';
	}
	if (OS_ANDROID) {
		try {
			var psc = require('ti.physicalSizeCategory');
			return psc.physicalSizeCategory === 'large' ||
				   psc.physicalSizeCategory === 'xlarge';
		} catch(e) {
			Ti.API.warn('Could not find ti.physicalSizeCategory module, using fallback for Alloy.isTablet');
			return isTabletFallback();
		}
	} 
	if (OS_MOBILEWEB) {
		return !(Math.min(
			Ti.Platform.displayCaps.platformHeight,
			Ti.Platform.displayCaps.platformWidth
		) < 400);
	} 

	// Last resort. Don't worry, uglifyjs cleans up this dead code if necessary.
	return isTabletFallback();
})();

/**
 * @property {Boolean} [readOnly=false] isHandheld
 * `true` if the current device is a handheld device (not a tablet).
 *
 */
exports.isHandheld = !exports.isTablet;

if (OS_ANDROID) {
	exports.Android = {};
	exports.Android.menuItemCreateArgs = ['itemId','groupId','title','order'];
}
