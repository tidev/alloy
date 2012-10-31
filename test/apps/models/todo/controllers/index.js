var moment = require("moment");
var todos = Alloy.globals.todos;

if (OS_MOBILEWEB) {
	alert('SQLite adapter not supported on mobileweb');
} else {
	$.todoWin.open();
	
	// set up handler for fetch
	todos.on('fetch', function() {
    updateContent(todos);
	});
	
	// update table content when fetch is fired
	function updateContent(_collection) {
	    var rows = [], i = 0, len = _collection.length;
	    for (; i < len; i++) {
	        var _i = _collection.at(i);
	        	rows.push(Alloy.createController('row', { item: _i }).getView());
	    }
	    $.todoTable.setData(rows);
	};
	
	// open the "add item" window
	function addToDoItem() {
	    Alloy.createController("add").getView().open();
	}

	// load the todos from sql storage
	todos.fetch({ add: false });
}