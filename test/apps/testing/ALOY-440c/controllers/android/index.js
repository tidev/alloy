Alloy.Collections.book.fetch();

var i = 0;

function doClick(e) {
	Ti.API.info(JSON.stringify(e));
	var item = Alloy.createModel('book', {title: i});
	Alloy.Collections.book.add(item);
	i++;
}

$.index.open();