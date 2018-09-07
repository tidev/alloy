var exec = require('child_process').exec,
	fs = require('fs-extra'),
	chmodr = require('chmodr'),
	os = require('os'),
	path = require('path'),
	JsDiff = require('diff'),
	_ = require('lodash'),
	babylon = require('@babel/parser'),
	U = require('../../Alloy/utils'),
	styler = require('../../Alloy/commands/compile/styler');

var alloyRoot = path.join(__dirname,'..','..');
var IS_WIN = /^win/i.test(os.platform());

exports.TIMEOUT_DEFAULT = IS_WIN ? 5000 : 3500;
exports.paths = {
	templates: path.join(alloyRoot,'Alloy','template'),
	harnessTemplate: path.join(alloyRoot,'test','projects','HarnessTemplate'),
	harness: path.join(alloyRoot,'test','projects','Harness')
};

// Recreate the test app harness
//
// Params:
// * callback: the callback function to be executed when the harness
//             is successfully recreated.
function resetTestApp(callback) {
	var paths = exports.paths;
	fs.removeSync(paths.harness);
	fs.mkdirpSync(paths.harness);
	chmodr.sync(paths.harness, 0777);
	fs.copySync(paths.harnessTemplate, paths.harness);
	exec('alloy new "' + paths.harness + '"', function(error, stdout, stderr) {
		if (error) {
			console.error('Failed to create new alloy project at ' + paths.harness);
			console.error(stderr);
			process.exit();
		}
		callback();
	});
}

// Turns the arguments given to the callback of the exec() function
// into an object literal.
//
// Params:
// * args: The "arguments" object from the callback of an exec() call
//
// Return: An object literal with the error, stdout, and stderr
function getExecObject(args) {
	args = Array.prototype.slice.call(args, 0);
	return {
		error: args[0],
		stdout: args[1],
		stderr: args[2]
	};
}

// Convenience function for handling asynchronous tests that rely on the
// exec() function. The output values from the first runs() block will
// be available as this.output in the second runs() block where the
// actual tests are evaluated.
//
// Params:
// * cmd:  The command to run through exec()
// * opts: An object that can contain the following parameters:
//     * timeout: How long to wait for the command to execute before declaring
//                the test failed
//     * test:    The actual test function to execute on output returned from exec()
//     * reset: If truthy, recreate the default test harness before executing
//
// Return: none
exports.asyncExecTest = function(cmd, opts) {
	opts = opts || {};

	runs(function() {
		var self = this;
		self.done = false;

		var asyncFunc = function() {
			exec(cmd, function() {
				self.done = true;
				self.output = getExecObject(arguments);
			});
		};

		if (opts.reset) {
			resetTestApp(function() {
				asyncFunc();
			});
		} else {
			asyncFunc();
		}
	});
	waitsFor(
		function() { return this.done; },
		'exec("' + cmd + '") timed out', opts.timeout || exports.TIMEOUT_DEFAULT
	);
	runs(opts.test || function() {
		expect(this.output.error).toBeNull();
	});
};

// Matchers for Jasmine

function toBeTssFile(expected) {
	var actual = this.actual;
	var style;

	try {
		var die = U.die;
		U.die = function(msg, e) {
			U.die = die;
			throw U.createErrorOutput(msg, e);
		};
		style = styler.loadStyle(actual);
		U.die = die;
	} catch (e) {
		U.die = die || U.die;
		return false;
	}

	if (_.isObject(style)) {
		return true;
	}
	return false;
}

function toBeJavascript(expected) {
	try {
		babylon.parse(this.actual);
		return true;
	} catch (e) {
		console.error(e);
		return false;
	}
}

function toBeJavascriptFile(expected) {
	var actual = this.actual;
	var notText = this.isNot ? " not" : "";
	this.message = function () {
		return "Expected " + actual + notText + " to be a Javascript file";
	};

	try {
		var js = fs.readFileSync(this.actual,'utf8');
		return toBeJavascript.call({actual:js}, expected);
	} catch (e) {
		return false;
	}
}

exports.addMatchers = function() {
	beforeEach(function() {
		this.addMatchers({
			toBeJavascript: toBeJavascript,
			toBeJavascriptFile: toBeJavascriptFile,
			toBeTssFile: toBeTssFile,
			toHaveNoUndefinedStyles: function() {
				return !_.find(this.actual, function(o) {
					return o.key === 'undefined' && o.isApi;
				});
			},
			toHaveSameContentAs: function(expected) {
				return U.normalizeReturns(fs.readFileSync(this.actual,'utf8')) ===
					U.normalizeReturns(fs.readFileSync(expected,'utf8'));
			},
			toExist: function(expected) {
				return path.existsSync(this.actual);
			},
			toBeArray: function(expected) {
				return _.isArray(this.actual);
			},
			toBeObject: function(expected) {
				return _.isObject(this.actual);
			},
			toNotDiff: function(expected, filename) {
				var pass = this.actual === expected;
				this.message = function() {
					return ["Expected to have no diff, but it does: \n\n" + JsDiff.createPatch(filename, expected, this.actual)];
				};
				return pass;
			}
		});
	});
};
