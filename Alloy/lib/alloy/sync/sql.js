var _ = require('alloy/underscore')._;

// The database name used when none is specified in the
// model configuration.
var ALLOY_DB_DEFAULT = '_alloy_';
var ALLOY_ID_DEFAULT = 'alloy_id';

function S4() {
	return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
}

function guid() {
	return (S4()+S4()+'-'+S4()+'-'+S4()+'-'+S4()+'-'+S4()+S4()+S4());
}

var cache = {
	config: {},
	Model: {}
};

// The sql-specific migration object, which is the main parameter
// to the up() and down() migration functions.
//
// db            The database handle for migration processing. Do not open
//               or close this as it is a running transaction that ensures
//               data integrity during the migration process.
// dbname        The name of the SQLite database for this model.
// table         The name of the SQLite table for this model.
// idAttribute   The unique ID column for this model, which is
//               mapped back to Backbone.js for its update and
//               delete operations.
function Migrator(config, transactionDb) {
	this.db = transactionDb;
	this.dbname = config.adapter.db_name;
	this.table = config.adapter.collection_name;
	this.idAttribute = config.adapter.idAttribute;

	//TODO: normalize columns at compile time - https://jira.appcelerator.org/browse/ALOY-222
	this.column = function(name) {
		// split into parts to keep additional column characteristics like
		// autoincrement, primary key, etc...
		var parts = name.split(/\s+/);
		var type = parts[0];
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
		// compose the create query
		var columns = [];
		var found = false;
		for (var k in config.columns) {
			if (k === this.idAttribute) { found = true; }
			columns.push(k + " " + this.column(config.columns[k]));
		}

		// add the id field if it wasn't specified
		if (!found && this.idAttribute === ALLOY_ID_DEFAULT) {
			columns.push(ALLOY_ID_DEFAULT + ' TEXT UNIQUE');
		}
		var sql = 'CREATE TABLE IF NOT EXISTS ' + this.table + ' ( ' + columns.join(',') + ')';

		// execute the create
		this.db.execute(sql);
	};

	this.dropTable = function() {
		this.db.execute('DROP TABLE IF EXISTS ' + this.table);
	};

	this.insertRow = function(columnValues) {
		var columns = [];
		var values = [];
		var qs = [];

		// get arrays of column names, values, and value placeholders
		var found = false;
		for (var key in columnValues) {
			if (key === this.idAttribute) { found = true; }
			columns.push(key);
			values.push(columnValues[key]);
			qs.push('?');
		}

		// add the id field if it wasn't specified
		if (!found && this.idAttribute === ALLOY_ID_DEFAULT) {
			columns.push(this.idAttribute);
			values.push(guid());
			qs.push('?');
		}

		// construct and execute the query
		this.db.execute('INSERT INTO ' + this.table + ' (' + columns.join(',') + ') VALUES (' + qs.join(',') + ');', values);
	};

	this.deleteRow = function(columns) {
		var sql = 'DELETE FROM ' + this.table;
		var keys = _.keys(columns);
		var len = keys.length;
		var conditions = [];
		var values = [];

		// construct the where clause, if necessary
		if (len) { sql += ' WHERE '; }
		for (var i = 0; i < len; i++) {
			conditions.push(keys[i] + ' = ?');
			values.push(columns[keys[i]]);
		}
		sql += conditions.join(' AND ');

		// execute the delete
		this.db.execute(sql, values);
	};
}

