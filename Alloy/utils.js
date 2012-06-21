// The island of misfit toys... for functions

var path = require('path'),
	fs = require('fs'),
	colors = require('colors'),
	wrench = require('wrench'),
	logger = require('./common/logger'),
	XMLSerializer = require("xmldom").XMLSerializer,
	jsp = require("./uglify-js/uglify-js").parser,
	pro = require("./uglify-js/uglify-js").uglify;

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
		fs.mkdirSync(p);
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

exports.die = function(msg) 
{
	logger.error(msg);
	process.exit(1);
}

exports.formatAST = function(ast,beautify)
{
	// use the general defaults from the uglify command line
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
	        defines: exports.defines,
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