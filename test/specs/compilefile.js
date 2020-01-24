var fs = require('fs-extra'),
	chmodr = require('chmodr'),
	path = require('path'),
	TU = require('../lib/testUtils'),
	_ = require('lodash');

const { platforms } = require('alloy-utils');

const availablePlatforms = _.omit(platforms, [ 'constants' ]);

var TIMEOUT_COMPILE = process.platform !== 'win32' ? 10000 : 20000;
var TIMEOUT_PREP = process.platform !== 'win32' ? 10000 : 30000;

var alloyRoot = path.join(__dirname,'..','..');
var Harness = path.join(alloyRoot,'test','projects','Harness');
var HarnessTemplate = Harness + 'Template';

// The alloy command test suite
describe('alloy selective compile', function() {
	it('preparing test app', function() {

		// Create a copy of Harness to work with
		fs.removeSync(Harness);
		fs.mkdirpSync(Harness);
		chmodr.sync(Harness, 0777);
		fs.copySync(HarnessTemplate, Harness, {
			forceDelete: true
		});
		TU.asyncExecTest('alloy new "' + Harness + '"', {
				test: function() {
					expect(this.output.error).toBeFalsy();
				},
				timeout: TIMEOUT_PREP
			});
	});

	_.each(availablePlatforms, function(platform, k) {
		if (process.platform !== 'win32' && platform.platform === 'blackberry') {
			return;
		}

		describe(('full compile').yellow + ' ' + ('[' + platform.platform + ']').cyan, function () {
			// Performs a standard compilation
			it('compiles without critical error',
				function() {
					TU.asyncExecTest(
						'alloy compile ' + Harness + ' --config platform=' + platform.platform, {
						test: function() {
							expect(this.output.error).toBeFalsy();
						},
						timeout: TIMEOUT_COMPILE
					}
				);
			});
		});

		describe(('index.js').yellow + ' ' + ('[' + platform.platform + ']').cyan, function () {
			// compiles a single file (index.js) with a command like:
			// alloy compile PATH_TO_Harness --config platform=ios,file=app/controllers/index.js
			it('compiles index.js only without critical error',
				function() {
					TU.asyncExecTest(
						'alloy compile ' + Harness + ' --config platform=' + platform.platform + ',file=app/controllers/index.js', {
						test: function() {
							expect(this.output.error).toBeFalsy();
						},
						timeout: TIMEOUT_COMPILE
					}
				);
			});
		});
		describe(('index.xml').yellow + ' ' + ('[' + platform.platform + ']').cyan, function () {
			// compiles a single file (index.xml) with a command like:
			// alloy compile PATH_TO_Harness --config platform=ios,file=app/views/index.xml
			it('compiles index.xml only without critical error',
				function() {
					TU.asyncExecTest(
						'alloy compile ' + Harness + ' --config platform=' + platform.platform + ',file=app/views/index.xml', {
						test: function() {
							expect(this.output.error).toBeFalsy();
						},
						timeout: TIMEOUT_COMPILE
					}
				);
			});
		});
		describe(('index.tss').yellow + ' ' + ('[' + platform.platform + ']').cyan, function () {
			// compiles a single file (index.tss) with a command like:
			// alloy compile PATH_TO_Harness --config platform=ios,file=app/styles/index.tss
			it('compiles index.tss only without critical error',
				function() {
					TU.asyncExecTest(
						'alloy compile ' + Harness + ' --config platform=' + platform.platform + ',file=app/styles/index.tss', {
						test: function() {
							expect(this.output.error).toBeFalsy();
						},
						timeout: TIMEOUT_COMPILE
					}
				);
			});
		});
	});

});
