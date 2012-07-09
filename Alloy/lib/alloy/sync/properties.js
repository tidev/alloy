/**
 * Ti.App.Properties sync adapter which will store all models locally
 */
var _ = require("alloy/underscore")._;

function TiAppPropertiesSync(model) {
	this.model = model;
	this.columns = model.config.columns;
	var self = this;

	this.create = function(opts) {
		_.each(self.columns, function(v,k) {
			Ti.App.Properties['set'+v](k, self.model.get(k));
		});
	};

	this.read = function(opts) {
		_.each(self.columns, function(v,k) {
			var obj = {};
			obj[k] = Ti.App.Properties['get'+v](k, self.model.config.defaults[k]);
			self.model.set(obj); 
		});
	};

	this.update = function(opts) {
		self.create(opts);
	};
	
	this['delete'] = function(opts) {
		// TODO: this ^^^
	};
}

function Sync(model, method, opts) {
	var sync = new TiAppPropertiesSync(model);
	return sync[method](opts);
}

module.exports.sync = Sync;