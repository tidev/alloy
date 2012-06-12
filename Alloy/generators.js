var path = require('path'),
	fs = require('fs'),
	wrench = require('wrench'),
	U = require('./utils'),
	logger = require('./common/logger'),
	_ = require('./lib/alloy/underscore')._;

exports.generateWidget = function(home,args,name,force) {
	// TODO: use name to give default values to widget
	// TODO: allow parameters at CLI to fill in manifest values
	var widgetPath = path.join(home,'widgets',name);
	if (path.existsSync(widgetPath) && !force) {
		U.die("File already exists: "+widgetPath);
	}

	wrench.mkdirSyncRecursive(widgetPath, 0777);
	wrench.mkdirSyncRecursive(path.join(widgetPath, 'views'), 0777);
	wrench.mkdirSyncRecursive(path.join(widgetPath, 'controllers'), 0777);
	wrench.mkdirSyncRecursive(path.join(widgetPath, 'styles'), 0777);
	
	fs.writeFileSync(path.join(widgetPath, 'widget.json'), U.stringifyJSON({
		"id": "com.default.widget",
		"name": "defaultwidget",
		"description" : "Default widget",
		"author": "",
		"version": "1.0",
		"copyright":"Copyright (c) 2012",
		"license":"Public Domain",
		"min-alloy-version": "1.0",
		"min-titanium-version":"2.0"
	}));
	fs.writeFileSync(path.join(widgetPath, 'views', 'widget.xml'), '<Widget version="1.0">\n\t<View id="defaultView"/>\n</Widget>');
	fs.writeFileSync(path.join(widgetPath, 'styles', 'widget.json'), U.stringifyJSON({
		"#defaultView": {
			"backgroundColor": "#fff"
		}
	}));
	fs.writeFileSync(path.join(widgetPath, 'controllers', 'widget.js'), '// do something!');

	logger.info('Generated widget named '+name);
}

exports.generateController = function(home,args,name,force)
{
	var cn = path.join(home,'controllers',name+'.js');
	if (path.existsSync(cn) && !force)
	{
		U.die("File already exists: "+cn);
	}
	
	// right now, it's empty.  we'll likely want to generate a skeleton
	var	C    = "\n";
	fs.writeFileSync(cn,C);

	logger.info('Generated controller named '+name);
}

exports.generateView = function(home,args,name,force)
{
	var vn = path.join(home,'views',name+'.xml');
	if (path.existsSync(vn) && !force)
	{
		U.die("File already exists: "+vn);
	}
	var sn = path.join(home,'styles',name+'.json');
	if (path.existsSync(sn) && !force)
	{
		U.die("File already exists: "+sn);
	}
	
	// right now, it's empty.  we'll likely want to generate a skeleton
	var XML  = "<?xml version='1.0'?>\n" +
			   "<View class='container'>\n" +
			   '\n' +
			   "</View>\n",
		JSON = "{\n" +
				 '   ".container":\n' +
				 '   {\n' +
				 '       "backgroundColor":"white"\n'+
				 '   }\n' +
		       "}\n";

	fs.writeFileSync(vn,XML);
	fs.writeFileSync(sn,JSON);

	logger.info('Generate view and styles named '+name);
}

function generateMigrationFileName(t)
{
	var d = new Date;
	var s = String(d.getUTCFullYear()) + String(U.pad(d.getUTCMonth())) + String(U.pad(d.getUTCDate())) + String(U.pad(d.getUTCHours())) + String(U.pad(d.getUTCMinutes())) + String(d.getUTCMilliseconds())
	return s + '_' + t + '.js';
}

exports.generateModel = function(home,args,name,force)
{
	var a = args.slice(1);
	var migrationsDir = path.join(home,'migrations');

	U.ensureDir(migrationsDir);
		
	if (a.length == 0)
	{
		U.die("missing model columns as fourth argument and beyond");
	}
	
	var J = {"columns":{},"defaults":{},"adapter":{"type":"sql","tablename":name}};
	for (var c=0;c<a.length;c++)
	{
		var X = a[c].split(":");
		J.columns[X[0]] = X[1];
	}
	
	var mn = path.join(home,'models',name+'.json');
	if (path.existsSync(mn) && !force)
	{
		U.die("File already exists: "+mn);
	}
	
	var code = U.stringifyJSON(J);
	fs.writeFileSync(mn,code);
	
	var mf = path.join( migrationsDir, generateMigrationFileName(name) );
	var mc = code.split("\n");
	
	var md = "" +
	'migration.up = function(db)\n'+
	'{\n'+
	'   db.createTable("' + name + '",\n';
	
	_.each(mc,function(l){
		md+='      '+l+'\n';
	});
	
	md+=''+
	'   );\n' +
	'};\n'+
	'\n'+
	'migration.down = function(db)\n'+
	'{\n'+
	'   db.dropTable("' + name + '");\n'+
	'};\n'+
	'\n';

	fs.writeFileSync(mf,md);

	logger.info('Generate model named '+name);
}

exports.generateMigration = function(home,args,name,force)
{
	var migrationsDir = path.join(home,'migrations');
	U.ensureDir(migrationsDir);
	
	var mf = path.join( migrationsDir, generateMigrationFileName(name) );

	var md = "" +
	'migration.up = function(db)\n'+
	'{\n'+
	'};\n'+
	'\n'+
	'migration.down = function(db)\n'+
	'{\n'+
	'};\n'+
	'\n';

	fs.writeFileSync(mf,md);

	logger.info('Generated empty migration named '+name);
}