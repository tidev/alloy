function filterItems(collection) {
	return collection.where({enabled:true});
}

if (OS_IOS) {
	Alloy.Collections.items.trigger('change');
}

$.index.open();