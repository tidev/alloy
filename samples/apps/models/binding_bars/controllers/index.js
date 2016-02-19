if (OS_IOS) {
	function filterItems(collection) {
		return collection.where({enabled:true});
	}
	Alloy.Collections.items.trigger('change');
}

$.index.open();