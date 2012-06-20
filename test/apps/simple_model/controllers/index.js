
// using the model, fetch the model contents -- this will depend on the storage
// type (such as ACS, local storage, REST, etc). how this data will be retrieved
// the todos is a collection of todo model objects
$.todo.fetch(function(todos) {
	
	var rows = [];

	// create a new table view row from the defined template and then
	// bind each todo model item to the row
	$.todos.each(function(todo)
	{
		// notice that the createRowTemplate is a special Alloy function that will
		// create a table view row from the TableViewRowTemplate XML and bind the data from the 
		// row model into the template
		var row = $.table.createRowTemplate(todo);

		// add the row to our array
		rows.push(row);

		// subscribe to the model change event and rebind the data
		todo.on("change",function(){
			row.bind(todo);
		});
	});

	// set the table data
	$.table.setData(rows);
	
});

$.index.open();
