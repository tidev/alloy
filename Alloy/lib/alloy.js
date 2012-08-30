
var 	   _ = require('alloy/underscore')._,
	Backbone = require('alloy/backbone'),
	STR = require('alloy/string');
	
exports._ = _;
exports.Backbone = Backbone;

Backbone.sync = function(method, model, opts) {
	var m = (model.config || {});
	var type = (m.adapter ? m.adapter.type : null) || 'sql';

	require('alloy/sync/'+type).sync(model,method,opts);
};

exports.M = function(name,config,modelFn,migrations) {
    var type = (config.adapter ? config.adapter.type : null) || 'sql';
    var adapter = require('alloy/sync/'+type);
    var extendObj = {
		defaults: config.defaults,
		validate: function(attrs) {
			if (typeof __validate !== 'undefined') {
				if (_.isFunction(__validate)) {
					for (var k in attrs) {
						var t = __validate(k, attrs[k]);
						if (!t) {
							return "validation failed for: "+k;
						}
					}
				}
			}
		}
	};

	var extendClass = {};

	// cosntruct the model based on the current adapter type
	if (migrations) { extendClass.migrations = migrations; }
    if (_.isFunction(adapter.beforeModelCreate)) { config = adapter.beforeModelCreate(config) || config; }
	var Model = Backbone.Model.extend(extendObj, extendClass); 
	Model.prototype.config = config;
	if (_.isFunction(adapter.afterModelCreate)) { adapter.afterModelCreate(Model); }
	
	// execute any custom scripts on the model
	Model = modelFn(Model) || Model;
	
	return Model;
};

exports.A = function(t,type,parent) {
	_.extend(t,Backbone.Events);
	
	(function() {
		
		// we are going to wrap addEventListener and removeEventListener
		// with on, off so we can use the Backbone events
		var al = t.addEventListener,
			rl = t.removeEventListener,
			oo = t.on,
			of = t.off,
			tg = t.trigger,
		   cbs = [],
		   ctx = {};

		t.on = function(e,cb,context) {
			var wcb = function(evt) {
				try {
					_.bind(tg,ctx,e,evt)();
				}
				catch(E) {
					Ti.API.error("Error triggering '"+e+"' event: "+E);
				}
			};
			cbs[cb]=wcb;

			if (OS_IOS) {
				al(e, wcb);
			} else {
				al.call(t, e, wcb);
			}

			_.bind(oo,ctx,e,cb,context)();
		};

		t.off = function(e,cb,context) {
			var f = cbs[cb];
			if (f) {
				_.bind(of,ctx,e,cb,context)();

				if (OS_IOS) {
					rl(e, f);
				} else {
					rl.call(t, e, f);
				}
				
				delete cbs[cb];
				f = null;
			}
		};
		
	})();
	
	return t;
}

exports.getWidget = function(id, name, args) {
	return new (require('alloy/widgets/' + id + '/controllers/' + (name || 'widget')))(args);
}

exports.getController = function(name, args) {
	return new (require('alloy/controllers/' + name))(args);
}

exports.getModel = function(name, args) {
	return new (require('alloy/models/' + STR.ucfirst(name)).Model)(args);
}

exports.getCollection = function(name, args) {
	return new (require('alloy/models/' + STR.ucfirst(name)).Collection)(args);
}

function isTabletFallback() {
	return !(Math.min(
		Ti.Platform.displayCaps.platformHeight,
		Ti.Platform.displayCaps.platformWidth
	) < 700);
}

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
	// TODO: this needs some help 
	if (OS_MOBILEWEB) {
		return !(Math.min(
			Ti.Platform.displayCaps.platformHeight,
			Ti.Platform.displayCaps.platformWidth
		) < 700);
	} 

	// Last resort. Don't worry, uglifyjs cleans up this dead code if necessary.
	return isTabletFallback();
})();

exports.isHandheld = !exports.isTablet;