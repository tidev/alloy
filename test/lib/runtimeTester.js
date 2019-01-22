var _ = require('lodash'),
	__j = require('jasmine'),
	CR = require('ConsoleReporter'),
	describe = __j.describe,
	it = __j.it,
	expect = __j.expect,
	jasmine = __j.jasmine,
	beforeEach = __j.beforeEach;

// These are in alphabetical order. It's not an accident. Keep it that way.
var apiChecks = {
	'Ti.UI.Button': function(o) {
		expect(o).toHaveFunction('setTitle');
	},
	'Ti.UI.ImageView': function(o) {
		expect(o).toHaveFunction('pause');
	},
	'Ti.UI.iOS.CoverFlowView': function(o) {
		expect(o).toHaveFunction('getImages');
	},
	'Ti.UI.iPhone.NavigationGroup': function(o) {
		apiChecks['Ti.UI.Window'](o.window);
	},
	'Ti.UI.Label': function(o) {
		expect(o).toHaveFunction('setText');
	},
	'Ti.UI.ScrollView': function(o) {
		expect(o).toHaveFunction('scrollTo');
	},
	'Ti.UI.Slider': function(o) {
		if (OS_IOS) {
			expect(o).toHaveFunction('getThumbImage');
		} else {
			expect(o).toHaveFunction('getMinRange');
		}
	},
	'Ti.UI.Tab': function(o) {
		apiChecks['Ti.UI.Window'](o.window);
	},
	'Ti.UI.TabGroup': function(o) {
		expect(o).toHaveFunction('addTab');
	},
	'Ti.UI.TableView': function(o) {
		expect(o).toHaveFunction('appendRow');
	},
	'Ti.UI.TableViewRow': function(o) {
		expect(o).toHaveFunction('getClassName');
	},
	'Ti.UI.Window': function(o) {
		expect(o).toHaveFunction('open');
	}
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
				return _.isFunction(this.actual.addEventListener);
			},
			toBeController: function() {
				return this.actual.__iamalloy === true;
			},
			toBeWidget: function() {
				return this.actual.__iamalloy === true;
			},
			toContainSameAs: function(array) {
				var actual = this.actual;
				this.message = function() {
					return 'expected ' + sortAndStringify(actual) + ' to contain ' +
						'same elements as ' + sortAndStringify(array);
				};

				return sortAndStringify(actual) === sortAndStringify(array);
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
			},
            toBeFile: function() {
                var file = _.isString(this.actual) ? Ti.Filesystem.getFile(Ti.Filesystem.resourcesDirectory, this.actual) : this.actual;
                return file.exists() && file.isFile();
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
		if ($.__styler && $.__styler[id] && !_.isEmpty($.__styler[id])) {
			opts.style = _.extend(opts.style, $.__styler[id]);
		}
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
