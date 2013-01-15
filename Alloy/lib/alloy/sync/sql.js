var _ = require('alloy/underscore')._, 
	util = require('alloy/sync/util');

// The database name used when none is specified in the 
// model configuration.
var ALLOY_DB_DEFAULT = '_alloy_';

// The sql-specific migration object, which is the main parameter
// to the up() and down() migration functions
function SQLiteMigrateDB() {
	//TODO: normalize columns at compile time - https://jira.appcelerator.org/browse/ALOY-222
	this.column = function(name) {
		// split into parts to keep additional column characteristics like
		// autoincrement, primary key, etc...
		var parts = name.split(/\s+/);
		var type = parts[0]
		switch(type.toLowerCase()) {
			case 'string':
			case 'varchar':
			case 'date':
			case 'datetime':
				Ti.API.warn('"' + type + '" is not a valid sqlite field, using TEXT instead');
			case 'text':
				type = 'TEXT';
				break;
			case 'int':
			case 'tinyint':
			case 'smallint':
			case 'bigint':
			case 'boolean':
				Ti.API.warn('"' + type + '" is not a valid sqlite field, using INTEGER instead');
			case 'integer':
				type = 'INTEGER';
				break;
			case 'double':
			case 'float':
			case 'decimal':
			case 'number':
				Ti.API.warn('"' + name + '" is not a valid sqlite field, using REAL instead');
			case 'real':
				type = 'REAL';
				break;
			case 'blob':
				type = 'BLOB';
				break;
			case 'null':
				type = 'NULL';
				break;
			default:
				type = 'TEXT';
				break;
		}
		parts[0] = type;
		return parts.join(' ');
	};
	
	this.createTable = function(config) {
		var table = config.adapter.collection_name;	
		var columns = [];
		for (var k in config.columns) {
			columns.push(k+" "+this.column(config.columns[k]));
		}
		var fields = columns.join(',');
		var sql = 'CREATE TABLE IF NOT EXISTS ' + table + ' ( ' + fields + ',id)';

		// execute the create
		var db = Ti.Database.open(config.adapter.db_name || ALLOY_DB_DEFAULT);
		db.execute(sql);
		db.close();
	};
	
	this.dropTable = function(config) {
		var db = Ti.Database.open(config.adapter.db_name || ALLOY_DB_DEFAULT);
		db.execute('DROP TABLE IF EXISTS ' + config.adapter.collection_name);
		db.close();
	};

	this.installDatabase = function(dbFile) {
		var db = Ti.Database.install(dbFile);
		db.close();
	}
}

