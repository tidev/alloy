/**
 * Local SQLite sync adapter which will store all models in
 * an on device database
 */
var _ = require("alloy/underscore")._, 
	db;

function InitDB()
{
	if (!db)
	{
		if (Ti.Platform.osname === 'mobileweb' || typeof Ti.Database === 'undefined') {
			throw "No support for Titanium.Database in MobileWeb environment";
		}
		else {
			db = Ti.Database.open("_alloy_");
		}
		module.exports.db = db;
		
		// create the table in case it doesn't exist
		db.execute("CREATE TABLE IF NOT EXISTS migrations (latest TEXT, model TEXT)");
	}
	return db;
}

function GetMigrationFor(table)
{
	var mid;
	// get the latest migratino
	var rs = db.execute("SELECT latest FROM migrations where model = ?",table);
	if (rs.isValidRow())
	{
		mid = rs.field(0);
	}
	rs.close();
	return mid;
}

function SQLiteMigrateDB()
{
	//TODO: we should move this into the codegen so we don't waste precious cpu cycles doing this
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
	
	this.createTable = function(name,config)
	{
		Ti.API.info("create table migration called for "+config.adapter.tablename);
		
		var self = this,
			columns = [];
			
		for (var k in config.columns)
		{
			columns.push(k + ' ' + self.column(config.columns[k]));
		}
			
		var sql = "CREATE TABLE "+config.adapter.tablename+" ( " + columns.join(",") + " )";
		Ti.API.info(sql);
		
		db.execute(sql);
	};
	
	this.dropTable = function(name)
	{
		Ti.API.info("drop table migration called for "+name);
		db.execute("DROP TABLE IF EXISTS "+name);
	};
}

function SQLSync(model)
{
	this.model = model;
	this.table = model.config.adapter.tablename;
	this.columns = model.config.columns;
	
	var self = this;
	
	this.read = function(opts)
	{
		var sql = "select rowid,* from "+self.table;
		var rs = db.execute(sql);
		var results = [];
		while(rs.isValidRow())
		{
			var o = {};
			_.times(rs.fieldCount(),function(c){
				var fn = rs.fieldName(c);
				if (fn!='rowid')
				{
					// don't place rowid in the model
					var rv = rs.field(c);
					o[fn]=rv;
				}
			});
			o.id = rs.fieldByName('rowid');
			var m = new self.model.model(o);
			results.push(m);
			rs.next();
		}
		rs.close();
		return results;
	};
	
	this.create = function(opts)
	{
		var names = [];
		var values = [];
		var q = [];
		for (var k in self.columns)
		{
			names.push(k);
			values.push(self.model.get(k));
			q.push("?");
		}
		var sql = "insert into "+self.table + " (" + names.join(",") + ") values (" +  q.join(",") +")";
		db.execute(sql,values);
		self.model.id = db.getLastInsertRowId();
	};
	
	this['delete'] = function(opts)
	{
		var sql = "delete from "+self.table+" where rowid = ?";
		db.execute(sql,self.model.id);
		self.model.id = null;
	};

}

function GetMigrationForCached(t,m)
{
	if (m[t])
	{
		return m[t];
	}
	var v = GetMigrationFor(t);
	if (v)
	{
		m[t] = v;
	}
	return v;
}

function Migrate(migrations)
{
	var prev;

	//TODO: check config for the right adapter and then delegate. for now just doing SQL
	var sqlMigration = new SQLiteMigrateDB;
	var migrationIds = {}; // cache for latest mid by model name
	
	db.execute("BEGIN;");
	
	// iterate through all our migrations and call up/down and the last migration should
	// have the up called but never the down -- the migrations come in pre sorted from
	// oldest to newest based on timestamp
	_.each(migrations,function(migration)
	{
		var mctx = {};
		migration(mctx);
		var mid = GetMigrationForCached(mctx.name,migrationIds);
		Ti.API.info("mid = "+mid+", name = "+mctx.name);
		if (!mid || mctx.id > mid)
		{
			Ti.API.info("Migration starting to "+mctx.id+" for "+mctx.name);
			if (prev && _.isFunction(prev.down))
			{
				prev.down(sqlMigration);
			}
			if (_.isFunction(mctx.up))
			{
				mctx.down(sqlMigration);
				mctx.up(sqlMigration);
			}
			prev = mctx;
		}
		else
		{
			Ti.API.info("skipping migration "+mctx.id+", already performed");
			prev = null;
		}
	});
	
	if (prev && prev.id)
	{
		db.execute("DELETE FROM migrations where model = ?",prev.name);
		db.execute("INSERT INTO migrations VALUES (?,?)",prev.id,prev.name);
	}
	
	db.execute("COMMIT;");
}

function Sync(model, method, opts)
{
	var sync = new SQLSync(model);
	return sync[method](opts);
}


module.exports.init = InitDB;
module.exports.migrate = Migrate;
module.exports.sync = Sync;
