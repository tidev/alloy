// pre-populate collection, if necessary
var movies = Alloy.Collections.movies;
movies.fetch();
if (movies.length === 0) {
	var list = ['Fight Club', 'Braveheart', 'District 9', 'LA Confidential', 'Seven Samurai'];
	_.each(list, function(title) {
		movies.create({ title: title });
	});
}

if (OS_IOS) {
	Alloy.Globals.navgroup = $.index;
}
$.index.open();
