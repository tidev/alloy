/**
 * @class Alloy.widgets.bookSearchView
 * The bookSearchView widget sends a query to the Google Books API to retrieve book data and
 * presents the results in a table. Unlike the searchForBooks widget, this widget processes
 * and presents the search results.
 *
 * ### Usage
 *
 * To use the widget, first add it as a dependency in the `config.json` file:
 *
 *     "dependencies": {
 *         "com.appcelerator.bookSearchView":"1.0"
 *     }
 *
 * Next, add it to a view in the project, using the Widget tag:
 *
 *     <Widget id="bsv" src="com.appcelerator.bookSearchView"/>
 *
 * Note: the `id` attribute is a unique identfier and can be anything. `bsv` is just an example.
 */
$.sfb.setHandlers({
	success: function(books) {
		var data = [];
		_.each(books, function(book) {
			var row = Alloy.createWidget('com.appcelerator.bookSearchView', 'row', {
				title: book.title,
				authors: book.authors,
				image: book.image
			}).getView();
			data.push(row);
		});
		$.table.setData(data);
	}
});
