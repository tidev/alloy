// The island of misfit toys... for functions

var path = require('path'),
	fs = require('fs'),
	colors = require('colors'),
	wrench = require('wrench'),
	logger = require('./common/logger'),
	jsp = require("./uglify-js/uglify-js").parser,
	pro = require("./uglify-js/uglify-js").uglify;

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