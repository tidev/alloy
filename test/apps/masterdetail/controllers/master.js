$.table.setData([
	Ti.UI.createTableViewRow({"title":"Alcatraz", "image":"smallpic1.jpg"}),
	Ti.UI.createTableViewRow({"title":"American Flag", "image":"smallpic2.jpg"}),
	Ti.UI.createTableViewRow({"title":"Penitentiary Sign", "image":"smallpic3.jpg"})
]);

$.table.addEventListener('click', function(e) {
	exports.fireEvent('rowClick', {image:e.row.image});
});