function Sync(method, model, opts) {
	var table =  model.config.adapter.collection_name,
		columns = model.config.columns,
		dbName = model.config.adapter.db_name || ALLOY_DB_DEFAULT,
		resp = null,
		db, sql;

	switch (method) {
		case 'create':
		case 'update':
			resp = (function() {
				var attrObj = {};

				if (!model.id) {
					model.id = model.idAttribute === ALLOY_ID_DEFAULT ? guid() : null;
					attrObj[model.idAttribute] = model.id;
					model.set(attrObj, { silent: true });
				}

				// assemble columns and values
				var names = [], values = [], q = [];
				for (var k in columns) {
					names.push(k);
					values.push(model.get(k));
					q.push("?");
				}

				// execute the query
				sql = "REPLACE INTO " + table + " (" + names.join(",") + ") VALUES (" + q.join(",") + ");";
				db = Ti.Database.open(dbName);
				db.execute('BEGIN;');
				db.execute(sql, values);

				// if model.id is still null, grab the last inserted id
				if (model.id === null) {
					var sqlId = "SELECT last_insert_rowid();";
					var rs = db.execute(sqlId);
					if (rs && rs.isValidRow()) {
						model.id = rs.field(0);
						attrObj[model.idAttribute] = model.id;
						model.set(attrObj, { silent: true });
					} else {
						Ti.API.warn('Unable to get ID from database for model: ' + model.toJSON());
					}
					if (rs) { rs.close(); }
				}

				// cleanup
				db.execute('COMMIT;');
				db.close();

				return model.toJSON();
			})();
			break;

		case 'read':
			// print warning about using both id and query
			if (opts.query && opts.id) {
				Ti.API.warn('Both "query" and "id" options were specified for model.fetch(). "id" will be ignored.');
			}

			// determine the query to execute
			sql = 'SELECT * FROM ' + table;
			if (opts.query) {
				sql = opts.query;
			} else if (opts.id) {
				sql += ' WHERE ' + (model.idAttribute ? model.idAttribute : ALLOY_ID_DEFAULT) + ' = ' + (_.isString(opts.id) ? '"' + opts.id + '"' : opts.id);
			}

			// execute the select query
			db = Ti.Database.open(dbName);
			var rs;

			// is it a string or a prepared statement?
			if (_.isString(sql)) {
				rs = db.execute(sql);
			} else {
				rs = db.execute(sql.statement, sql.params);
			}

			var len = 0;
			var values = [];

			// iterate through all queried rows
			while(rs.isValidRow())
			{
				var o = {};
        var fc = 0;

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
			if (len === 1) {
				resp = values[0];
			} else {
				resp = values;
			}
			break;

		case 'delete':
			sql = 'DELETE FROM '+table+' WHERE ' + model.idAttribute + '=?';

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
		if (_.isFunction(opts.success)) { opts.success(resp); }
		if (method === "read" && !opts.silent) { model.trigger("fetch", { fromAdapter: true }); }
  } else {
		if (_.isFunction(opts.error)) { opts.error(resp); }
  }

}

// Gets the current saved migration
function GetMigrationFor(dbname, table) {
	var mid = null;
	var db = Ti.Database.open(dbname);
	db.execute('CREATE TABLE IF NOT EXISTS migrations (latest TEXT, model TEXT);');
	var rs = db.execute('SELECT latest FROM migrations where model = ?;', table);
	if (rs.isValidRow()) {
		mid = rs.field(0) + '';
	}
	rs.close();
	db.close();
	return mid;
}

function Migrate(Model) {
	// get list of migrations for this model
	var migrations = Model.migrations || [];

	// get a reference to the last migration
	var lastMigration = {};
	if (migrations.length) { migrations[migrations.length-1](lastMigration); }

	// Get config reference
	var config = Model.prototype.config;

	// Get the db name for this model and set up the sql migration obejct
	config.adapter.db_name = config.adapter.db_name || ALLOY_DB_DEFAULT;
	var migrator = new Migrator(config);

	// Get the migration number from the config, or use the number of
	// the last migration if it's not present. If we still don't have a
	// migration number after that, that means there are none. There's
	// no migrations to perform.
	var targetNumber = typeof config.adapter.migration === 'undefined' ||
		config.adapter.migration === null ? lastMigration.id : config.adapter.migration;
	if (typeof targetNumber === 'undefined' || targetNumber === null) {
		var tmpDb = Ti.Database.open(config.adapter.db_name);
		migrator.db = tmpDb;
		migrator.createTable(config);
		tmpDb.close();
		return;
	}
	targetNumber = targetNumber + ''; // ensure that it's a string

	// Create the migration tracking table if it doesn't already exist.
	// Get the current saved migration number.
	var currentNumber = GetMigrationFor(config.adapter.db_name, config.adapter.collection_name);

	// If the current and requested migrations match, the data structures
	// match and there is no need to run the migrations.
	var direction;
	if (currentNumber === targetNumber) {
		return;
	} else if (currentNumber && currentNumber > targetNumber) {
		direction = 0; // rollback
		migrations.reverse();
	} else {
		direction = 1;  // upgrade
	}

	// open db for our migration transaction
	db = Ti.Database.open(config.adapter.db_name);
	migrator.db = db;
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
			if (direction) {
				if (context.id > targetNumber) { break; }
				if (context.id <= currentNumber) { continue; }
			} else {
				if (context.id <= targetNumber) { break; }
				if (context.id > currentNumber) { continue; }
			}

			// execute the appropriate migration function
			var funcName = direction ? 'up' : 'down';
			if (_.isFunction(context[funcName])) {
				context[funcName](migrator);
			}
		}
	} else {
		migrator.createTable(config);
	}

	// update the saved migration in the db
	db.execute('DELETE FROM migrations where model = ?', config.adapter.collection_name);
	db.execute('INSERT INTO migrations VALUES (?,?)', targetNumber, config.adapter.collection_name);

	// end the migration transaction
	db.execute('COMMIT;');
	db.close();
	migrator.db = null;
}

