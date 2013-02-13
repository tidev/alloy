var Location = Backbone.Model.extend();
var Locations = Backbone.Collection.extend({
	model: Location
});

Alloy.Collections.locations = new Locations();
Alloy.Collections.locations.reset([
	{ name: 'G.I. Lab', color: '#a00', direction: 'left' },
	{ name: 'Medical Treatment Unit', color: '#a00', direction: 'right' },
	{ name: 'Outpatient Surgery', color: '#a00', direction: 'left' },
	{ name: 'Telephone', color: '#a00', direction: 'right' },
	{ name: 'Central Village', color: '#008', direction: 'left' },
	{ name: 'Psychiatric Unit', color: '#008', direction: 'left' },
	{ name: 'Tower Elevators', color: '#05B8CC', direction: 'left' },
	{ name: 'Main Village', color: '#3B5323', direction: 'left' },
	{ name: 'Conference Center', color: '#3B5323', direction: 'left' },
	{ name: 'Parking Garage', color: '#3B5323', direction: 'left' },
	{ name: 'Suite A-D', color: '#3B5323', direction: 'left' }
]);
