var fs = require('fs'),
	path = require('path'),
	vm = require('vm'),
	_ = require('lodash'),
	TU = require('../lib/testUtils');

var TIMEOUT_COMPILE = 20000;
var TIMEOUT_PREP = 30000;
var APP = 'testing/require-conditional-children';

// Runs the generated index controller with just enough of Alloy and Titanium stubbed to see
// which children each <Require> receives.
function runIndexController(cfg) {
	var file = path.join(TU.paths.harness, 'Resources', 'android', 'alloy', 'controllers', 'index.js');
	var created = {};
	var alloy = {
		_: _,
		Backbone: {},
		CFG: cfg,
		createController: function(name, args) {
			if (args && args.id) {
				created[args.id] = args;
			}
			return {
				getViewEx: function() { return { controller: name }; },
				setParent: function() {}
			};
		}
	};
	var baseController = function() {
		this.__views = {};
		this.addTopLevelView = function() {};
	};
	var sandbox = {
		module: { exports: {} },
		require: function(name) {
			return /BaseController$/.test(name) ? baseController : alloy;
		},
		Ti: {
			UI: {
				createWindow: function() { return { open: function() {} }; },
				createLabel: function(props) { return props; }
			}
		}
	};
	vm.runInNewContext(fs.readFileSync(file, 'utf8'), sandbox, file);
	new sandbox.module.exports();

	// name each child passed to a <Require>: a controller by its name, a label by its text
	return _.mapValues(created, function(args) {
		return args.children && _.map(args.children, function(child) {
			return child.controller || child.text;
		});
	});
}

describe('<Require> children', function() {
	it('preparing test app', function() {
		TU.asyncExecTest('jake app:setup dir=' + APP + ' quiet=1', { timeout: TIMEOUT_PREP });
	});

	it('compiles without critical error', function() {
		TU.asyncExecTest('alloy compile ' + TU.paths.harness + ' --config platform=android', {
			test: function() {
				if (this.output.error) {
					console.error(this.output.stderr);
					console.log(this.output.stdout);
				}
				expect(this.output.error).toBeFalsy();
			},
			timeout: TIMEOUT_COMPILE
		});
	});

	it('does not reference a child whose condition is false', function() {
		var created;
		expect(function() {
			created = runIndexController({ showBadge: false });
		}).not.toThrow();
		expect(created.cardWithoutChildren).toEqual([]);
		expect(created.cardWithChild).toEqual(['badge']);
	});

	it('passes a child whose condition is true', function() {
		var created = runIndexController({ showBadge: true });
		expect(created.cardWithoutChildren).toEqual(['badge', 'label']);
		expect(created.cardWithChild).toEqual([]);
	});

	it('passes unconditional children as before', function() {
		var created = runIndexController({ showBadge: false });
		expect(created.cardWithLabel).toEqual(['label']);
	});
});
