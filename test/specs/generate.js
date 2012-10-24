var fs = require('fs'),
	path = require('path'),
	wrench = require('wrench'),
	exec = require('child_process').exec,
	TU = require('../lib/testUtils'),
	jsp = require("../../Alloy/uglify-js/uglify-js").parser,
	U = require('../../Alloy/utils'),
	CONST = require('../../Alloy/common/constants'),
	_ = require('../../Alloy/lib/alloy/underscore')._;

var TIMEOUT_DEFAULT = 1000;
var alloyRoot = path.join(__dirname,'..','..');
var templatePath = path.join(alloyRoot,'Alloy','template');
var genPath = path.join(alloyRoot,'Alloy','commands','generate','targets');
var TiAppRoot = path.join(alloyRoot,'test','projects','TiApp');
var TiAppCopy = TiAppRoot + 'Copy';

function resetTestApp(callback) {
	wrench.rmdirSyncRecursive(TiAppCopy, true);
	wrench.mkdirSyncRecursive(TiAppCopy, 0777);
	wrench.copyDirSyncRecursive(TiAppRoot, TiAppCopy);
	exec('alloy new "' + TiAppCopy + '"', function(error, stdout, stderr) {
		if (error) {
			console.error('Failed to create new alloy project at ' + TiAppCopy);
			process.exit();
		}
		callback();
	});
}

function asyncExecTestWithReset(cmd, timeout, testFn) {
	runs(function() {
		var self = this;
		self.done = false;

		resetTestApp(function() {
			exec(cmd, function() {
				self.done = true;
				var args = Array.prototype.slice.call(arguments, 0);
				self.output = {
					error: args[0],
					stdout: args[1],
					stderr: args[2]
				};
			});
		});
	});
	waitsFor(
		function() { return this.done; }, 
		'exec("' + cmd + '") timed out', timeout
	);
	runs(testFn);
}

function isSameFile(file1, file2) {
	return fs.readFileSync(file1,'utf8') === fs.readFileSync(file2,'utf8');
}

describe('`alloy generate`', function() {
	it('exits with error and help when no target is given', function() {
		TU.asyncExecTest('alloy generate', TIMEOUT_DEFAULT, function() {
			expect(this.output.error).not.toBeNull();
			expect(this.output.stderr.indexOf(CONST.GENERATE_TARGETS.join(','))).not.toBe(-1);
		});	
	});

	it('fails when given an invalid target', function() {
		TU.asyncExecTest('alloy generate invalidTarget', TIMEOUT_DEFAULT, function() {
			expect(this.output.error).not.toBeNull();
		});	
	});

	describe('`alloy generate jmk`', function() {
		var projectJmk = path.join(TiAppCopy,'app','alloy.jmk');
		var alloyJmk = path.join(templatePath,'alloy.jmk');
		var jmkContent;

		it('executes without error', function() {
			asyncExecTestWithReset(
				'alloy generate jmk --project-dir "' + TiAppCopy + '"',
				2000, 
				function() {
					expect(this.output.error).toBeNull();
				}
			);
		});

		it('generates an alloy.jmk file', function() {
			expect(path.existsSync(projectJmk)).toBe(true);
		});

		it('generated alloy.jmk matches the one in alloy', function() {
			jmkContent = fs.readFileSync(projectJmk,'utf8');
			expect(jmkContent === fs.readFileSync(alloyJmk,'utf8')).toBe(true);
		});

		it('generated alloy.jmk is valid Javascript', function() {
			var theFunction = function() {
				jsp.parse(jmkContent);
			};
			expect(theFunction).not.toThrow();
		});
	});

	describe('`alloy generate view`', function() {
		var viewName = 'testView';
		var viewPath = path.join(TiAppCopy,'app','views',viewName + '.' + CONST.FILE_EXT.VIEW);
		var viewTemplate = path.join(templatePath,'view.xml');
		var cmd = 'alloy generate view ' + viewName + ' --project-dir "' + TiAppCopy + '"';
		var doc;

		it('executes `' + cmd + '` without error', function() {
			asyncExecTestWithReset(cmd, 2000, function() {
				expect(this.output.error).toBeNull();
			});
		});

		it('generates a view named "' + viewName + '"', function() {
			expect(path.existsSync(viewPath)).toBe(true);
		});

		it('generated view matches the one in the alloy distribution', function() {
			expect(isSameFile(viewPath, viewTemplate)).toBe(true);
		});

		// Can't use U.XML.parseFromString cause it never throws in its current state.
		// Need to setup an xmldom event handler to throw
		it('generated view is valid XML', function() {
			var theFunction = function() {
				doc = U.XML.parseFromString(fs.readFileSync(viewPath, 'utf8'));
			};
			expect(theFunction).not.toThrow();
			expect(doc).not.toBeFalsy();
		});

		it('generated view has <Alloy> at root element', function() {
			expect(doc.documentElement.nodeName).toBe('Alloy');
		});
	});
});
