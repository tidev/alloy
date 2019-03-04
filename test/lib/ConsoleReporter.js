var colors = require('colors');

//Based on Console Reporter, taken from https://github.com/pivotal/jasmine/blob/master/src/console/ConsoleReporter.js
module.exports = function(opts) {
	//inspired by mhevery's jasmine-node reporter
	//https://github.com/mhevery/jasmine-node
	opts = opts || {};

	var doneCallback = opts.doneCallback || function(r) {
		if(r && r.results() && r.results().failedCount > 0 ) {
			process.exit(1);
		}
	};
	var print, showColors;
	if (typeof Ti !== 'undefined') {
		print = Ti.Platform.osname === 'android' ?
			function(s) { Ti.API.info(s); } :
			Ti.API.info;
		showColors = false;
	} else {
		print = console.log;
		showColors = true;
	}
	print = opts.print || print;
	showColors = opts.showColors || showColors;

	var language = {
		spec: 'spec',
		failure: 'failure'
	};

	var plainPrint = function(str) { return str; };
	var greenStr = showColors ? function(str) { return str.green; } : plainPrint;
	var redStr = showColors ? function(str) { return str.red; } : plainPrint;
	var yellowStr = showColors ? function(str) { return str.yellow; } : plainPrint;

	function started() {
		print('Begin Alloy Test Suite');
	}

	function greenDot() {
		print(greenStr('\\(^o^)/'));
	}

	function redF() {
		print(redStr('(>_<)*'));
	}

	function yellowStar() {
		print(yellowStr('(・_・)'));
	}

	function plural(str, count) {
		return count == 1 ? str : str + 's';
	}

	function repeat(thing, times) {
		var arr = [];
		for (var i = 0; i < times; i++) {
			arr.push(thing);
		}
		return arr;
	}

	function indent(str, spaces) {
		var lines = (str || '').split('\n');
		var newArr = [];
		for (var i = 0; i < lines.length; i++) {
			newArr.push(repeat(' ', spaces).join('') + lines[i]);
		}
		return newArr.join('\n');
	}

	function specFailureDetails(suiteDescription, specDescription, stackTraces, messages) {
		print(' ');
		print(suiteDescription + ' ' + specDescription);

		var i;
		for (i = 0; i < messages.length; i++) {
			print(indent(messages[i], 2));
		}
		// for (i = 0; i < stackTraces.length; i++) {
		// 	print(indent(stackTraces[i], 2));
		// }
	}

	function finished(elapsed) {
		print('Finished in ' + elapsed / 1000 + ' seconds');
	}

	function summary(colorF, specs, failed) {
		print(colorF(specs + ' ' + plural(language.spec, specs) + ', ' +
		failed + ' ' + plural(language.failure, failed)));
	}

	function greenSummary(specs, failed) {
		summary(greenStr, specs, failed);
	}

	function redSummary(specs, failed) {
		summary(redStr, specs, failed);
	}

	function fullSuiteDescription(suite) {
		var fullDescription = suite.description;
		if (suite.parentSuite) fullDescription = fullSuiteDescription(suite.parentSuite) + ' ' + fullDescription;
		return fullDescription;
	}

	this.now = function() {
		return new Date().getTime();
	};

	this.reportRunnerStarting = function() {
		this.runnerStartTime = this.now();
		started();
	};

	this.reportSpecStarting = function() { /* do nothing */
	};

	this.reportSpecResults = function(spec) {
		var results = spec.results();
		var desc = '';

		function getDescription(suite) {
			if (!suite) { return; }
			desc = suite.description + ' ' + desc;
			getDescription(suite.parentSuite);
		}
		getDescription(spec.suite);
		var testName = desc + '--> ' + results.description;

		if (results.skipped) {
			yellowStar();
		} else if (results.passed()) {
			print(greenStr('[PASS] ') + testName);
		} else {
			print(redStr('[FAIL] ') + testName);
		}
	};

	this.suiteResults = [];

	this.reportSuiteResults = function(suite) {
		var suiteResult = {
			description: fullSuiteDescription(suite),
			failedSpecResults: []
		};

		suite.results().items_.forEach(function(spec) {
			if (spec.failedCount > 0 && spec.description) suiteResult.failedSpecResults.push(spec);
		});

		this.suiteResults.push(suiteResult);
	};

	function eachSpecFailure(suiteResults, callback) {
		for (var i = 0; i < suiteResults.length; i++) {
			var suiteResult = suiteResults[i];
			for (var j = 0; j < suiteResult.failedSpecResults.length; j++) {
				var failedSpecResult = suiteResult.failedSpecResults[j];
				var stackTraces = [];
				var messages = [];
				for (var k = 0; k < failedSpecResult.items_.length; k++) {
					stackTraces.push(failedSpecResult.items_[k].trace.stack);
					messages.push(failedSpecResult.items_[k].message);
				}
				callback(suiteResult.description, failedSpecResult.description, stackTraces, messages);
			}
		}
	}

	this.reportRunnerResults = function(runner) {
		eachSpecFailure(this.suiteResults, function(suiteDescription, specDescription, stackTraces, messages) {
			specFailureDetails(suiteDescription, specDescription, stackTraces, messages);
		});

		finished(this.now() - this.runnerStartTime);

		var results = runner.results();
		var summaryFunction = results.failedCount === 0 ? greenSummary : redSummary;
		summaryFunction(runner.specs().length, results.failedCount);
		doneCallback(runner);
	};
};
