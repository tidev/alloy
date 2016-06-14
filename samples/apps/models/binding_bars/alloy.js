if (OS_IOS) {
	var Item = Backbone.Model.extend();
	var Items = Backbone.Collection.extend({
		model: Item
	});
	Alloy.Collections.items = new Items();
	Alloy.Collections.items.reset([
		{ title: 'button 1', enabled: true },
		{ title: 'button 2', enabled: false },
		{ title: 'button 3', enabled: true }
	]);
}