var fs = require('fs'),
	path = require('path'),
	exec = require('child_process').exec,
	DOMParser = require("xmldom").DOMParser,
	TU = require('../lib/testUtils'),
	U = require('../../Alloy/utils'),
	CU = require('../../Alloy/commands/compile/compilerUtils'),
	CONST = require('../../Alloy/common/constants'),
	_ = require('../../Alloy/lib/alloy/underscore')._;

var alloyRoot = path.join(__dirname,'..','..');
var templatePath = path.join(alloyRoot,'Alloy','template');
var Harness = path.join(alloyRoot,'test','projects','Harness'); 
var appPath = path.join(Harness,'app');

function testView(viewName, opts) {
	opts || (opts = {});
	var paths, doc;

	if (!opts.widgetId) {
		paths = {
			view: path.join(appPath,CONST.DIR.VIEW,viewName + '.' + CONST.FILE_EXT.VIEW),
			template: path.join(templatePath,'view.xml')
		}
	} else {
		var widgetPath = path.join(appPath,CONST.DIR.WIDGET,opts.widgetId);
		paths = {
			view: path.join(widgetPath,CONST.DIR.VIEW,viewName + '.' + CONST.FILE_EXT.VIEW),
			template: path.join(templatePath,'widget','view.xml')
		}
	}

	it('generates a view named "' + viewName + '"', function() {
		expect(path.existsSync(paths.view)).toBe(true);
	});

	it('file same as the one in alloy distribution', function() {
		expect(paths.view).toHaveSameContentAs(paths.template);
	});

	it('file is valid XML', function() {
		var theFunction = function() {
			var xml = fs.readFileSync(paths.view, 'utf8');
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

	it('xml has <Alloy> at root element', function() {
		expect(doc.documentElement.nodeName).toBe('Alloy');
	});
}

function testStyle(viewName, opts) {
	opts || (opts = {});
	var paths;

	if (!opts.widgetId) {
		paths = {
			style: path.join(appPath,CONST.DIR.STYLE,viewName + '.' + CONST.FILE_EXT.STYLE),
			template: path.join(templatePath,'style.tss')
		}
	} else {
		var widgetPath = path.join(appPath,CONST.DIR.WIDGET,opts.widgetId);
		paths = {
			style: path.join(widgetPath,CONST.DIR.STYLE,viewName + '.' + CONST.FILE_EXT.STYLE),
			template: path.join(templatePath,'widget','style.tss')
		}
	}

	it('generate a style named "' + viewName + '"', function() {
		expect(path.existsSync(paths.style)).toBe(true);
	});

	it('generated style matches the one in the alloy distribution', function() {
		expect(paths.style).toHaveSameContentAs(paths.template);
	});

	it('style is valid TSS', function() {
		expect(paths.style).toBeTssFile();
	});
}

function testController(viewName, opts) {
	opts || (opts = {});
	var paths;

	if (!opts.widgetId) {
		paths = {
			controller: path.join(appPath,CONST.DIR.CONTROLLER,viewName + '.' + CONST.FILE_EXT.CONTROLLER),
			template: path.join(templatePath,'controller.js')
		}
	} else {
		var widgetPath = path.join(appPath,CONST.DIR.WIDGET,opts.widgetId);
		paths = {
			controller: path.join(widgetPath,CONST.DIR.CONTROLLER,viewName + '.' + CONST.FILE_EXT.CONTROLLER),
			template: path.join(templatePath,'widget','controller.js')
		}
	}

	it('controller named "' + viewName + '"', function() {
		expect(path.existsSync(paths.controller)).toBe(true);
	});

	it('matches the one in the alloy distribution', function() {
		expect(paths.controller).toHaveSameContentAs(paths.template);
	});
}

describe('alloy generate', function() {
	TU.addMatchers();

	it('exits with error, shows help', function() {
		TU.asyncExecTest('alloy generate', {
			test: function() {
				expect(this.output.error).not.toBeNull();
				expect(this.output.stderr.indexOf(CONST.GENERATE_TARGETS.join(','))).not.toBe(-1);
			}
		});	
	});

	it('exits with error when given an invalid target', function() {
		TU.asyncExecTest('alloy generate invalidTarget', {
			test: function() {
				expect(this.output.error).not.toBeNull();
			},
		});	
	});

	describe('view', function() {
		var viewName = 'testView';

		it('ends in error when no name is given', function() {
			var badCmd = 'alloy generate view --project-dir "' + Harness + '"';
			TU.asyncExecTest(badCmd, {
				test: function() {
					expect(this.output.error).toBeTruthy();
				}
			});
		});

		it('ends in error when no valid project path is found', function() {
			var badCmd = 'alloy generate view ' + viewName;
			TU.asyncExecTest(badCmd, {
				test: function() {
					expect(this.output.error).toBeTruthy();
				}
			});
		});

		var cmd = 'alloy generate view ' + viewName + ' --project-dir "' + Harness + '"'; 
		it('executes `' + cmd + '` without error', function() {
			TU.asyncExecTest(cmd, {reset:true});
		});

		testView(viewName);
		testStyle(viewName);
	});

	describe('controller', function() {
		var viewName = 'testView';

		it('ends in error when no name is given', function() {
			var badCmd = 'alloy generate controller --project-dir "' + Harness + '"';
			TU.asyncExecTest(badCmd, {
				test: function() {
					expect(this.output.error).toBeTruthy();
				}
			});
		});

		it('ends in error when no valid project path is found', function() {
			var badCmd = 'alloy generate controller ' + viewName;
			TU.asyncExecTest(badCmd, {
				test: function() {
					expect(this.output.error).toBeTruthy();
				}
			});
		});

		var cmd = 'alloy generate controller ' + viewName + ' --project-dir "' + Harness + '"'; 
		it('executes `' + cmd + '` without error', function() {
			TU.asyncExecTest(cmd, {reset:true});
		});

		testView(viewName);
		testStyle(viewName);
		testController(viewName);
	});

	describe('widget', function() {
		var widgetId = 'com.test.widget';
		var cmd = 'alloy generate widget ' + widgetId + ' --project-dir "' + Harness + '"';

		it('executes `' + cmd + '` without error', function() {
			TU.asyncExecTest(cmd, {reset:true});
		});

		testView('widget', {widgetId: widgetId});
		testStyle('widget', {widgetId: widgetId});
		testController('widget', {widgetId: widgetId});
	});

	describe('model', function() {
		var modelName = 'testModel';

		var goodCmds = [
			'alloy generate model ' + modelName + ' properties col1:string col2:int',
			'alloy generate model ' + modelName + ' sql another:bool blah:float hustle:number',	
			'alloy generate model ' + modelName + ' sql col1:int'		
		];

		var badCmds = [
			'alloy generate model',
			'alloy generate model col1:string',
			'alloy generate model ' + modelName,
			'alloy generate model sql'
		];

		_.each(goodCmds, function(cmd) {
			var filepath = path.join(Harness,'app','models',modelName+'.js');

			cmd += ' --project-dir "' + Harness + '"';
			it('executes `' + cmd + '` without error', function() {
				TU.asyncExecTest(cmd, {reset:true});
			});

			it('file exists', function() {
				expect(filepath).toExist();
			});

			it('file is valid Javascript', function() {
				expect(filepath).toBeJavascriptFile();
			});
		});

		_.each(badCmds, function(cmd) {
			cmd += ' --project-dir "' + Harness + '"';
			it('executes `' + cmd + '` without error', function() {
				TU.asyncExecTest(cmd, {
					test: function() {
						expect(this.output.error).toBeTruthy();
					},
					reset: true
				});
			});
		});
	});

	describe('migration', function() {
		var migrationName = 'testMigration';
		var migrationsDir = path.join(Harness,'app','migrations');
		var migrationFile;

		it('executes without error', function() {
			TU.asyncExecTest('alloy generate migration ' + migrationName + ' --project-dir "' + Harness + '"', {reset:true});
		});

		it('file exists', function() {
			var files = fs.readdirSync(migrationsDir);
			var regex = new RegExp('^\\d+\\_' + migrationName + '\\.js$');
			var tmpFile = _.find(files, function(f) {
				return regex.test(f);
			});
			migrationFile = path.join(migrationsDir,tmpFile);

			expect(tmpFile).toBeTruthy();
		});

		it('file is valid Javascript', function() {
			expect(migrationFile).toBeJavascriptFile();
		});
	});

	describe('jmk', function() {
		var projectJmk = path.join(Harness,'app','alloy.jmk');
		var alloyJmk = path.join(templatePath,'alloy.jmk');
		var jmkContent;

		it('executes without error from project directory', function() {
			TU.asyncExecTest('cd "' + Harness + '" && alloy generate jmk', {reset:true});
		});		

		it('executes without error from app directory', function() {
			TU.asyncExecTest('cd "' + path.join(Harness,'app') + '" && alloy generate jmk', {reset:true});
		});		

		it('executes without error with --projectDir', function() {
			TU.asyncExecTest('alloy generate jmk --project-dir "' + Harness + '"', {reset:true});
		});

		it('file exists', function() {
			expect(path.existsSync(projectJmk)).toBe(true);
		});

		it('file matches the one in alloy distribution', function() {
			jmkContent = fs.readFileSync(projectJmk,'utf8');
			expect(jmkContent === fs.readFileSync(alloyJmk,'utf8')).toBe(true);
		});

		it('file is valid Javascript', function() {
			expect(projectJmk).toBeJavascriptFile();
		});
	});
});
