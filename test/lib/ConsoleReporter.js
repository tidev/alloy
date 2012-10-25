var colors = require('colors');

//Based on Console Reporter, taken from https://github.com/pivotal/jasmine/blob/master/src/console/ConsoleReporter.js
module.exports = function(print, doneCallback, showColors) {
	//inspired by mhevery's jasmine-node reporter
	//https://github.com/mhevery/jasmine-node

	doneCallback = doneCallback || function() {};

	var language = {
		spec: 'spec',
		failure: 'failure'
	};

	function greenStr(str) {
		return str.green
	}

	function redStr(str) {
		return str.red
	}

	function yellowStr(str) {
		return str.yellow
	}

	function started() {
		print('Begin Jasmine Test Suite (Jasmine v.'+jasmine.getEnv().version().major
			+'.'+jasmine.getEnv().version().minor
			+'.'+jasmine.getEnv().version().build
			+')');
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

	function specFailureDetails(suiteDescription, specDescription, stackTraces) {
		print(suiteDescription + ' ' + specDescription);
		for (var i = 0; i < stackTraces.length; i++) {
			print(indent(stackTraces[i], 2));
		}
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
				for (var k = 0; k < failedSpecResult.items_.length; k++) stackTraces.push(failedSpecResult.items_[k].trace.stack);
				callback(suiteResult.description, failedSpecResult.description, stackTraces);
			}
		}
	}

	this.reportRunnerResults = function(runner) {
		eachSpecFailure(this.suiteResults, function(suiteDescription, specDescription, stackTraces) {
			specFailureDetails(suiteDescription, specDescription, stackTraces);
		});

		finished(this.now() - this.runnerStartTime);

		var results = runner.results();
		var summaryFunction = results.failedCount === 0 ? greenSummary : redSummary;
		summaryFunction(runner.specs().length, results.failedCount);
		doneCallback(runner);
	};
};