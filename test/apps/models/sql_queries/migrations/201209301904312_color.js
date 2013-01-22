var colors = [
	{ color: 'blue', link: 'http://en.wikipedia.org/wiki/Blue', hexCode: '#0000ff', wavelength: '450 to 495 nm' },
	{ color: 'red', link: 'http://en.wikipedia.org/wiki/Red', hexCode: '#ff0000', wavelength: '-620 to -740 nm' },
	{ color: 'orange', link: 'http://en.wikipedia.org/wiki/Orange_(colour)', hexCode: '#ff7f00', wavelength: '590 to 620 nm' }
];

migration.up = function(migrator) {
	// table already created by db_file

	for (var i = 0; i < colors.length; i++) {
		migrator.insertRow(colors[i]);
	}
};

migration.down = function(migrator) {
	migrator.dropTable("colors");
};
