function onItemClick(e) {
	// get the clicked section
	var section = $.list.sections[e.sectionIndex];

	// get the clicked item from that section
	var item = section.getItemAt(e.itemIndex);

	// print the item's title
	Ti.API.info('itemclick: ' + item.properties.title);
}