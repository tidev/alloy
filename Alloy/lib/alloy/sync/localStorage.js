/*
 * HTML5 localStorage sync adapter
 */
var _ = require('alloy/underscore')._;

function S4() {
   return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
}

function guid() {
   return (S4()+S4()+'-'+S4()+'-'+S4()+'-'+S4()+'-'+S4()+S4()+S4());
}

function InitAdapter() {
	if (!OS_MOBILEWEB) {
		throw 'localStorage persistence supported only with MobileWeb.';
	}
}

function Sync(method, model, opts) {
	var name = model.config.adapter.collection_name,
		data = model.config.data,
		resp = null;

	function storeModel(data) {
		localStorage.setItem(name, JSON.stringify(data));
	}

	switch (method) {

		case 'create':
			if (!model.id) {
				model.id = guid();
				model.set(model.idAttribute, model.id);
			}
			data[model.id] = model;
			storeModel(data);
			resp = model.toJSON();
			break;

		case 'read':
			var store = localStorage.getItem(name);
			var store_data = (store && JSON.parse(store)) || {};

            var len = 0;
            for (var key in store_data) {
				var m = new model.config.Model(store_data[key]);
				model.models.push(m);
				len++;
            }

            model.length = len;
            if (len === 1) {
				resp = model.models[0];
            } else {
				resp = model.models;
            }
			break;

		case 'update':
			data[model.id] = model;
			storeModel(data);
			resp = model.toJSON();
			break;

		case 'delete':
			delete data[model.id];
			storeModel(data);
			resp = model.toJSON();
			break;
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
	config = config || {};

	config.data = {}; // for localStorage or case where entire collection is needed to maintain store

	InitAdapter();

	return config;
};

module.exports.afterModelCreate = function(Model) {
	Model = Model || {};

	Model.prototype.config.Model = Model; // needed for fetch operations to initialize the collection from persistent store

	return Model;
};
