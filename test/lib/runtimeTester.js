var _ = require('alloy/underscore')._,
	__j = require('jasmine'),
	CR = require('ConsoleReporter'),
	describe = __j.describe,
	it = __j.it,
	expect = __j.expect,
	jasmine = __j.jasmine,
	beforeEach = __j.beforeEach;

var apiChecks = {
	'Ti.UI.Window': function(o) {
		expect(o).toHaveFunction('open');
	},
	//'Ti.UI.Button': function(o) {},
	//'Ti.UI.Label': function(o) {},
};

function sortAndStringify(obj) {
	return JSON.stringify(obj, function(k,v) {
		if (_.isObject(v) && !_.isArray(v) && !_.isFunction(v)) {
			return sortObject(v);
		}
		return v;
	});
}

function sortObject(o) {
    var sorted = {},
    key, a = [];

    for (key in o) {
        if (o.hasOwnProperty(key)) {
            a.push(key);
        }
    }

    a.sort();

    for (key = 0; key < a.length; key++) {
        sorted[a[key]] = o[a[key]];
    }
    return sorted;
}

function addMatchers() {
	beforeEach(function() {
		this.addMatchers({
			toBeTiProxy: function() {
				return _.isFunction(this.actual.applyProperties);
			},
			toHaveStyle: function(style) {
				var component = this.actual;
				var obj = {};
				_.each(style, function(v,k) {
					obj[k] = component[k];
				});

				this.message = function() {
					return 'expected ' + this.actual.toString() + ' to have style:\n' + 
						sortAndStringify(style) + '\nbut found this instead:\n' +
						sortAndStringify(obj);
				};

				return sortAndStringify(obj) === sortAndStringify(style);
			},
			toHaveFunction: function(func) {
				return _.isFunction(this.actual[func]);
			}
		});
	});
}

function validateUiComponent($, id, opts) {
	if (!id) { throw('validateUiComponent exception: No id given'); }
	
	var comp = $[id];
	it('#' + id + ' is defined', function() {
		expect(comp).toBeDefined();
		expect(comp).not.toBeNull();
	});

	it('#' + id + ' is a Titanium proxy object', function() {
		expect(comp).toBeTiProxy();
	});

	if (opts.api && apiChecks[opts.api]) {
		it('#' + id + ' component is a ' + opts.api, function() {
			apiChecks[opts.api](comp); 
		});
	}

	if (opts.style) {
		it('#' + id + ' component has correct style', function() {
			expect(comp).toHaveStyle(opts.style);
		});
	}
}

function launchTests() {
	jasmine.getEnv().addReporter(new CR({
		doneCallback: function(runner) {
			alert(runner.specs().length + ' specs, ' + runner.results().failedCount + ' failed');
		}
	}));
	jasmine.getEnv().execute();
}