
var 	   _ = require("alloy/underscore")._,
	Backbone = require("alloy/backbone"),
	SQLSync  = require("alloy/sync/sql"),
	FileSysSync  = require("alloy/sync/filesys"),
	osname   = Ti.Platform.osname;
	
module.exports._ = _;
module.exports.Backbone = Backbone;

Backbone.Collection.notify = _.extend({}, Backbone.Events);

Backbone.sync = function(method, model, opts) {
	// Ti.API.info("sync called with method="+method+", model="+JSON.stringify(model)+", opts="+JSON.stringify(opts));
	// Ti.API.info("config => "+JSON.stringify(model.config));
	
	var m = (model.config || {});
	var type = (m.adapter ? m.adapter.type : null) || 'sql';
	
	switch (type) {
		case 'sql': {
			SQLSync.sync(model,method,opts);
			break;
		}
		case 'filesystem': {
			FileSysSync.sync(model,method,opts);
			break;
		}
		default: {
			Ti.API.error("No sync adapter found for: "+type);
			return;
		}
	}

	Backbone.Collection.notify.trigger('sync', {method:method,model:model});
};

module.exports.M = function(name,config,modelFn,migrations) {
	
    var type = (config.adapter ? config.adapter.type : null) || 'sql';
    if (type == 'sql') { SQLSync.init(); }
	
	var Model = Backbone.Model.extend( {
		
		defaults: config.defaults,
		
		validate: function(attrs) 
		{
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
	});
	
	
	if (migrations && migrations.length > 0)
	{
		SQLSync.migrate(migrations);
	}

	Model.prototype.config = config;

	modelFn(Model);
	
	return Model;
};

module.exports.A = function(t,type,parent)
{
	_.extend(t,{nodeType:1, nodeName:type, parentNode: parent});
	_.extend(t,Backbone.Events);
	
	(function(){
		
		
		// we are going to wrap addEventListener and removeEventListener
		// with on, off so we can use the Backbone events
		var al = t.addEventListener,
			rl = t.removeEventListener,
			oo = t.on,
			of = t.off,
			tg = t.trigger,
		   cbs = [],
		   ctx = {};

		t.on = function(e,cb,context)
		{
			var wcb = function(evt)
			{
				try 
				{
					_.bind(tg,ctx,e,evt)();
				}
				catch(E) 
				{
					Ti.API.error("Error triggering '"+e+"' event: "+E);
				}
			};
			cbs[cb]=wcb;

			if (osname === 'android') {
				al.call(t, e, wcb);
			} else {
				al(e, wcb);
			}

			_.bind(oo,ctx,e,cb,context)();
		};

		t.off = function(e,cb,context)
		{
			var f = cbs[cb];
			if (f)
			{
				_.bind(of,ctx,e,cb,context)();

				if (osname === 'android') {
					rl.call(t, e, f);
				} else {
					rl(e, f);
				}
				
				delete cbs[cb];
				f = null;
			}
		};
		
	})();
	
	return t;
}

