var Image = Backbone.Model.extend();
var Images = Backbone.Collection.extend({
	model: Image
});
Alloy.Collections.images = new Images();
Alloy.Collections.images.reset([
	{ url: '/appc1.png' },
	{ url: '/appc2.png' },
	{ url: '/appc3.png', width: 100, height: 100 },
	{ url: '/appc4.png', width: 50, height: 50 }
]);