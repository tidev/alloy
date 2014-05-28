var moreItems = [];
for (var i = 0; i < 5; i++) {
	moreItems.push({
		template: 'template',
		type:{
			text: "row " + i
		}
	});
}

$.list.sections[0].items = $.list.sections[0].items.concat(moreItems);
$.index.open();
