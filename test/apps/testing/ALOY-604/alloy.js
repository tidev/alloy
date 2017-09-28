var data = Alloy.Collections.data = new Backbone.Collection();
var models = [];
for (var i = 0; i < 20; i++) {
	models.push({text: 'label #' + (i + 1)});
}
data.reset(models);