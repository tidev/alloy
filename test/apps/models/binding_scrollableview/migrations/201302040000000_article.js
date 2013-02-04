var articles = [
	{ 
		image: 'june.jpg',
		title: '2 Year Old Makes Archeological Discovery',
		content: 'Lorem ipsum. Lorem ipsum. Lorem ipsum. Lorem ipsum. Lorem ipsum. Lorem ipsum. Lorem ipsum. Lorem ipsum. Lorem ipsum. Lorem ipsum. Lorem ipsum. Lorem ipsum. Lorem ipsum. Lorem ipsum. Lorem ipsum. Lorem ipsum. Lorem ipsum. Lorem ipsum. ' 
	},
	{ 
		image: 'apoc.jpg',
		title: 'Is The Apocalypse Coming?',
		content: 'Lorem ipsum. Lorem ipsum. Lorem ipsum. Lorem ipsum. Lorem ipsum. Lorem ipsum. Lorem ipsum. Lorem ipsum. Lorem ipsum. Lorem ipsum. Lorem ipsum. Lorem ipsum. Lorem ipsum. Lorem ipsum. Lorem ipsum. Lorem ipsum. Lorem ipsum. Lorem ipsum. ' 
	},
	{ 
		image: 'typography.jpg',
		title: 'Are Typography & Infographics Getting Old?',
		content: 'Lorem ipsum. Lorem ipsum. Lorem ipsum. Lorem ipsum. Lorem ipsum. Lorem ipsum. Lorem ipsum. Lorem ipsum. Lorem ipsum. Lorem ipsum. Lorem ipsum. Lorem ipsum. Lorem ipsum. Lorem ipsum. Lorem ipsum. Lorem ipsum. Lorem ipsum. Lorem ipsum. ' 
	}
];

migration.up = function(migrator) {
	for (var i = 0; i < articles.length; i++) {
		migrator.insertRow(articles[i]);
	}
};

migration.down = function(migrator) {
	for (var i = 0; i < articles.length; i++) {
		migrator.deleteRow(articles[i]);
	}
};
