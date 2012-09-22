/*
 * Ti.App.Properties sync adapter which will store all models locally
 */
var Alloy = require('alloy'),
	_ = require("alloy/underscore")._,
	TAP = Ti.App.Properties;

// make sure we have a unique list of IDs for adapter models
var idList = [],
	uniqueIdCounter = 1;
function getUniqueId(id) {
	if (!id || _.contains(idList,id)) {
		id = getUniqueId(uniqueIdCounter++);
	} 
	idList.push(id);
	return id;
};

function Sync(model, method, opts) {
	var prefix = model.config.adapter.collection_name ? model.config.adapter.collection_name : 'default';
	var regex = new RegExp("^(" + prefix + ")\\-(\\d+)$");

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
			model.reset(list);
			var maxId = _.max(_.pluck(list, 'id')); 
			model.maxId = (_.isFinite(maxId) ? maxId : 0) + 1;
		} else {
			// is model
			var obj = TAP.getObject(prefix + '-' + model.get('id'));
			model.set(obj);
		}	
	} 
	else if (method === 'create' || method === 'update') {
		TAP.setObject(prefix + '-' + model.get('id'), model.toJSON() || {});
	} else if (method === 'delete') {
		TAP.removeProperty(prefix + '-' + model.get('id'));
		model.clear();
	}
}

module.exports.sync = Sync;
module.exports.beforeModelCreate = function(config) {
	// make sure we have a populated model object
	config = config || {};
	config.columns = config.columns || {};
	config.defaults = config.defaults || {};

	// add this adapter's values
	config.columns.id = 'Int';
	config.defaults.id = getUniqueId();

	return config;
};
