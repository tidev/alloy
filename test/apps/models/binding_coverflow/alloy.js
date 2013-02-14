var Image = Backbone.Model.extend();
var Images = Backbone.Collection.extend({
	model: Image
});
Alloy.Collections.images = new Images();
Alloy.Collections.images.reset([
	{ url: '/image1.png' },
	{ url: '/image2.png' },
	{ url: '/image3.png', width: 100, height: 100 },
	{ url: '/image4.png', width: 50, height: 50 }
]);