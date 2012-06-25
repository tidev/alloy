// The island of misfit toys... for functions

var path = require('path'),
	fs = require('fs'),
	colors = require('colors'),
	wrench = require('wrench'),
	logger = require('./common/logger'),
	XMLSerializer = require("xmldom").XMLSerializer,
	jsp = require("./uglify-js/uglify-js").parser,
	pro = require("./uglify-js/uglify-js").uglify,
	_ = require("./lib/alloy/underscore")._
;

exports.XML = {
	getNodeText: function(node) {
		var serializer = new XMLSerializer(),
			str = '';
		for (var c = 0; c < node.childNodes.length; c++) {
			if (node.childNodes[c].nodeType != 1) {
				str += serializer.serializeToString(node.childNodes[c]);
			}
		}
		return str;
	}
};

exports.properCase = function() {
	return n.charAt(0).toUpperCase() + n.substring(1);
};

exports.trim = function(line) {
	return String(line).replace(/^\s\s*/, '').replace(/\s\s*$/, '');
}

exports.resolveAppHome = function() {
	var f = path.join("./","app");
	if (path.existsSync(f))
	{
		return f;
	}
	var cf = path.join('./', 'alloy.jmk');
	if (path.existsSync(cf))
	{
		return path.resolve(path.join('.'));
	}
	exports.die("This directory: "+path.resolve(f)+" does not look like an Alloy directory");
}

// TODO: instead of dumping this full JSON in every file, create a commonjs
//       module for the config, then load it in each file. The loaded module
//       can then be assigned to CFG$ (or whatever else we want to name it)
exports.generateConfig = function(configDir, alloyConfig) {
	var cf = path.join(configDir,'config.json');
	if (path.existsSync(cf))
	{
		var jf = fs.readFileSync(cf);
		var j = JSON.parse(jf);
		var o = j.global || {};
		if (alloyConfig) {
			o = _.extend(o, j['env:'+alloyConfig.deploytype]);
			o = _.extend(o, j['os:'+alloyConfig.platform]);
		}
		return "CFG$ = " + JSON.stringify(o) + ";\n";
	}
	return '';
};

exports.processSourceCode = function(code, config) {
	var defines = {},
		DEFINES, ast;

	config = config || {};
	config.deploytype = config.deploytype || 'development';
	config.beautify = config.beautify || true;

	DEFINES = {
		OS_IOS : config.platform == 'ios',
		OS_ANDROID: config.platform == 'android',
		OS_MOBILEWEB: config.platform == 'mobileweb',
		ENV_DEV: config.deploytype == 'development',
		ENV_DEVELOPMENT: config.deploytype == 'development',
		ENV_TEST: config.deploytype == 'test',
		ENV_PRODUCTION: config.deploytype == 'production'
	};

	for (var k in DEFINES) {
		defines[k] = [ "num", DEFINES[k] ? 1 : 0 ];
	}
	
	ast = jsp.parse(code); // parse code and get the initial AST
	ast = pro.ast_mangle(ast,{except:['Ti','Titanium'],defines:defines}); // get a new AST with mangled names
	ast = pro.ast_squeeze(ast); // get an AST with compression optimizations
	
	return pro.gen_code(ast,{beautify:config.beautify}); 
};

exports.copyFileSync = function(srcFile, destFile) 
{
	var BUF_LENGTH = 64 * 1024, 
		buff, 
		bytesRead, 
		fdr, 
		fdw, 
		pos;
	buff = new Buffer(BUF_LENGTH);
	fdr = fs.openSync(srcFile, 'r');
	fdw = fs.openSync(destFile, 'w');
	bytesRead = 1;
	pos = 0;
	while (bytesRead > 0) {
		bytesRead = fs.readSync(fdr, buff, 0, BUF_LENGTH, pos);
		fs.writeSync(fdw, buff, 0, bytesRead);
		pos += bytesRead;
	}
	fs.closeSync(fdr);
	return fs.closeSync(fdw);
}

exports.ensureDir = function(p)
{
	if (!path.existsSync(p))
	{
		logger.debug("Creating directory: "+p);
		wrench.mkdirSyncRecursive(p, 0777);
	}
}

