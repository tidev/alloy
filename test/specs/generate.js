var fs = require('fs'),
	path = require('path'),
	wrench = require('wrench'),
	vm = require('vm'),
	exec = require('child_process').exec,
	DOMParser = require("xmldom").DOMParser,
	TU = require('../lib/testUtils'),
	jsp = require("../../Alloy/uglify-js/uglify-js").parser,
	U = require('../../Alloy/utils'),
	CU = require('../../Alloy/commands/compile/compilerUtils'),
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

function itViewStyleController(type) {
	var viewName = 'testView';
	var viewPath = path.join(TiAppCopy,'app',CONST.DIR.VIEW,viewName + '.' + CONST.FILE_EXT.VIEW);
	var stylePath = path.join(TiAppCopy,'app',CONST.DIR.STYLE,viewName + '.' + CONST.FILE_EXT.STYLE);
	var controllerPath = path.join(TiAppCopy,'app',CONST.DIR.CONTROLLER,viewName + '.' + CONST.FILE_EXT.CONTROLLER);
	var viewTemplate = path.join(templatePath,'view.xml');
	var styleTemplate = path.join(templatePath,'style.tss');
	var controllerTemplate = path.join(templatePath,'controller.js');
	var cmd = 'alloy generate ' + type + ' ' + viewName + ' --project-dir "' + TiAppCopy + '"';
	var doc;

	it('ends in error when no name is given', function() {
		var badCmd = 'alloy generate ' + type + ' --project-dir "' + TiAppCopy + '"';
		asyncExecTestWithReset(badCmd, 2000, function() {
			expect(this.output.error).toBeTruthy();
		});
	});

	it('ends in error when no valid project path is found', function() {
		var badCmd = 'alloy generate ' + type + ' ' + viewName;
		asyncExecTestWithReset(badCmd, 2000, function() {
			expect(this.output.error).toBeTruthy();
		});
	});

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

	it('generated view is valid XML', function() {
		var theFunction = function() {
			var xml = fs.readFileSync(viewPath, 'utf8');
			var errorHandler = {};
			errorHandler.error = errorHandler.fatalError = function(m) { 
				throw m;
			};
			doc = new DOMParser({
				errorHandler: errorHandler,
				locator: {}
			}).parseFromString(xml);
		};
		expect(theFunction).not.toThrow();
		expect(doc).not.toBeFalsy();
	});

	it('generated view has <Alloy> at root element', function() {
		expect(doc.documentElement.nodeName).toBe('Alloy');
	});

	it('generate a style named "' + viewName + '"', function() {
		expect(path.existsSync(stylePath)).toBe(true);
	});

	it('generated style matches the one in the alloy distribution', function() {
		expect(isSameFile(stylePath, styleTemplate)).toBe(true);
	});

	it('generated style is valid TSS', function() {
		var style;
		var theFunction = function() {
			var die = U.die;
			U.die = function(msg, e) {
				U.die = die;
				throw U.createErrorOutput(msg, e);
			};
			style = CU.loadStyle(stylePath);
			U.die = die;
		};

		expect(theFunction).not.toThrow();
		expect(_.isObject(style)).toBe(true);
		expect(_.isEmpty(style)).toBe(false);
	});

	if (type === 'controller') {
		it('generate a controller named "' + viewName + '"', function() {
			expect(path.existsSync(controllerPath)).toBe(true);
		});

		it('generated controller matches the one in the alloy distribution', function() {
			expect(isSameFile(controllerPath, controllerTemplate)).toBe(true);
		});
	}
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
		itViewStyleController('view');
	});

	describe('`alloy generate controller`', function() {
		itViewStyleController('controller');
	});
});
