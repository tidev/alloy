var jsp = require("../../uglify-js/uglify-js").parser,
	pro = require("../../uglify-js/uglify-js").uglify,
	fs = require('fs'),
	path = require('path'),
	U = require('../../utils.js'),
	_ = require("../../lib/alloy/underscore")._
;

function appendFileExt(p)
{
	var ext = p.substring(p.length-3);
	if (ext!='.js')
	{
		return p + '.js';
	}
	return p;
}

function makeFullPath(basedir,p)
{
	if (p.charAt(0)=='.' || p.charAt(0)=='/')
	{
		return appendFileExt(path.join(basedir,p));
	}
	var f = path.join(basedir,appendFileExt(p));
	if (fs.existsSync(f))
	{
		// check to see if it exists and if so, return
		return f;
	}
	// if we can't find the file, assume it's a built-in node_module and we should treat as-is
	return p;
}

function findAllRequires(fn,filterFn)
{
	var basedir = path.dirname(path.resolve(fn));
	var code = String(fs.readFileSync(fn,'utf-8'));
	var ast = jsp.parse(code); 
	var w = pro.ast_walker();
	var requires = [];
	
	function processCall() 
	{
		var entries = this[1];
		if (entries[0] == 'dot')
		{
			entries = entries[1];
		}
		if (entries[0]=='name' && entries[1]=='require')
		{
			var requirePath = makeFullPath(basedir,this[2][0][1]);
			if (filterFn && _.isFunction(filterFn))
			{
				// ask the filter if we should include this file in processing
				var fn = filterFn(requirePath);
				if (fn)
				{
					requirePath = fn;
				}
				else
				{
					return;
				}
			}
			requires.push(requirePath);
		}
	}

	w.with_walkers({"call" : processCall}, function()
	{
		return w.walk(ast);
	});
	
	return requires;
}

function trimExtension(f)
{
	var ext = f.substring(f.length-3);
	if (ext == '.js')
	{
		return f.substring(0,f.length-3);
	}
	return f;
}

function makeRequiresRelative(fn,resourcesDir,config)
{
	var basedir = path.dirname(path.resolve(fn));
	var code = String(fs.readFileSync(fn,'utf-8'));
	var ast = jsp.parse(code); 
	var w = pro.ast_walker();
	var requires = [];

	function processCall() 
	{
		var entries = this[1];
		if (entries[0] == 'dot')
		{
			entries = entries[1];
		}
		if (entries[0]=='name' && entries[1]=='require')
		{
			var name = this[2][0][1];
			var requirePath = makeFullPath(basedir,name);
			var relative = requirePath.substring(resourcesDir.length + 1);
			if (relative)
			{
				// re-write to be relative
				this[2][0][1] = trimExtension(relative);
			}
		}
		return this;
	}
	
	var ast = w.with_walkers({"call" : processCall}, function()
	{
		return w.walk(ast);
	});
	
	return U.formatAST(ast,config,fn);
}			

exports.findAllRequires = findAllRequires;
exports.makeRequiresRelative = makeRequiresRelative;




