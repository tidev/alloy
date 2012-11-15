/** 
 * Code in this file will attempt to optimize generated code so it's more compact
 * and executes faster, better, etc.
 */
var jsp = require("../../uglify-js/uglify-js").parser,
	pro = require("../../uglify-js/uglify-js").uglify,
	_ = require('../../lib/alloy/underscore')._,
	util = require('util'),
	colors = require('colors'),
	logger = require('../../common/logger.js'),
	U = require('../../utils'),
	platformDefines,
	platformName
;

var JSON_NULL = JSON.parse('null');
var EQUALITY_SIGNS = {
	'==': 1,
	'===': 1,
	'!=':1,
	'!==':1
};

function getVariableStringValue(a)
{
	var e = a;
	var p = '';
	while(e[0]==='dot' || e[0]==='name' || e[0]==='string' || e[0]==='sub')
	{
		if (e[0]==='sub') // sub is like foo['bar'] which we turn to foo.bar
		{
			p = e[2][1] + '.' + p;
		}
		else
		{
			p = (e[0] == 'dot' ? e[2] : e[1]) + '.' + p;
		}
		e = e[1];
	}
	return p.substring(0,p.length-1);
}

function isEqualityOperation(v)
{
	return (v in EQUALITY_SIGNS);
}

function isEqualOp(v)
{
	return (v === '===' || v === '==');
}

function removeCode()
{
	return ['block'];  // this is effectively an empty code block
}

function falseVar(name)
{ 
	return ['var', [ [ name, [ 'num', 0 ] ] ] ];  // this is effectively "false"
}

var VAR_IGNORES = {
	num:1,
	string:1,
	name:1,
	object:1,
	new:1
}

function processVarEntry()
{
	var rhs = this[1][0];
	if (rhs.length === 1)
	{
		// this is a variable declaration with no assignment
		return this;
	}
	if (rhs[1][0] in VAR_IGNORES)
	{
		return this;
	}
	if (rhs[1][0] == 'dot')
	{
		var varname = getVariableStringValue(rhs[1]);
		if (varname == 'Ti.Platform.name' || varname == 'Titanium.Platform.name')
		{
			return ["var",[[rhs[0],["string",platformName]]]]
		}
		if ((varname == 'Ti.Platform.osname' || varname == 'Titanium.Platform.osname') &&
			platformDefines.OS_ANDROID && platformName === 'android')
		{
			return ["var",[[rhs[0],["string","android"]]]]
		}
		if ((varname == 'Ti.Platform.osname' || varname == 'Titanium.Platform.osname') &&
			platformDefines.OS_MOBILEWEB && platformName === 'mobileweb')
		{
			return ["var",[[rhs[0],["string","mobileweb"]]]]
		}
	}
	var isConditionalAssignment;
	try
	{
		isConditionalAssignment = this[1][0][1][0]=='conditional';
	}
	catch(E)
	{
		console.log(this[1])
		console.log(JSON.stringify(this));
		console.log(E.stack);
	}
	var hasSimpleAssignment = !isConditionalAssignment && this[1][0][1][0]!='binary';
	if (hasSimpleAssignment)
	{
		return this;
	}
	if (isConditionalAssignment)
	{
		var entry = this[1][0][1][1];
		if (entry[0]=='name') // skip if normal conditional
		{
			return this;
		}
		// console.log(entry)
		var ifTrue = this[1][0][1][2];
		var ifFalse = this[1][0][1][3];
		var result = processIf.call([[],entry]);
		if (result === null)
		{
			return this;
		}
		if (result[0] == 'block')
		{
			return ['var', [ [ this[1][0][0], ifFalse ] ] ];
		}
		else if (result[0] === 'num')
		{
			return ['var', [ [ this[1][0][0], result[1] ? ifTrue : ifFalse ] ] ];
		}
	}
	var result = processIf.call(this[1][0]);
	if (result===null)
	{
		return this;
	}
	if (result[0]=='block' && result.length == 1)
	{
		// this is a deadcode removal indicator, return false
		return falseVar(this[1][0][0]);
	}
	else
	{
		// return the result as the value of the variable
		return ['var', [ [ this[1][0][0], result ] ] ];
	}
}

function processVar()
{	
	var entries = this[1];
	for (var c=0;c<entries.length;c++)
	{
		try
		{
			if (entries[c][1]!==null)
			{
				var result = processVarEntry.call([this[0], [entries[c]]])[1][0];
				entries[c] = result;
			}
		}
		catch(E)
		{
			console.log('error trying to parse => '+JSON.stringify(this));
			console.log('error at this line => '+JSON.stringify(entries[c]));
			return this;
		}
	}
	return this;
}

function processIf() 
{
	// if [0]
	// binary [1],
	// iflogic [2],
	// elselogic [3]
	if (this[1][0] === 'binary' && isEqualityOperation(this[1][1]))
	{
		var lhs = this[1][2];
		var rhs = this[1][3];
		var op = this[1][1];

		// right hand must be a string
		if (rhs[0] !== 'string') {
			return null;
		}

		var varName = getVariableStringValue(lhs);
		var value = getVariableStringValue(rhs);
		
		if ((varName === 'Titanium.Platform.osname' || varName === 'Ti.Platform.osname') && (value === 'iphone' || value === 'ipad'))
		{
			// TODO: make compile time "universal" distinction btw iphone and ipad - https://jira.appcelerator.org/browse/ALOY-223
			return null;
		}
		
		if (varName === 'Titanium.Platform.name' || varName === 'Ti.Platform.name' || (varName === 'Ti.Platform.osname' && value === 'android'))
		{
			if ((isEqualOp(op) && value === platformName) || (!isEqualOp(op) && value!== platformName))
			{
				if (this[2])
				{
					return this[2][1][0];
				}
				return ['num',1]; // this is effectively "true"
			}
			else
			{
				var elseLogic = this[3];
				if (elseLogic)
				{
					return this[3][1][0];
				}
				else
				{
					return removeCode();
				}
			}
		}
	}
	return null;
}

// strips null and undefined values out of Alloy styles
exports.optimizeStyle = function(styleList) {
	for (var style in styleList) {
		for (var key in styleList[style]) {
			var v = styleList[style][key];
			if (v == JSON_NULL || typeof(v) === 'undefined' || typeof(v) === 'null') {
				delete styleList[style][key];
			} 
		}
	}
}

// main function for optimizing runtime Titanium Javascript code
function optimize(ast, defines, fn) {
	try {
		platformDefines = defines;

		// determine platform name from defines
		if (platformDefines.OS_IOS) { platformName = 'iPhone OS'; }
		else if (platformDefines.OS_ANDROID) { platformName = 'android'; }
		else if (platformDefines.OS_MOBILEWEB) { platformName = 'mobileweb'; }
		else { platformName = 'unknown'; }

		// walk the AST looking for ifs and vars
		var w = pro.ast_walker();
		return w.with_walkers({
				"if" : processIf,
				"var" :processVar
		}, function() {
			return w.walk(ast);
		});
	} catch (e) {
		logger.error('Error compiling source (' + fn + '). ' + e + '\n' + e.stack);
		return ast;
	}
}

exports.optimize = optimize;

