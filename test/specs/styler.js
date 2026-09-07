var path = require('path'),
	_ = require('lodash'),
	U = require('../../Alloy/utils'),
	styler = require('../../Alloy/commands/compile/styler');

var fixtureTss = path.join(__dirname, '..', 'apps', 'testing', 'multi-classes', 'styles', 'index.tss');

// return only the entries whose key matches
function byKey(sorted, key) {
	return _.filter(sorted, { key: key });
}

describe('styler.js', function() {
	// U.die() calls process.exit(), which would abort the whole test run.
	// Stub it so an invalid selector surfaces as a failed spec instead.
	var originalDie, died;

	beforeEach(function() {
		died = [];
		originalDie = U.die;
		U.die = function(msg) {
			died.push(msg);
			throw new Error(msg);
		};
	});

	afterEach(function() {
		U.die = originalDie;
	});

	describe('sortStyles() with comma-separated selectors', function() {

		it('creates one entry per class in ".a, .b"', function() {
			var sorted = styler.sortStyles({ '.a, .b': { color: 'red' } });
			expect(sorted.length).toBe(2);

			var a = byKey(sorted, 'a')[0];
			var b = byKey(sorted, 'b')[0];
			expect(a).toBeDefined();
			expect(b).toBeDefined();
			expect(a.isClass).toBe(true);
			expect(b.isClass).toBe(true);
			expect(a.style).toEqual({ color: 'red' });
			expect(b.style).toEqual({ color: 'red' });
		});

		it('creates one entry per id in "#x, #y"', function() {
			var sorted = styler.sortStyles({ '#x, #y': { top: 1 } });
			expect(sorted.length).toBe(2);
			expect(byKey(sorted, 'x')[0].isId).toBe(true);
			expect(byKey(sorted, 'y')[0].isId).toBe(true);
			expect(byKey(sorted, 'x')[0].style).toEqual({ top: 1 });
			expect(byKey(sorted, 'y')[0].style).toEqual({ top: 1 });
		});

		it('keeps the selector type of each part in a mixed key', function() {
			var sorted = styler.sortStyles({ 'Label, .btn, #main': { width: 100 } });
			expect(sorted.length).toBe(3);

			var label = byKey(sorted, 'Label')[0];
			var btn = byKey(sorted, 'btn')[0];
			var main = byKey(sorted, 'main')[0];

			expect(label.isApi).toBe(true);
			expect(label.isClass).toBeUndefined();
			expect(label.isId).toBeUndefined();

			expect(btn.isClass).toBe(true);
			expect(btn.isApi).toBeUndefined();
			expect(btn.isId).toBeUndefined();

			expect(main.isId).toBe(true);
			expect(main.isApi).toBeUndefined();
			expect(main.isClass).toBeUndefined();
		});

		it('gives the API entry a lower priority than the class and id entries', function() {
			var sorted = styler.sortStyles({ '#main, .btn, Label': { width: 100 } });
			expect(sorted[0].key).toBe('Label');
			expect(sorted[1].key).toBe('btn');
			expect(sorted[2].key).toBe('main');
		});

		it('preserves declaration order between selectors of the same key', function() {
			var sorted = styler.sortStyles({ '.first, .second, .third': { top: 0 } });
			expect(_.map(sorted, 'key')).toEqual(['first', 'second', 'third']);
			expect(sorted[0].priority < sorted[1].priority).toBe(true);
			expect(sorted[1].priority < sorted[2].priority).toBe(true);
		});

		it('does not split on commas inside a query bracket', function() {
			var sorted = styler.sortStyles({ '.c[platform=ios,android]': { z: 1 } });
			expect(sorted.length).toBe(1);
			expect(sorted[0].key).toBe('c');
			expect(sorted[0].queries).toEqual({ platform: ['ios', 'android'] });
		});

		it('splits selectors with queries and keeps the query on its own selector only', function() {
			var sorted = styler.sortStyles({ '.x[platform=ios], .y': { z: 1 } });
			expect(sorted.length).toBe(2);

			var x = byKey(sorted, 'x')[0];
			var y = byKey(sorted, 'y')[0];
			expect(x.queries).toEqual({ platform: ['ios'] });
			expect(y.queries).toBeUndefined();
			expect(x.style).toEqual({ z: 1 });
			expect(y.style).toEqual({ z: 1 });
		});

		it('handles a bracketed query with a comma next to a plain selector', function() {
			var sorted = styler.sortStyles({ '.a[platform=ios,android], .b[formFactor=handheld]': { z: 1 } });
			expect(sorted.length).toBe(2);
			expect(byKey(sorted, 'a')[0].queries).toEqual({ platform: ['ios', 'android'] });
			expect(byKey(sorted, 'b')[0].queries).toEqual({ formFactor: 'handheld' });
		});

		it('ignores a trailing comma', function() {
			var sorted = styler.sortStyles({ '.a,': { q: 1 } });
			expect(sorted.length).toBe(1);
			expect(sorted[0].key).toBe('a');
		});

		it('ignores a trailing comma followed by whitespace', function() {
			var sorted = styler.sortStyles({ '.a, ': { q: 1 } });
			expect(sorted.length).toBe(1);
			expect(sorted[0].key).toBe('a');
		});

		it('ignores empty chunks between commas', function() {
			var sorted = styler.sortStyles({ '.a,,.b, , .c': { q: 1 } });
			expect(_.map(sorted, 'key')).toEqual(['a', 'b', 'c']);
		});

		it('trims whitespace around each selector', function() {
			var sorted = styler.sortStyles({ '  .a  ,\t.b\n,  #c ': { q: 1 } });
			expect(_.map(sorted, 'key')).toEqual(['a', 'b', 'c']);
		});

		it('gives each selector from one key its own style object', function() {
			var sorted = styler.sortStyles({ '.a, .b': { color: 'red', font: { fontSize: 12 } } });
			var a = byKey(sorted, 'a')[0];
			var b = byKey(sorted, 'b')[0];

			expect(a.style).not.toBe(b.style);
			expect(a.style.font).not.toBe(b.style.font);

			a.style.color = 'blue';
			a.style.font.fontSize = 20;
			expect(b.style.color).toBe('red');
			expect(b.style.font.fontSize).toBe(12);
		});

		it('does not mutate the original style object when a key is split', function() {
			var original = { '.a, .b': { color: 'red' } };
			var sorted = styler.sortStyles(original);
			sorted[0].style.color = 'blue';
			expect(original['.a, .b'].color).toBe('red');
		});

		it('still reuses the style object for a single selector', function() {
			var style = { color: 'red' };
			var sorted = styler.sortStyles({ '.a': style });
			expect(sorted.length).toBe(1);
			expect(sorted[0].style).toBe(style);
		});

		it('leaves single selectors untouched next to comma-separated keys', function() {
			var sorted = styler.sortStyles({
				'.a, .b': { color: 'red' },
				'#x': { w: 1 },
				'Label': { h: 2 }
			});
			expect(sorted.length).toBe(4);
			expect(_.map(sorted, 'key')).toEqual(['Label', 'a', 'b', 'x']);
		});

		it('appends split entries to an existing style', function() {
			var existing = styler.sortStyles({ 'Label': { h: 2 } });
			var sorted = styler.sortStyles({ '.a, .b': { color: 'red' } }, { existingStyle: existing });
			expect(sorted.length).toBe(3);
			expect(_.map(sorted, 'key')).toEqual(['Label', 'a', 'b']);
		});

		it('applies platform and theme priority bumps to every split entry', function() {
			var plain = styler.sortStyles({ '.a, .b': { q: 1 } });
			var bumped = styler.sortStyles({ '.a, .b': { q: 1 } }, { platform: 'ios', theme: 'dark' });
			_.each(bumped, function(entry, i) {
				// ORDER increments are tiny (0.0001 per entry), the platform+theme
				// bump is 100.9, so a > comparison is enough here
				expect(entry.priority - plain[i].priority > 100).toBe(true);
			});
		});

		describe('invalid selectors', function() {
			it('dies on an invalid part of a comma-separated key', function() {
				expect(function() {
					styler.sortStyles({ '.a, [broken': { q: 1 } });
				}).toThrow();
				expect(died.length).toBe(1);
				expect(died[0]).toBe('Invalid style specifier "[broken"');
			});

			it('does not die on a whitespace-only part after a trailing comma', function() {
				expect(function() {
					styler.sortStyles({ '.a, ': { q: 1 } });
				}).not.toThrow();
				expect(died.length).toBe(0);
			});
		});
	});

	describe('loadStyle() + sortStyles() from a .tss file', function() {
		var sorted;

		it('loads the multi-classes fixture', function() {
			var loaded = styler.loadStyle(fixtureTss);
			expect(_.isObject(loaded)).toBe(true);
			expect(loaded['#header, #footer']).toBeDefined();
			expect(loaded['.heading, Button']).toBeDefined();
			sorted = styler.sortStyles(loaded);
		});

		it('expands "#header, #footer" into two id entries', function() {
			var header = byKey(sorted, 'header');
			var footer = byKey(sorted, 'footer');
			expect(header.length).toBe(1);
			expect(footer.length).toBe(1);
			expect(header[0].isId).toBe(true);
			expect(footer[0].isId).toBe(true);
			expect(header[0].style).toEqual(footer[0].style);
			expect(header[0].style).not.toBe(footer[0].style);
		});

		it('expands ".heading, Button" into a class and an API entry', function() {
			var heading = byKey(sorted, 'heading');
			var button = byKey(sorted, 'Button');
			expect(heading.length).toBe(1);
			expect(button.length).toBe(1);
			expect(heading[0].isClass).toBe(true);
			expect(button[0].isApi).toBe(true);
			expect(heading[0].style.top).toBe(10);
			expect(button[0].style.top).toBe(10);
		});

		it('keeps ".button[platform=ios,android]" as a single entry', function() {
			var buttons = byKey(sorted, 'button');
			var withQuery = _.filter(buttons, function(b) { return b.queries; });
			expect(withQuery.length).toBe(1);
			expect(withQuery[0].queries).toEqual({ platform: ['ios', 'android'] });
			expect(withQuery[0].style).toEqual({ width: 200 });
		});

		it('applies the query only to ".muted" in ".muted[platform=ios], #secondary"', function() {
			var muted = byKey(sorted, 'muted')[0];
			var secondary = byKey(sorted, 'secondary')[0];
			expect(muted.queries).toEqual({ platform: ['ios'] });
			expect(secondary.queries).toBeUndefined();
			expect(muted.style).toEqual({ opacity: 0.5 });
			expect(secondary.style).toEqual({ opacity: 0.5 });
		});

		it('ignores the trailing comma in ".button,"', function() {
			var plain = _.filter(byKey(sorted, 'button'), function(b) { return !b.queries; });
			expect(plain.length).toBe(1);
			expect(plain[0].style).toEqual({ height: 44 });
			// no entry was created for an empty selector
			expect(byKey(sorted, '').length).toBe(0);
			expect(byKey(sorted, 'undefined').length).toBe(0);
		});
	});
});
