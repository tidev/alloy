var exec = require('child_process').exec,
	fs = require('fs'),
	path = require('path'),
	jsp = require("../../Alloy/uglify-js/uglify-js").parser;

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
// * cmd:     The command to run through exec()
// * timeout: How long to wait for the command to execute before declaring 
//            the test failed
// * testFn:  The actual test function to execute on output returned from exec()
//
// Return: none
exports.asyncExecTest = function(cmd, timeout, testFn) {
	//console.log(cmd);
	runs(function() {
		var self = this;
		self.done = false;
		exec(cmd, function() {
			self.done = true;
			self.output = getExecObject(arguments);
		});
	});
	waitsFor(
		function() { return this.done; }, 
		'exec("' + cmd + '") timed out', timeout || TIMEOUT_DEFAULT
	);
	runs(testFn);
}

function toBeJavascript(expected) {
	try {
		return jsp.parse(this.actual);
	} catch (e) {
		return false;
	}
}

function toBeJavascriptFile(expected) {
	var actual = this.actual;
    var notText = this.isNot ? " not" : "";
	this.message = function () {
        return "Expected " + actual + notText + " to be a Javascript file";
    }

	try { 
		var js = fs.readFileSync(this.actual,'utf8');
		return toBeJavascript.call({actual:js}, expected);
	} catch (e) {
		return false;
	}
}

function toHaveSameContentAs(expected) {
	return fs.readFileSync(this.actual,'utf8') === fs.readFileSync(expected,'utf8');
}

exports.addMatchers = function() {
	beforeEach(function() {
		this.addMatchers({
			toBeJavascript: toBeJavascript,
			toBeJavascriptFile: toBeJavascriptFile,
			toHaveSameContentAs: toHaveSameContentAs,
			toExist: function(expected) {
				return path.existsSync(this.actual);
			}
		});
	});
}