/**
 * Ti.App.Properties sync adapter which will store all models locally
 */
var _ = require("alloy/underscore")._, 
	db;

function TiAppPropertiesSync(model) {
	this.model = model;
	this.table = model.config.adapter.tablename;
	this.columns = model.config.columns;

	var self = this;

	this.create = function(opts) {
		// need to increment 
		// model.set("id", Ti.App.guid);
		// var filename = model.config.adapter.filename;
		// var f = Titanium.Filesystem.getFile(Titanium.Filesystem.applicationDataDirectory, filename);
  //   	f.write(JSON.stringify(model));
	};

	this.read = function(opts) {
		var filename = model.config.adapter.filename;
		var f = Titanium.Filesystem.getFile(Titanium.Filesystem.applicationDataDirectory, filename);
		if (f.exists()) { Ti.API.info("Fetch results = " + f.read()); }
	};

	this.update = function(opts) {
		var filename = model.config.adapter.filename;
		var f = Titanium.Filesystem.getFile(Titanium.Filesystem.applicationDataDirectory, filename);
    	f.write(JSON.stringify(model));
	};
	
	this['delete'] = function(opts) {
		// var filename = model.config.adapter.filename;
		// var f = Titanium.Filesystem.getFile(Titanium.Filesystem.applicationDataDirectory, filename);
		// if (f.exists()) { f.deleteFile(); }
	};
}

function Sync(model, method, opts) {
	var sync = new TiAppPropertiesSync(model);
	return sync[method](opts);
}


module.exports.sync = Sync;