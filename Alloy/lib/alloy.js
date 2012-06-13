
var 	   _ = require("alloy/underscore")._,
	Backbone = require("alloy/backbone"),
	SQLSync  = require("alloy/sync/sql");
	
module.exports._ = _;
module.exports.Backbone = Backbone;

Backbone.sync = function(method, model, opts)
{
	Ti.API.info("sync called with method="+method+", model="+JSON.stringify(model)+", opts="+JSON.stringify(opts));
	// Ti.API.info("config => "+JSON.stringify(model.config));
	
	var m = (model.config || {});
	var type = (m.adapter ? m.adapter.type : null) || 'sql';
	
	switch (type)
	{
		case 'sql':
		{
			return SQLSync.sync(model,method,opts);
		}
		default:
		{
			Ti.API.error("No sync adapter found for: "+type);
			break;
		}
	}
};

module.exports.M = function(name,config,modelFn,migrations)
{
	SQLSync.init();
	
	var Model = Backbone.Model.extend({
		
		defaults: config.defaults,
		
		validate: function(attrs) 
		{
			if (_.isFunction(this._validate))
			{
				for (var k in attrs)
				{
					var t = this._validate(k, attrs[k]);
					if (!t)
					{
						return "validation failed for: "+k;
					}
				}
			}
			return;
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
			al.call(t, e, wcb);
			_.bind(oo,ctx,e,cb,context)();
		};

		t.off = function(e,cb,context)
		{
			var f = cbs[cb];
			if (f)
			{
				_.bind(of,ctx,e,cb,context)();
				rl.call(t, e, f);
				delete cbs[cb];
				f = null;
			}
		};
		
	})();
	
	return t;
}

