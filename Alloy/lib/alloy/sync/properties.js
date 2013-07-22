var Alloy = require('alloy'),
	_ = require("alloy/underscore")._,
	TAP = Ti.App.Properties;

function S4() {
   return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
}

function guid() {
   return (S4()+S4()+'-'+S4()+'-'+S4()+'-'+S4()+'-'+S4()+S4()+S4());
}

function Sync(method, model, opts) {
	var prefix = model.config.adapter.collection_name ? model.config.adapter.collection_name : 'default';
	var regex = new RegExp("^(" + prefix + ")\\-(.+)$");
	var resp = null;

	if (method === 'read') {
		if (opts.parse) {
			// is collection
			var list = [];
			_.each(TAP.listProperties(), function(prop) {
				var match = prop.match(regex);
				if (match !== null) {
					list.push(TAP.getObject(prop));
				}
			});
			resp = list;
		} else {
			// is model
			var obj = TAP.getObject(prefix + '-' + model.id);
			model.set(obj);
			resp = model.toJSON();
		}
	}
	else if (method === 'create' || method === 'update') {
		if (!model.id) {
			model.id = guid();
			model.set(model.idAttribute, model.id);
		}
		TAP.setObject(prefix + '-' + model.id, model.toJSON() || {});
		resp = model.toJSON();
	} else if (method === 'delete') {
		TAP.removeProperty(prefix + '-' + model.id);
		model.clear();
		resp = model.toJSON();
	}

	// process success/error handlers, if present
	if (resp) {
        if (_.isFunction(opts.success)) { opts.success(resp); }
        if (method === "read") { model.trigger("fetch"); }
    } else {
		if (_.isFunction(opts.error)) { opts.error(resp); }
    }
}

module.exports.sync = Sync;
module.exports.beforeModelCreate = function(config) {
	// make sure we have a populated model object
	config = config || {};
	config.columns = config.columns || {};
	config.defaults = config.defaults || {};

	// give it a default id if it doesn't exist already
	if (typeof config.columns.id === 'undefined' || config.columns.id === null) {
		config.columns.id = 'String';
	}

	return config;
};
