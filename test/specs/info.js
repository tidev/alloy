var TU = require('../lib/testUtils'),
	_ = require('../../Alloy/lib/alloy/underscore')._;

describe('alloy info', function() {
	TU.addMatchers();

	it('fails when no target is given', function() {
		TU.asyncExecTest('alloy info', {
			test: function() {
				expect(this.output.error).not.toBeNull();
			}
		});
	});

	it('fails when an invalid target is given', function() {
		TU.asyncExecTest('alloy info invalidTarget', {
			test: function() {
				expect(this.output.error).not.toBeNull();
			}
		});
	});

	describe('adapters', function() {
		var outputText, json;

		it('runs successfully', function() {
			TU.asyncExecTest('alloy info adapters', {
				test: function() {
					expect(this.output.error).toBeNull();
					outputText = this.output.stdout;
				}
			});
		});

		it('generates valid JSON', function() {
			var theFunction = function() {
				json = JSON.parse(outputText);
			};
			expect(theFunction).not.toThrow();
		});

		_.each(['sql','properties','localStorage'], function(adapter) {
			it('JSON contains "' + adapter + '" adapter', function() {
				expect(json[adapter]).toBeTruthy();
			}); 

			it('"' + adapter + '" adapter has description', function() {
				expect(json[adapter].description).toBeTruthy();
			});

			it('"' + adapter + '" adapter has platforms array', function() {
				expect(json[adapter].platforms).toBeArray();
			});

			it('"' + adapter + '" adapter supports at least one platform', function() {
				expect(json[adapter].platforms.length).toBeGreaterThan(0);
			});
		});
	});

	describe('templates', function() {
		var outputText, json;
		var templates = ['default','two_tabbed'];

		it('runs successfully', function() {
			TU.asyncExecTest('alloy info templates', {
				test: function() {
					expect(this.output.error).toBeNull();
					outputText = this.output.stdout;
				}
			});
		});

		it('generates valid JSON', function() {
			var theFunction = function() {
				json = JSON.parse(outputText);
			};
			expect(theFunction).not.toThrow();
		});

		_.each(templates, function(templateName) {
			var template;

			it('JSON contains "' + templateName + '" template', function() {
				template = _.find(json, function(item) {
					return templateName === item.name;
				});
				expect(template).toBeTruthy();
			});

			it('"' + templateName + '" template has a label', function() {
				expect(template.label).toBeTruthy();
			});

			it('"' + templateName + '" template has a Description', function() {
				expect(template.Description).toBeTruthy();
			});

			it('"' + templateName + '" template has an icon', function() {
				expect(template.icon).toBeTruthy();
			});
		});
	});
});