function installDatabase(config) {
	// get the database name from the db file path
	var dbFile = config.adapter.db_file;
	var table = config.adapter.collection_name;

	var rx = /(^|.*\/)([^\/]+)\.[^\/]+$/;
	var match = dbFile.match(rx);
	if (match === null) {
		throw 'Invalid sql database filename "' + dbFile + '"';
	}
	//var isAbsolute = match[1] ? true : false;
	config.adapter.db_name = config.adapter.db_name || match[2];
	var dbName = config.adapter.db_name;

	// install and open the preloaded db
	Ti.API.debug('Installing sql database "' + dbFile + '" with name "' + dbName + '"');
	var db = Ti.Database.install(dbFile, dbName);

	// set remoteBackup status for iOS
	if (config.adapter.remoteBackup === false && OS_IOS) {
		Ti.API.debug('iCloud "do not backup" flag set for database "'+ dbFile + '"');
		db.file.setRemoteBackup(false);
	}

	// compose config.columns from table definition in database
	var rs = db.execute('pragma table_info("' + table + '");');
	var columns = {}, cName, cType;
	if(rs) {
		while (rs.isValidRow()) {
			cName = rs.fieldByName('name');
			cType = rs.fieldByName('type');
			columns[cName] = cType;

			// see if it already has the ALLOY_ID_DEFAULT
			if (cName === ALLOY_ID_DEFAULT && !config.adapter.idAttribute) {
				config.adapter.idAttribute = ALLOY_ID_DEFAULT;
			}

			rs.next();
		}
		rs.close();
	} else {
		var idAttribute = (config.adapter.idAttribute) ? config.adapter.idAttribute : ALLOY_ID_DEFAULT;
		for (var k in config.columns) {
			cName = k;
			cType = config.columns[k];

			// see if it already has the ALLOY_ID_DEFAULT
			if (cName === ALLOY_ID_DEFAULT && !config.adapter.idAttribute) {
				config.adapter.idAttribute = ALLOY_ID_DEFAULT;
			} else if(k === config.adapter.idAttribute) {
				cType += " UNIQUE";
			}
			columns[cName] = cType;
		}
	}
	config.columns = columns;

	// make sure we have a unique id field
	if (config.adapter.idAttribute) {
		if (!_.contains(_.keys(config.columns), config.adapter.idAttribute)) {
			throw 'config.adapter.idAttribute "' + config.adapter.idAttribute + '" not found in list of columns for table "' + table + '"\n' +
				'columns: [' + _.keys(config.columns).join(',') + ']';
		}
	} else {
		Ti.API.info('No config.adapter.idAttribute specified for table "' + table + '"');
		Ti.API.info('Adding "' + ALLOY_ID_DEFAULT + '" to uniquely identify rows');

		var fullStrings = [],
			colStrings = [];
		_.each(config.columns, function(type, name) {
			colStrings.push(name);
			fullStrings.push(name + ' ' + type);
		});
		var colsString = colStrings.join(',');
		db.execute('ALTER TABLE ' + table + ' RENAME TO ' + table + '_temp;');
		db.execute('CREATE TABLE ' + table + '(' + fullStrings.join(',') + ',' + ALLOY_ID_DEFAULT + ' TEXT UNIQUE);');
		db.execute('INSERT INTO ' + table + '(' + colsString + ',' + ALLOY_ID_DEFAULT + ') SELECT ' + colsString + ',CAST(_ROWID_ AS TEXT) FROM ' + table + '_temp;');
		db.execute('DROP TABLE ' + table + '_temp;');
		config.columns[ALLOY_ID_DEFAULT] = 'TEXT UNIQUE';
		config.adapter.idAttribute = ALLOY_ID_DEFAULT;
	}

	// close the db handle
	db.close();
}

module.exports.beforeModelCreate = function(config, name) {
	// use cached config if it exists
	if (cache.config[name]) {
		return cache.config[name];
	}

	// check platform compatibility
	if (Ti.Platform.osname === 'mobileweb' || typeof Ti.Database === 'undefined') {
		throw 'No support for Titanium.Database in MobileWeb environment.';
	}

	// install database file, if specified
	if (config.adapter.db_file) { installDatabase(config); }
	if (!config.adapter.idAttribute) {
		Ti.API.info('No config.adapter.idAttribute specified for table "' + config.adapter.collection_name + '"');
		Ti.API.info('Adding "' + ALLOY_ID_DEFAULT + '" to uniquely identify rows');
		config.columns[ALLOY_ID_DEFAULT] = 'TEXT UNIQUE';
		config.adapter.idAttribute = ALLOY_ID_DEFAULT;
	}

	// add this config to the cache
	cache.config[name] = config;

	return config;
};

module.exports.afterModelCreate = function(Model, name) {
	// use cached Model class if it exists
	if (cache.Model[name]) {
		return cache.Model[name];
	}

	// create and migrate the Model class
	Model = Model || {};
	Model.prototype.idAttribute = Model.prototype.config.adapter.idAttribute;
	Migrate(Model);

	// Add the Model class to the cache
	cache.Model[name] = Model;

	return Model;
};

module.exports.sync = Sync;
