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

exports.optimizeStyle = function(styleList) {
	for (var style in styleList) {
		for (var key in styleList[style]) {
			var v = styleList[style][key];
			if (v == JSON_NULL || typeof(v)==='undefined' || typeof(v)==='null') {
				delete styleList[style][key];
			} 
		}
	}
}

function optimize(ast, defines, fn)
{
	try
	{
		platformDefines = defines;
		platformName = platformDefines.OS_IOS ? 'iPhone OS' : platformDefines.OS_ANDROID ? 'android' : platformDefines.OS_MOBILEWEB ? 'mobileweb' : 'unknown';
		var w = pro.ast_walker();
		return w.with_walkers(
			{
				"if" : processIf,
				"var" :processVar
			}
		, function()
		{
			return w.walk(ast);
		});
	}
	catch(E)
	{
		logger.error('Error compiling source ('+fn+'). '+E+'\n'+E.stack);
		return ast;
	}
}

exports.optimize = optimize;

// for testing only when run from the commandline - otherwise this is ignored when included as a module
if (require.main === module)
{
	function testCode(tryThis, matchThis, defines)
	{
		var ast = jsp.parse(tryThis);
		var newcode; 
		try
		{
			ast = optimize(ast,defines);
			newcode = pro.gen_code(ast,{beautify:false}); 
		}
		catch(E)
		{
			console.log('Error: '+E.stack);
		}
		if (newcode !== matchThis)
		{
			console.log('FAILED: '.red + tryThis + '\n\treturned: '.red + newcode + '\n\texpected: '.red + matchThis);
			//console.log(require('util').inspect(ast, false, null));
			return 0;
		}
		else
		{
			console.log('PASSED: '.green + tryThis);
			return 1;
		}
	}
	
	var iosDefines =  {
		OS_IOS : true,
		OS_ANDROID: false,
		OS_MOBILEWEB: false
	};
	
	var androidDefines =  {
		OS_IOS : false,
		OS_ANDROID: true,
		OS_MOBILEWEB: false
	};
	var defaultDefines = iosDefines;
	
	var tests = 
	[
		// make sure we didn't break normal conditionals and assigments
		['var a = Ti.Platform.name', 'var a="iPhone OS"', iosDefines],
		['var a = Ti.Platform.name', 'var a="android"', androidDefines],
		['var a = Ti.Platform.name=="iPhone OS" ? 1 : 0', 'var a=1', iosDefines],
		['var a = Ti.Platform.name=="iPhone OS", b', 'var a=1,b', iosDefines],
		['var a = Ti.Platform.name=="iPhone OS", b, c = 2', 'var a=1,b,c=2', iosDefines],
		['var a = Ti.Platform.name=="iPhone OS"', 'var a=1', iosDefines],
		['var a = Ti.Platform.name!="iPhone OS"', 'var a=1', androidDefines],
		['var a = Ti.Platform.name=="iPhone OS"', 'var a=0', androidDefines],
		['var a, b = Ti.Platform.name=="iPhone OS", c = 2;', 'var a,b=1,c=2', iosDefines],
		['var a = "1"', 'var a="1"', iosDefines],
		['var a = true', 'var a=true', iosDefines],
		['var a = 1', 'var a=1', iosDefines],
		['var a', 'var a', iosDefines],
		['var a = {}', 'var a={}', iosDefines],
		['var a = new Object', 'var a=new Object', iosDefines],
		['var a = new Object()', 'var a=new Object', iosDefines],
		['var a = Ti.Platform.name', 'var a="iPhone OS"', iosDefines],
		['var a = Ti.Platform.osname', 'var a="android"', androidDefines],
		['var a, b = 1, c = 2;', 'var a,b=1,c=2', iosDefines],
		['var a = 1;', 'var a=1', iosDefines],
		['var a =+1;', 'var a=+1', iosDefines],
		['var a =1+1;', 'var a=1+1', iosDefines],
		['var a = 1.0;', 'var a=1', iosDefines],
		['var a = 1.02;', 'var a=1.02', iosDefines],
		['var a = -1.02;', 'var a=-1.02', iosDefines],
		['var a = !1', 'var a=!1', iosDefines],
		['var a = true ? 1 : 0;', 'var a=true?1:0', iosDefines],
		["var num = isNaN(amount) || amount === '' || amount === null ? 0.00 : amount;", 'var num=isNaN(amount)||amount===""||amount===null?0:amount', iosDefines],
		
		// make sure we didn't break normal if conditions
		['if (true) { var a = 1; } else { var a = 2; }', "if(true){var a=1}else{var a=2}", iosDefines],
		
		// check platform conditionals (if/else)
		["if (Titanium.Platform.name === 'iPhone OS'){ var a = 1; } else { var a = 2; }","var a=1",iosDefines],
		["if (Titanium.Platform.name !== 'iPhone OS'){ var a = 2; } else { var a = 1; }","var a=1",iosDefines],
		["if (Titanium.Platform['name'] == 'iPhone OS'){ var a = 1; } else { var a = 2; }","var a=1",iosDefines],
		["if (Titanium.Platform['name'] == 'iPhone OS'){ var a = 1; } else { var a = 2; }","var a=1",iosDefines],

		["if (Ti.Platform.osname === 'android') var a = 1; else var a = 2;","var a=1;",androidDefines],
		
		["if (Titanium.Platform.name !== 'iPhone OS'){ var a = 1; } else { var a = 2; }","var a=1",androidDefines],
		["if (Titanium.Platform['name'] !== 'iPhone OS'){ var a = 1; } else { var a = 2; }","var a=1",androidDefines],
		
		// check platform conditional assignments
		["var platform = Ti.Platform['name'] === 'iPhone OS'", "var platform=1", iosDefines],
		["var platform = Ti.Platform[\"name\"] === 'iPhone OS'", "var platform=1", iosDefines],
		["var platform = Ti.Platform.name === 'iPhone OS'", "var platform=1", iosDefines],
		["var platform = Ti.Platform.name === 'iPhone OS'", "var platform=0", androidDefines],
		["var platform = (Ti.Platform.name === 'iPhone OS')", "var platform=1", iosDefines],
		["var platform = (Ti.Platform.name === 'iPhone OS') ? 1 : 0", "var platform=1", iosDefines],
		["var platform = (Ti.Platform.name === 'iPhone OS') ? true : false", "var platform=true", iosDefines],
		["var platform = (Ti.Platform.name === 'iPhone OS') ? 1 : 0", "var platform=0", androidDefines],
		["var platform = (Ti.Platform.name === 'iPhone OS') ? true : false", "var platform=false", androidDefines],
		["var platform = (Ti.Platform.name == 'iPhone OS') ? 'true' : 'false'", "var platform=\"true\"", iosDefines],
		["var platform = (Ti.Platform.name == 'iPhone OS') ? 'true' : 'false'", "var platform=\"false\"", androidDefines],
		["var platform = (Ti.Platform.osname == 'android') ? 'true' : 'false'", "var platform=\"true\"", androidDefines],
		["var platform = (Ti.Platform.osname == \"iphone\") ? 1 : 0", "var platform=Ti.Platform.osname==\"iphone\"?1:0", iosDefines],

	];
	
	var succeeded = 0;
	
	for (var c=0;c<tests.length;c++)
	{
		succeeded+=testCode(tests[c][0],tests[c][1],tests[c][2]);
	}
	
	console.log('[INFO] Executed '+tests.length+' tests. '+succeeded+' Passed, '+(tests.length-succeeded)+' Failed');
	process.exit(succeeded == tests.length ? 0 : 1);
}
