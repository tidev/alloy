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
