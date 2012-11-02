var moment = require("moment");
var todos = Alloy.globals.todos;
var INDEXES = {
	'All': 0,
	'Active': 1,
	'Done': 2
};

if (OS_MOBILEWEB) {
	alert('SQLite adapter not supported on mobileweb');
} else {
	$.todoWin.open();
	
	// set up handler for fetch
	todos.on('fetch', function() {
    updateContent(0);
	});

	// load the todos from sql storage
	todos.fetch({ add: false });
}

// update table content when fetch is fired
function updateContent(index) {
  var models = index === 0 ? todos.models : todos.where({ done: index === 1 ? 0 : 1 }),
  			rows = [];

	// create a row for each model in the colllection
  for (var i = 0; i < models.length; i++) {
    	rows.push(Alloy.createController('row', { 
    		todo: models[i] 
    	}).getView());
  }
  
  // set the data of the table with the newly created rows
  $.todoTable.setData(rows);
};

// open the "add item" window
function addToDoItem() {
  Alloy.createController("add").getView().open();
}

// Show task list based on selected status type
function showTasks(e) {
	updateContent(typeof e.index !== 'undefined' ? e.index : INDEXES[e.source.title]);
}