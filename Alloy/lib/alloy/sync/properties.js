/**
 * Ti.App.Properties sync adapter which will store all models locally
 */
var Alloy = require('alloy'),
	_ = require("alloy/underscore")._,
	TAP = Ti.App.Properties;

// make sure we have a unique list of IDs for adapter models
var idList = [],
	uniqueIdCounter = 1;
function getUniqueId(id) {
	id = id || uniqueIdCounter;
	if (_.include(idList,id)) {
		id = getUniqueId(uniqueIdCounter++);
	}	
	idList.push(id);
	return id;		
	
};


function InitAdapter(config) {
	var prefix = config.store.name ? config.store.name : 'default';
	var regex = new RegExp("^(" + prefix + ")\\-(\\d+)$");	
	
	_.each(TAP.listProperties(), function(prop) {
		var match = prop.match(regex);
		if (match !== null) {
			idList.push(parseInt(match[2]));
		}
	});
}


var adapter = function (model,options) {
	var prefix = model.config.store.name ? model.config.store.name : 'default';
	//var regex = new RegExp("^(" + prefix + ")\\-(\\w+)$");
	var regex = new RegExp('(\\b' + prefix + '\\-\\w*)','gi')
	
	var self=this;
	
	this.create= function (success) {
		success = success || function () {};
		if(!model.attributes[model.idAttribute]) {
			model.set(model.idAttribute, (model.attributes._id)?(prefix +'-'+model.attributes._id):(prefix +'-'+ getUniqueId()));
		}
		var id = (model.attributes[model.idAttribute] || model.attributes.id);
		var match = id.match(regex);
		if (match === null) {
			id = prefix+'-'+id;
		}		
		
		//TODO:redo an object with model.config.columns
		var save = model.toJSON();
		
		save.id=id;
		delete save._id;
		delete save._stores;
		
		TAP.setObject(id, save || {});
		model.id = id;
		model.attributes.id = id;
		success({});
	};

	this.update= function (success) {
		success = success || function () {};
		self.create(success);
	};

	this.destroy= function (success) {
		success = success || function () {};
		var id = (model.attributes[model.idAttribute] || model.attributes.id);
		var match = id.match(regex);
		if (match === null) {
			id = prefix+'-'+id;
			model.set(model.idAttribute, id);
		}
		TAP.removeProperty(id);
		model.clear();
		model.id = null;
	};

	this.find= function (success) {
		success = success || function () {};
		var id = (model.attributes[model.idAttribute] || model.attributes.id);
		var match = id.match(regex);
		if (match === null) {
			id = prefix+'-'+id;
			model.set(model.idAttribute, id);
		}	
		
		var obj = TAP.getObject(id);
		success(obj);
	};

	this.findAll= function (success) {
		success = success || function () {};
		var list = [];
		_.each(TAP.listProperties(), function(prop) {
			var match = prop.match(regex);
			if (match !== null) {
				list.push(TAP.getObject(prop));
			}
		});
		success(list);		
	};
}

module.exports.adapter = adapter;

module.exports.beforeModelCreate = function(config) {
	
	// make sure we have a populated model object
	config = config || {};
	config.columns = config.columns || {};
	config.defaults = config.defaults || {};

	// add this adapter's values
	config.columns.id = 'Int';
	InitAdapter(config);
	return config;
};
