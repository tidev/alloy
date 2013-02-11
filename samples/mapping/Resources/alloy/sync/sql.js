function S4() {
    return ((1 + Math.random()) * 65536 | 0).toString(16).substring(1);
}

function guid() {
    return S4() + S4() + "-" + S4() + "-" + S4() + "-" + S4() + "-" + S4() + S4() + S4();
}

function InitAdapter(config) {
    if (!db) {
        if (Ti.Platform.osname === "mobileweb" || typeof Ti.Database == "undefined") throw "No support for Titanium.Database in MobileWeb environment.";
        db = Ti.Database.open("_alloy_");
        module.exports.db = db;
        db.execute("CREATE TABLE IF NOT EXISTS migrations (latest TEXT, model TEXT)");
    }
    return {};
}

function GetMigrationFor(table) {
    var mid, rs = db.execute("SELECT latest FROM migrations where model = ?", table);
    rs.isValidRow() && (mid = rs.field(0));
    rs.close();
    return mid;
}

function SQLiteMigrateDB() {
    this.column = function(name) {
        switch (name) {
          case "string":
          case "varchar":
          case "text":
            return "TEXT";
          case "int":
          case "tinyint":
          case "smallint":
          case "bigint":
          case "integer":
            return "INTEGER";
          case "double":
          case "float":
          case "real":
            return "REAL";
          case "blob":
            return "BLOB";
          case "decimal":
          case "number":
          case "date":
          case "datetime":
          case "boolean":
            return "NUMERIC";
          case "null":
            return "NULL";
        }
        return "TEXT";
    };
    this.createTable = function(config) {
        Ti.API.info("create table migration called for " + config.adapter.collection_name);
        var self = this, columns = [];
        for (var k in config.columns) columns.push(k + " " + self.column(config.columns[k]));
        var sql = "CREATE TABLE IF NOT EXISTS " + config.adapter.collection_name + " ( " + columns.join(",") + ",id" + " )";
        Ti.API.info(sql);
        db.execute(sql);
    };
    this.dropTable = function(name) {
        Ti.API.info("drop table migration called for " + name);
        db.execute("DROP TABLE IF EXISTS " + name);
    };
}

function Sync(model, method, opts) {
    var table = model.config.adapter.collection_name, columns = model.config.columns, resp = null;
    switch (method) {
      case "create":
        var names = [], values = [], q = [];
        for (var k in columns) {
            names.push(k);
            values.push(model.get(k));
            q.push("?");
        }
        var id = guid(), sql = "INSERT INTO " + table + " (" + names.join(",") + ",id) VALUES (" + q.join(",") + ",?)";
        values.push(id);
        db.execute(sql, values);
        model.id = id;
        resp = model.toJSON();
        break;
      case "read":
        var sql = "SELECT * FROM " + table, rs = db.execute(sql), len = 0, values = [];
        while (rs.isValidRow()) {
            var o = {}, fc = 0;
            fc = _.isFunction(rs.fieldCount) ? rs.fieldCount() : rs.fieldCount;
            _.times(fc, function(c) {
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
      case "update":
        var names = [], values = [], q = [];
        for (var k in columns) {
            names.push(k + "=?");
            values.push(model.get(k));
            q.push("?");
        }
        var sql = "UPDATE " + table + " SET " + names.join(",") + " WHERE id=?", e = sql + "," + values.join(",") + "," + model.id;
        values.push(model.id);
        db.execute(sql, values);
        resp = model.toJSON();
        break;
      case "delete":
        var sql = "DELETE FROM " + table + " WHERE id=?";
        db.execute(sql, model.id);
        model.id = null;
        resp = model.toJSON();
    }
    if (resp) {
        _.isFunction(opts.success) && opts.success(resp);
        method === "read" && model.trigger("fetch");
    } else _.isFunction(opts.error) && opts.error("Record not found");
}

function GetMigrationForCached(t, m) {
    if (m[t]) return m[t];
    var v = GetMigrationFor(t);
    v && (m[t] = v);
    return v;
}

function Migrate(migrations, config) {
    var prev, sqlMigration = new SQLiteMigrateDB, migrationIds = {};
    db.execute("BEGIN;");
    if (migrations.length) {
        _.each(migrations, function(migration) {
            var mctx = {};
            migration(mctx);
            var mid = GetMigrationForCached(mctx.name, migrationIds);
            Ti.API.info("mid = " + mid + ", name = " + mctx.name);
            if (!mid || mctx.id > mid) {
                Ti.API.info("Migration starting to " + mctx.id + " for " + mctx.name);
                prev && _.isFunction(prev.down) && prev.down(sqlMigration);
                if (_.isFunction(mctx.up)) {
                    mctx.down(sqlMigration);
                    mctx.up(sqlMigration);
                }
                prev = mctx;
            } else {
                Ti.API.info("skipping migration " + mctx.id + ", already performed");
                prev = null;
            }
        });
        if (prev && prev.id) {
            db.execute("DELETE FROM migrations where model = ?", prev.name);
            db.execute("INSERT INTO migrations VALUES (?,?)", prev.id, prev.name);
        }
    } else sqlMigration.createTable(config);
    db.execute("COMMIT;");
}

var _ = require("alloy/underscore")._, db;

module.exports.sync = Sync;

module.exports.beforeModelCreate = function(config) {
    config = config || {};
    InitAdapter(config);
    return config;
};

module.exports.afterModelCreate = function(Model) {
    Model = Model || {};
    Model.prototype.config.Model = Model;
    Migrate(Model.migrations, Model.prototype.config);
    return Model;
};