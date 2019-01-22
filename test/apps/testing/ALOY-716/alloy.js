var collection = Alloy.Collections.collection = new Backbone.Collection();
var models = [];
for (var i = 0; i < 20; i++) {
	models.push({
		title: 'title #' + (i + 1),
		subtitle: 'this is a boring subtitle',
		image: '/' + Math.floor(Math.random() * 4) + '.png'
	});
}
collection.reset(models);