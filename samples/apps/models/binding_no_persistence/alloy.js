Alloy.Models.appState = new Backbone.Model({
	counter: 1,
	color: '#00f'
});

Alloy.Collections.heroes = new Backbone.Collection();
Alloy.Collections.heroes.reset([
	{ name: 'Ironman' },
	{ name: 'Superman' },
	{ name: 'Thor' },
	{ name: 'Captain America' },
	{ name: 'Hulk' },
	{ name: 'Green Lantern' },
	{ name: 'Punisher' },
	{ name: 'Spiderman' },
	{ name: 'Wolverine' },
	{ name: 'Cyclops' }
]);