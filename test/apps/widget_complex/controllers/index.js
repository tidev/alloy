function postLayout(args) {
	$.sfb.setHandlers({
		success: function(books) {
			var data = [];
			_.each(books, function(book) {
				var row = new (Alloy.getController('row'))({
					title: book.title,
					authors: book.authors,
					image: book.image
				}).getRoot();
				data.push(row);
			});
			$.table.setData(data);
		}
		// You can override error handling with the 'error' property
		// error: function(e) {
		// 	alert('ERROR: ' + e.error);
		// }
	});
	$.win.open();
}
