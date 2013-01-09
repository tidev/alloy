var _ = require('alloy/underscore')._, 
	db;

var ALLOY_DB_DEFAULT = '_alloy_';

function S4() {
   return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
};

function guid() {
   return (S4()+S4()+'-'+S4()+'-'+S4()+'-'+S4()+'-'+S4()+S4()+S4());
};	

function InitAdapter(config) {
	if (!db) {
		if (Ti.Platform.osname === 'mobileweb' || typeof Ti.Database === 'undefined') {
			throw 'No support for Titanium.Database in MobileWeb environment.';
		}
		else {
			var dbfile = config.adapter.db;
			if (dbfile) {
				var rx = /^(\/{0,1})(.+)\.(.+)$/;
				var match = dbfile.match(rx);
				if (match !== null) {
					var file = (match[1] || '/') + match[2] + '.' + match[3];
					var name = match[2];
					db = Ti.Database.install(file, name);
				} else {
					// invalid db file name
				}
			} else {
				db = Ti.Database.open(ALLOY_DB_DEFAULT);
			}
		}
		module.exports.db = db;
		
		// create the migration table in case it doesn't exist
		db.execute('CREATE TABLE IF NOT EXISTS migrations (latest TEXT, model TEXT)');
	}
	return {};
}

function GetMigrationFor(table) {
	var mid;
	// get the latest migratino
	var rs = db.execute('SELECT latest FROM migrations where model = ?', table);
	if (rs.isValidRow()) {
		mid = rs.field(0);
	}
	rs.close();
	return mid;
}

function SQLiteMigrateDB() {
	//TODO: normalize columns at compile time - https://jira.appcelerator.org/browse/ALOY-222
	this.column = function(name)
	{
		switch(name)
		{
			case 'string':
			case 'varchar':
			case 'text':
			{
				return 'TEXT';
			}
			case 'int':
			case 'tinyint':
			case 'smallint':
			case 'bigint':
			case 'integer':
			{
				return 'INTEGER';
			}
			case 'double':
			case 'float':
			case 'real':
			{
				return 'REAL';
			}
			case 'blob':
			{
				return 'BLOB';
			}
			case 'decimal':
			case 'number':
			case 'date':
			case 'datetime':
			case 'boolean':
			{
				return 'NUMERIC';
			}
			case 'null':
			{
				return 'NULL';
			}
		}
		return 'TEXT';
	};
	
	this.createTable = function(config) {
		Ti.API.info('create table migration called for '+config.adapter.collection_name);
		
		var self = this,
			columns = [];
			
		for (var k in config.columns) {
			columns.push(k+" "+self.column(config.columns[k]));
		}
			
		var sql = 'CREATE TABLE IF NOT EXISTS '+config.adapter.collection_name+' ( '+columns.join(',')+',id' + ' )';
		Ti.API.info(sql);
		
		db.execute(sql);
	};
	
	this.dropTable = function(name) {
		Ti.API.info('drop table migration called for '+name);
		db.execute('DROP TABLE IF EXISTS '+name);
	};
}

function Sync(model, method, opts) {
	var table =  model.config.adapter.collection_name,
		columns = model.config.columns,
		resp = null;
	
	switch (method) {
		case 'create':
			resp = (function(){
				// Use idAttribute to account for something other then "id"
				// being used for the model's id.
				if (!model.id) {
	                model.id = guid();
	                model.set(model.idAttribute, model.id);
	            }
				
	            // Create arrays for insert query 
				var names = [], values = [], q = [];
				for (var k in columns) {
					names.push(k);
					values.push(model.get(k));
					q.push('?');
				}

				// Assemble create query
				var sql = "INSERT INTO " + table + " (" + names.join(",") + ",id) VALUES (" + q.join(",") + ",?)";
	            
				// add id as the last value to the query
	            values.push(model.id);

	            // execute the query and return the response
	            db.execute(sql, values);
	            return model.toJSON();
			})();
			break;
		case 'read':
			var sql = 'SELECT * FROM '+table;
			var rs = db.execute(sql);
			var len = 0;
			var values = [];
			while(rs.isValidRow())
			{
				var o = {};
                var fc = 0;

                // Pre-3.0.0, Android supported fieldCount as a property, iOS
                // supported it as a function. Post-3.0.0, both are a property.
				fc = _.isFunction(rs.fieldCount) ? rs.fieldCount() : rs.fieldCount;

				_.times(fc,function(c){
					var fn = rs.fieldName(c);
					o[fn] = rs.fieldByName(fn);
				});
				values.push(o);
				len++;
				rs.next();
			}
			rs.close();
			model.length = len;
			len === 1 ? resp = values[0] : resp = values;
			break;
	
		case 'update':
			var names = [];
			var values = [];
			var q = [];
			for (var k in columns)
			{
				names.push(k+'=?');
				values.push(model.get(k));
				q.push('?');
			}
			var sql = 'UPDATE '+table+' SET '+names.join(',')+' WHERE id=?';
			
		    var e = sql +','+values.join(',')+','+model.id;
		    values.push(model.id);
			db.execute(sql,values);
			resp = model.toJSON();
			break;

		case 'delete':
			var sql = 'DELETE FROM '+table+' WHERE id=?';
			db.execute(sql, model.id);
			model.id = null;
			resp = model.toJSON();
			break;
	}
    
    // process success/error handlers, if present
	if (resp) {
        _.isFunction(opts.success) && opts.success(resp);
        method === "read" && model.trigger("fetch");
    } else {
    	_.isFunction(opts.error) && opts.error("Record not found");
    }
	
}

function GetMigrationForCached(t,m) {
	if (m[t]) {
		return m[t];
	}
	var v = GetMigrationFor(t);
	if (v) {
		m[t] = v;
	}
	return v;
}

function Migrate(migrations, config) {
	var prev;
	var sqlMigration = new SQLiteMigrateDB;
	var migrationIds = {}; // cache for latest mid by model name
	
	db.execute('BEGIN;');
	
	if (migrations.length) {
		// iterate through all our migrations and call up/down and the last migration should
		// have the up called but never the down -- the migrations come in pre sorted from
		// oldest to newest based on timestamp
		_.each(migrations,function(migration) {
			var mctx = {};
			migration(mctx);
			var mid = GetMigrationForCached(mctx.name,migrationIds);
			Ti.API.info('mid = '+mid+', name = '+mctx.name);
			if (!mid || mctx.id > mid) {
				Ti.API.info('Migration starting to '+mctx.id+' for '+mctx.name);
				if (prev && _.isFunction(prev.down)) {
					prev.down(sqlMigration);
				}
				if (_.isFunction(mctx.up)) {
					mctx.down(sqlMigration);
					mctx.up(sqlMigration);
				}
				prev = mctx;
			}
			else {
				Ti.API.info('skipping migration '+mctx.id+', already performed');
				prev = null;
			}
		});
		
		if (prev && prev.id) {
			db.execute('DELETE FROM migrations where model = ?', prev.name);
			db.execute('INSERT INTO migrations VALUES (?,?)', prev.id,prev.name);
		}
	} else {
		sqlMigration.createTable(config);
	}
	
	db.execute('COMMIT;');
}

module.exports.sync = Sync;

module.exports.beforeModelCreate = function(config) {
	config = config || {};

    InitAdapter(config);

	return config;
};

module.exports.afterModelCreate = function(Model) {
	Model = Model || {};

	
	Model.prototype.config.Model = Model; // needed for fetch operations to initialize the collection from persistent store

	Migrate(Model.migrations, Model.prototype.config);

	return Model;
};



