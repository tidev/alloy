var model = Alloy.Models.book;
function doClick(e) {
	model.set("title", "Atlas Shrugged");
	model.set("author", "Ayn Rand");
	model.set("genre", "Dystopia");
}

$.index.open();
