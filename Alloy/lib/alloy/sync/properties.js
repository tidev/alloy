/**
 * Ti.App.Properties sync adapter which will store all models locally
 */
var Alloy = require('alloy'),
	_ = require("alloy/underscore")._;

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

function TiAppPropertiesSync(model) {
	var self = this;
	var prefix = model.config.adapter.prefix ? model.config.adapter.prefix + '-' : '';
	var id = getUniqueId(model.config.adapter.prefix); 
	var adapterName = 'TiAppPropertiesSync';

	// save the model and columns
	model.config.columns.id = 'String';
	model.config.defaults.id = id;
	this.model = model;
	this.columns = model.config.columns;

	function debug(funcName) {
		if (ENV_DEV) { Ti.API.debug(adapterName + '.' + funcName + '(): ' + JSON.stringify(self.model.attributes)); }
	}

	function setModel(opts) {
		_.each(self.columns, function(v,k) {
			Ti.App.Properties['set'+v](prefix + k, self.model.get(k));
		});
	}

	this.create = function(opts) {
		debug('create');
		setModel(opts);
	};

	this.read = function(opts) {
		debug('read');
		_.each(self.columns, function(v,k) {
			var obj = {};
			obj[k] = Ti.App.Properties['get'+v](prefix + k, self.model.config.defaults[k]);
			self.model.set(obj); 
		});
	};

	this.update = function(opts) {
		debug('update');
		setModel(opts);
	};
	
	this['delete'] = function(opts) {
		debug('delete');
		self.model.clear();
	};
}

function Sync(model, method, opts) {
	var sync = new TiAppPropertiesSync(model);
	return sync[method](opts);
}

module.exports.sync = Sync;