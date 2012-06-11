/**
 * Local SQLite sync adapter which will store all models in
 * an on device database
 */
var _ = require("alloy/underscore")._,
	lastestMigrationId, 
	db;

function InitDB()
{
	if (!db)
	{
		module.exports.db = db = Ti.Database.open("_alloy");
		
		// create the table in case it doesn't exist
		db.execute("CREATE TABLE IF NOT EXISTS migrations (latest TEXT)");
				
		// get the latest migratino
		rs = db.execute("SELECT latest FROM migrations LIMIT 1");
		if (rs.isValidRow())
		{
			lastestMigrationId = rs.field(0);
		}
		rs.close();

		Ti.API.info("latest migration: "+lastestMigrationId);
	}
	return db;
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
		Ti.API.info("create table migration called for "+config.tablename);
		
		var self = this,
			columns = [];
			
		for (var k in config.columns)
		{
			columns.push(k + ' ' + self.column(config.columns[k]));
		}
			
		var sql = "CREATE TABLE "+config.tablename+" ( " + columns.join(",") + " )";
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
				var rv = rs.field(c);
				o[fn]=rv;
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

function Migrate(migrations)
{
	var prev;

	//TODO: check config for the right adapter and then delegate. for now just doing SQL
	//TODO: refactor this into SQLSync
	var sqlMigration = new SQLiteMigrateDB;
	
	db.execute("BEGIN;");
	
	// iterate through all our migrations and call up/down and the last migration should
	// have the up called but never the down -- the migrations come in pre sorted from
	// oldest to newest based on timestamp
	_.each(migrations,function(migration)
	{
		//TODO: skip calling migrations that are older than the migration in the db
		var mctx = {};
		migration(mctx);
		if (!lastestMigrationId || mctx.id > lastestMigrationId)
		{
			Ti.API.info("Migration starting to "+mctx.id);
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
		db.execute("DELETE FROM migrations");
		db.execute("INSERT INTO migrations VALUES (?)",prev.id);
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
