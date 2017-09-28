$.index.open();

var personCol = Alloy.createCollection('user');

personCol.on('reset', function() {
	alert('reset');
});

personCol.fetch();