exports.copyFilesAndDirs = function(f,d)
{
	var files = fs.readdirSync(f);
	for (var c=0;c<files.length;c++)
	{
		var file = files[c];
		var fpath = path.join(f,file);
		var stats = fs.lstatSync(fpath);
		var rd = path.join(d,file);
		logger.debug('Copying ' + fpath.yellow + ' to '.cyan + d.yellow);
		if (stats.isDirectory())
		{
			exports.ensureDir(rd);
			wrench.copyDirSyncRecursive(fpath, rd);
		}
		else
		{
			exports.copyFileSync(fpath,rd);
		}
	}
}

exports.isTiProject = function(dir) 
{
	return (path.existsSync(path.join(dir,'tiapp.xml')));
}

exports.stringifyJSON = function(j)
{
	var ast = jsp.parse("("+JSON.stringify(j)+")");
	ast = pro.ast_mangle(ast);
	var final_code = pro.gen_code(ast,{beautify:true,quote_keys:true}); 
	return final_code = final_code.substring(1,final_code.length-2); // remove ( ) needed for parsing
}

exports.pad = function(x)
{
	if (x < 10)
	{
		return '0' + x;
	}
	return x;
}

exports.generateMigrationFileName = function(t)
{
	var d = new Date;
	var s = String(d.getUTCFullYear()) + String(exports.pad(d.getUTCMonth())) + String(exports.pad(d.getUTCDate())) + String(exports.pad(d.getUTCHours())) + String(exports.pad(d.getUTCMinutes())) + String(d.getUTCMilliseconds())
	return s + '_' + t + '.js';
}

exports.die = function(msg) 
{
	logger.error(msg);
	process.exit(1);
}

exports.formatAST = function(ast,beautify,config)
{
	// use the general defaults from the uglify command line
	var defines = {},
		DEFINES, 
		config;

	config = config || {};
	config.deploytype = config.deploytype || 'development';
	config.beautify = config.beautify || true;

	DEFINES = {
		OS_IOS : config.platform == 'ios',
		OS_ANDROID: config.platform == 'android',
		OS_MOBILEWEB: config.platform == 'mobileweb',
		ENV_DEV: config.deploytype == 'development',
		ENV_DEVELOPMENT: config.deploytype == 'development',
		ENV_TEST: config.deploytype == 'test',
		ENV_PRODUCTION: config.deploytype == 'production'
	};

	for (var k in DEFINES) {
		defines[k] = [ "num", DEFINES[k] ? 1 : 0 ];
	}

	var options = 
	{
	        ast: false,
	        consolidate: true,
	        mangle: true,
	        mangle_toplevel: false,
	        no_mangle_functions: false,
	        squeeze: true,
	        make_seqs: true,
	        dead_code: true,
	        unsafe: false,
	        defines: defines,
	        lift_vars: false,
	        codegen_options: {
	                ascii_only: false,
	                beautify: beautify,
	                indent_level: 4,
	                indent_start: 0,
	                quote_keys: false,
	                space_colon: false,
	                inline_script: false
	        },
	        make: false,
	        output: false,
			except: ['Ti','Titanium']
	};

	ast = pro.ast_mangle(ast,options); // get a new AST with mangled names
	ast = pro.ast_squeeze(ast); // get an AST with compression optimizations
	return pro.gen_code(ast,options.codegen_options); 
};

exports.formatJS = function(code, beautify)
{
	function show_copyright(comments) {
	        var ret = "";
	        for (var i = 0; i < comments.length; ++i) {
	                var c = comments[i];
	                if (c.type == "comment1") {
	                        ret += "//" + c.value + "\n";
	                } else {
	                        ret += "/*" + c.value + "*/";
	                }
	        }
	        return ret;
	};
    var c = jsp.tokenizer(code)();
	// extract header copyright so we can preserve it
    var copyrights = show_copyright(c.comments_before);
	var ast = jsp.parse(code); // parse code and get the initial AST
	return copyrights + "\n" + exports.formatAST(ast);
}