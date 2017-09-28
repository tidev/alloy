var collection;
if (Alloy.CFG.useAlloyModel) {
	Ti.API.info('Using full Alloy model');
	collection = Alloy.createCollection('collection');
	collection.fetch();
} else {
	Ti.API.info('Using plain old Backbone model');
	collection = new Backbone.Collection();
	var models = [];
	for (var i = 0; i < 20; i++) {
		models.push({text: 'label ' + (i + 1)});
	}
	collection.reset(models);
}

Alloy.Collections.collection = collection;