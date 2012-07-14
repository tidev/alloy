
var 	   _ = require("alloy/underscore")._,
	Backbone = require("alloy/backbone");
	
exports._ = _;
exports.Backbone = Backbone;

// TODO: we might want to eliminate this as all sync operations can be handles
//       in the adapter-specific code
Backbone.Collection.notify = _.extend({}, Backbone.Events);

Backbone.sync = function(method, model, opts) {
	// Ti.API.info("sync called with method="+method+", model="+JSON.stringify(model)+", opts="+JSON.stringify(opts));
	// Ti.API.info("config => "+JSON.stringify(model.config));
	
	var m = (model.config || {});
	var type = (m.adapter ? m.adapter.type : null) || 'sql';

	require('alloy/sync/'+type).sync(model,method,opts);

	// TODO: we might want to eliminate this as all sync operations can be handles
	//       in the adapter-specific code
	Backbone.Collection.notify.trigger('sync', {method:method,model:model});
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

	// cosntruct the model based on the current adapter type
	if (migrations) { extendObj.migrations = migrations; }
    if (_.isFunction(adapter.beforeModelCreate)) { config = adapter.beforeModelCreate(config) || config; }
	var Model = Backbone.Model.extend(extendObj);
	config.Model = Model; // needed for fetch operations to initialize the collection from persistent store
	config.data = {}; // for localStorage or case where entire collection is needed to maintain store
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

