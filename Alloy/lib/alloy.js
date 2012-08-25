
var 	   _ = require('alloy/underscore')._,
	Backbone = require('alloy/backbone'),
	STR = require('alloy/string');
	
exports._ = _;
exports.Backbone = Backbone;


Backbone.sync = function (method, model, options) {
	var success, error,result={};
	
	var defaultstore = model.config.stores._defaults || 'sql';
	var process=0,storeopts = {};

	var stores = [];
	stores.push(defaultstore);
	
	var doSync = function(adapter,callback) {
		adapter = new adapter(model,options);		
		switch(method) {
			case "create":	adapter.create(callback);
				break;
			case "update":	adapter.update(callback);
				break;
			case "delete":	adapter.destroy(callback);
				break;
			case "read":
				if(model.id || (model.attributes && model.attributes[model.idAttribute])) {
					adapter.find(callback);
				} else {
					adapter.findAll(callback);
				}
				break;
			default:
				//error?
		}	
	}	
	
	if(options.synchronize) {
		if(options.synchronize.options) {
			storeopts = options.synchronize.options;
		}
		if(options.synchronize.stores) {
			stores = options.synchronize.stores;
			
			if(_.first(stores) != defaultstore && _.indexOf(stores,defaultstore)!=-1) {
				stores.splice(stores.indexOf(defaultstore), 1);
				stores.unshift(defaultstore);
			}
		}
	}
		
	var callbackSuccess = function(resp) {
	   	process++;
		if (!options.parse) { // only for model
			resp = (_.isArray(resp))?resp[0] : resp;
			
			model.attributes._stores[model.config.store.type] = {
				id:model.attributes.id,
			}
			if(model.config.store.type == defaultstore) {
				result[model.attributes._alloyIdentifier] = resp;	
			} else if(!result[model.attributes._alloyIdentifier]) {
				result[model.attributes._alloyIdentifier] = resp;
			}	
			
		} else {
			for(k in resp) {
				var obj = resp[k];
				
				if(!obj._stores) {
					obj._stores = {};
				}
				if(model.config.store.type == defaultstore) {
					obj._stores[model.config.store.type] = {
						id:obj.id,
					};
					result[obj._alloyIdentifier]=obj;
				} else {
					if(result[obj._alloyIdentifier]) {
						result[obj._alloyIdentifier]._stores[model.config.store.type] = {
							id:obj.id,
						};
					} else {
						obj._stores[model.config.store.type] = {
							id:obj.id,
						};						
						result[obj._alloyIdentifier]=obj;
					}	
				}	
			}
		}
				
		delete model.config.store;
		if(process == stores.length) {
			result = _.values(result);
			
			if (!options.parse) {//only for model
				result=result[0];
			}
			options.success(result);
			result=[];
		} 
	};		

	if (!options.parse) { // only for model
		if(!model.attributes._alloyIdentifier) {
			model.attributes._alloyIdentifier = model.generateguid();
		}	
		if(!model.attributes._stores) {
			model.attributes._stores = {};
		}
	}	
	
	for(key in stores) {
		var store = stores[key];

		if(!_.has(model.config.stores, store)) {
			throw 'No support for '+ store +' persistence.';
		}

		if(method == 'create' || method == 'update' || method == 'delete') {
			if(!storeopts.sameId) {
				model.id=null;
				delete model.attributes.id;
			}			

			if(model.attributes._stores) {
				if(model.attributes._stores[store]) {
					var id = model.attributes._stores[store].id;
					model.id=id;
					model.attributes.id=id;		
				}
			}
		}

		model.config.store = {
			name:model.config.stores[store].name,
			type:store,
		};
		var adapter = require('alloy/sync/'+store).adapter;
		doSync(adapter,callbackSuccess);
	}
};

exports.M = function(name,config,modelFn,collectionFn,migrations) {
	//add internalIdentifier
	if(!config.columns._alloyIdentifier) {
		config.columns._alloyIdentifier='string';
	}
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
	// construct the model based on the current adapter type
	if (migrations) { extendClass.migrations = migrations; }
	var Model = Backbone.Model.extend(extendObj, extendClass);

	var c = {};
	for(store in config.stores) {
		if(store != '_defaults') {
			var optsstore = config.stores[store];
			config.store = {
				name:optsstore.name,
				configname:store,
			};			
			var adapter = require('alloy/sync/'+store);
			if (_.isFunction(adapter.beforeModelCreate)) { 
				var beforeConfig = adapter.beforeModelCreate(config);
				c = _.extend(c, beforeConfig);
			}
		    Model.prototype.config = c;	
			if (_.isFunction(adapter.afterModelCreate)) { 
				adapter.afterModelCreate(Model);
			}
			delete Model.prototype.config.store;
		}
	}

	Model = modelFn(Model) || Model;
	
	var Collection = Backbone.Collection.extend();
	Collection.prototype.config = Model.prototype.config;
	Collection = collectionFn(Collection) || Collection;
	
	return {
		model:Model,
		collection:Collection,
	};
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