function Sync(model, method, opts) {
	var table =  model.config.adapter.collection_name,
		columns = model.config.columns,
		dbName = model.config.adapter.db_name || ALLOY_DB_DEFAULT,
		resp = null,
		db;
	
	switch (method) {
		case 'create':
			resp = (function(){
				// Use idAttribute to account for something other then "id"
				// being used for the model's id.
				if (!model.id) {
	                model.id = util.guid();
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
	            values.push(model.id);

	            // execute the query and return the response
	            db = Ti.Database.open(dbName);
	            db.execute(sql, values);
	            db.close();

	            return model.toJSON();
			})();
			break;
		case 'read':
			// TODO: Allow custom queries. https://jira.appcelerator.org/browse/ALOY-458
			var sql = 'SELECT * FROM '+table;

			// execute the select query
			db = Ti.Database.open(dbName);
			var rs = db.execute(sql);

			var len = 0;
			var values = [];

			// iterate through all queried rows
			while(rs.isValidRow())
			{
				var o = {};
                var fc = 0;

                // Pre-3.0.0, Android supported fieldCount as a property, iOS
                // supported it as a function. Post-3.0.0, both are a property.
                // TODO: https://jira.appcelerator.org/browse/ALOY-459
				fc = _.isFunction(rs.fieldCount) ? rs.fieldCount() : rs.fieldCount;

				// create list of rows returned from query
				_.times(fc,function(c){
					var fn = rs.fieldName(c);
					o[fn] = rs.fieldByName(fn);
				});
				values.push(o);

				len++;
				rs.next();
			}

			// close off db after read query
			rs.close();
			db.close();

			// shape response based on whether it's a model or collection
			model.length = len;
			len === 1 ? resp = values[0] : resp = values;
			break;
	
		case 'update':
			var names = [];
			var values = [];
			var q = [];

			// create the list of columns
			for (var k in columns)
			{
				names.push(k+'=?');
				values.push(model.get(k));
				q.push('?');
			}

			// compose the update query
			var sql = 'UPDATE '+table+' SET '+names.join(',')+' WHERE ' + model.idAttribute + '=?';
		    //var e = sql +','+values.join(',')+','+model.id;
		    values.push(model.id);

		    // execute the update
		    db = Ti.Database.open(dbName);
			db.execute(sql,values);
			db.close();

			resp = model.toJSON();
			break;

		case 'delete':
			var sql = 'DELETE FROM '+table+' WHERE ' + model.idAttribute + '=?';

			// execute the delete
			db = Ti.Database.open(dbName);
			db.execute(sql, model.id);
			db.close();

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

// Gets the current saved migration
function GetMigrationFor(dbname, table) {
	var db = Ti.Database.open(dbname);
	db.execute('CREATE TABLE IF NOT EXISTS migrations (latest TEXT, model TEXT)');
	var rs = db.execute('SELECT latest FROM migrations where model = ?', table);
	if (rs.isValidRow()) {
		var mid = rs.field(0);
		rs.close();
		db.close()
		return mid;
	}
	db.close()
	return null;
}

function Migrate(Model) {
	// get list of migrations for this model
	var migrations = Model.migrations || [];

	// get a reference to the last migration
	var lastMigration = {};
	migrations.length && migrations[migrations.length-1](lastMigration);
	
	// Get config reference and a sql-specific migration processing object
	var config = Model.prototype.config;
	var sqliteMigrationDb = new SQLiteMigrateDB();

	// Get the migration number from the config, or use the number of 
	// the last migration if it's not present. If we still don't have a 
	// migration number after that, that means there are none. There's
	// no migrations to perform.
	var targetNumber = typeof config.adapter.migration === 'undefined' || 
		config.adapter.migration === null ? lastMigration.id : config.adapter.migration;
	if (typeof targetNumber === 'undefined' || targetNumber === null) {
		return;
	}

	// Get the db name for this model
	config.adapter.db_name || (config.adapter.db_name = ALLOY_DB_DEFAULT);
	
	// Create the migration tracking table if it doesn't already exist.
	// Get the current saved migration number.
	var currentNumber = GetMigrationFor(config.adapter.db_name, config.adapter.collection_name);

	// If the current and requested migrations match, the data structures
	// match and there is no need to run the migrations.
	var direction;
	if (currentNumber === targetNumber) {
		return;
	} else if (currentNumber > targetNumber) {
		direction = 0; // rollback
		migrations.reverse();
	} else {
		direction = 1;  // upgrade
	}

	// open db for our migration transaction
	db = Ti.Database.open(config.adapter.db_name);
	db.execute('BEGIN;');

	// iterate through all migrations based on the current and requested state, 
	// applying all appropriate migrations, in order, to the database.
	if (migrations.length) {
		for (var i = 0; i < migrations.length; i++) {
			// create the migration context
			var migration = migrations[i];
			var context = {};
			migration(context);

			// if upgrading, skip migrations higher than the target
			// if rolling back, skip migrations lower than the target
			if (direction && context.id > targetNumber) { break; }
			if (!direction && context.id <= targetNumber) { break; }

			// execute the appropriate migration function
			var funcName = direction ? 'up' : 'down';
			if (_.isFunction(context[funcName])) {
				context[funcName](sqliteMigrationDb, db);
			}		
		}
	} else {
		sqliteMigrationDb.createTable(config);
	}

	// update the saved migration in the db
	db.execute('INSERT OR REPLACE INTO migrations (latest,model) ' +
		       'VALUES ("' + targetNumber + '", "' + config.adapter.collection_name + '");');

	// end the migration transaction
	db.execute('COMMIT;');
	db.close();
}

module.exports.sync = Sync;

module.exports.beforeModelCreate = function(config) {
	// validate the current platform
	if (Ti.Platform.osname === 'mobileweb' || typeof Ti.Database === 'undefined') {
		throw 'No support for Titanium.Database in MobileWeb environment.';
	} 
	return config;
};

module.exports.afterModelCreate = function(Model) {
	Model || (Model = {});

	// needed for fetch operations to initialize the collection from persistent store
	//Model.prototype.config.Model = Model; 

	//Migrate(Model.migrations, Model.prototype.config);
	Migrate(Model);

	return Model;
};
