
var 	   _ = require("alloy/underscore")._,
	Backbone = require("alloy/backbone");
	
	
module.exports._ = _;

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
			al(e, wcb);
			_.bind(oo,ctx,e,cb,context)();
		};

		t.off = function(e,cb,context)
		{
			var f = cbs[cb];
			if (f)
			{
				_.bind(of,ctx,e,cb,context)();
				rl(e, f);
				delete cbs[cb];
				f = null;
			}
		};
		
	})();
	
	return t;
}

//
//TODO: we need to check for db and migrations and then do the migrations if necessary (optimize if no models);
//TODO: we need to implement sizzle if we want a selector
//TODO: do we really need backbone for the models or maybe we can just plug the models into our model code?