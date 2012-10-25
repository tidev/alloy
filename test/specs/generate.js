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
var TiAppRoot = path.join(alloyRoot,'test','projects','TiApp');
var TiAppCopy = TiAppRoot + 'Copy';

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
		TU.asyncExecTest(badCmd, {
			test: function() {
				expect(this.output.error).toBeTruthy();
			}
		});
	});

	it('ends in error when no valid project path is found', function() {
		var badCmd = 'alloy generate ' + type + ' ' + viewName;
		TU.asyncExecTest(badCmd, {
			test: function() {
				expect(this.output.error).toBeTruthy();
			}
		});
	});

	it('executes `' + cmd + '` without error', function() {
		TU.asyncExecTest(cmd, {reset:true});
	});

	it('generates a view named "' + viewName + '"', function() {
		expect(path.existsSync(viewPath)).toBe(true);
	});

	it('generated view matches the one in the alloy distribution', function() {
		expect(viewPath).toHaveSameContentAs(viewTemplate);
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
		expect(stylePath).toHaveSameContentAs(styleTemplate);
	});

	it('generated style is valid TSS', function() {
		expect(stylePath).toBeTssFile();
	});

	if (type === 'controller') {
		it('generate a controller named "' + viewName + '"', function() {
			expect(path.existsSync(controllerPath)).toBe(true);
		});

		it('generated controller matches the one in the alloy distribution', function() {
			expect(controllerPath).toHaveSameContentAs(controllerTemplate);
		});
	}
}

describe('`alloy generate`', function() {
	TU.addMatchers();

	it('exits with error and help when no target is given', function() {
		TU.asyncExecTest('alloy generate', {
			test: function() {
				expect(this.output.error).not.toBeNull();
				expect(this.output.stderr.indexOf(CONST.GENERATE_TARGETS.join(','))).not.toBe(-1);
			}
		});	
	});

	it('fails when given an invalid target', function() {
		TU.asyncExecTest('alloy generate invalidTarget', {
			test: function() {
				expect(this.output.error).not.toBeNull();
			},
		});	
	});

	describe('`alloy generate widget`', function() {
		var widgetId = 'com.test.widget';
		var cmd = 'alloy generate widget ' + widgetId + ' --project-dir "' + TiAppCopy + '"';

		it('executes `' + cmd + '` without error', function() {
			TU.asyncExecTest(cmd, {reset:true});
		});
	});

	describe('`alloy generate model`', function() {
		var modelName = 'testModel';

		var goodCmds = [
			'alloy generate model ' + modelName + ' col1:string col2:int',
			'alloy generate model ' + modelName + ' sql another:bool blah:float hustle:number',	
			'alloy generate model ' + modelName + ' col1:int'		
		];

		var badCmds = [
			'alloy generate model',
			'alloy generate model col1:string',
			'alloy generate model ' + modelName,
			'alloy generate model sql sql'
		];

		_.each(goodCmds, function(cmd) {
			var filepath = path.join(TiAppCopy,'app','models',modelName+'.js');

			cmd += ' --project-dir "' + TiAppCopy + '"';
			it('executes `' + cmd + '` without error', function() {
				TU.asyncExecTest(cmd, {reset:true});
			});

			it('generated model exists', function() {
				expect(filepath).toExist();
			});

			it('generated model is valid Javascript', function() {
				expect(filepath).toBeJavascriptFile();
			});
		});

		_.each(badCmds, function(cmd) {
			cmd += ' --project-dir "' + TiAppCopy + '"';
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

	describe('`alloy generate jmk`', function() {
		var projectJmk = path.join(TiAppCopy,'app','alloy.jmk');
		var alloyJmk = path.join(templatePath,'alloy.jmk');
		var jmkContent;

		it('executes without error', function() {
			TU.asyncExecTest('alloy generate jmk --project-dir "' + TiAppCopy + '"', {reset:true});
		});

		it('generates an alloy.jmk file', function() {
			expect(path.existsSync(projectJmk)).toBe(true);
		});

		it('generated alloy.jmk matches the one in alloy', function() {
			jmkContent = fs.readFileSync(projectJmk,'utf8');
			expect(jmkContent === fs.readFileSync(alloyJmk,'utf8')).toBe(true);
		});

		it('generated alloy.jmk is valid Javascript', function() {
			expect(projectJmk).toBeJavascriptFile();
		});
	});

	describe('`alloy generate view`', function() {
		itViewStyleController('view');
	});

	describe('`alloy generate controller`', function() {
		itViewStyleController('controller');
	});

	describe('`alloy generate migration`', function() {
		var migrationName = 'testMigration';
		var migrationsDir = path.join(TiAppCopy,'app','migrations');
		var migrationFile;

		it('executes without error', function() {
			TU.asyncExecTest('alloy generate migration ' + migrationName + ' --project-dir "' + TiAppCopy + '"', {reset:true});
		});

		it('generates a migration file', function() {
			var files = fs.readdirSync(migrationsDir);
			var regex = new RegExp('^\\d+\\_' + migrationName + '\\.js$');
			var tmpFile = _.find(files, function(f) {
				return regex.test(f);
			});
			migrationFile = path.join(migrationsDir,tmpFile);

			expect(tmpFile).toBeTruthy();
		});

		it('generated migration is valid Javascript', function() {
			expect(migrationFile).toBeJavascriptFile();
		});
	});
});
