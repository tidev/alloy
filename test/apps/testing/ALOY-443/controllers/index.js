Alloy.Models.book.set({
	'title':  'The Death of Ivan Ilyich',
	'author': 'Leo Tolstoy'
});

Alloy.Collections.book.trigger('change');

$.index.open();
