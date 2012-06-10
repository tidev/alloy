var Alloy = require("alloy");

var $w = Ti.UI.createWindow({
	id:"#window"
});

$w.startLayout();

var $index1 = Ti.UI.createView({
	id:"#index"
});


$w.add($index1);

var $table1 = Ti.UI.createTableView({
	id:"#table"
});

$index1.add($table1);

// Alloy.Model is a special class that would create our model, load our adapter, etc.
var $todo1 = Alloy.Model.create({
	"columns":
	{
		"name": "string",
		"done": "boolean"
	},
	"defaults":
	{
		"name":"",
		"done":false
	},
	"adapter": {
		"type": "sql",
		"tablename":"todos"
	}
});



// execute the controller inside a function block allowing us to 
// pass in the right scoped variable names for the controller by passing
// in the mangled names thare a local to the function block
(function(window, index, table, todo){

	todo._validate = function (key, value)
	{
		if (key == "name")
		{
			return value.length > 0;
		}
		return true;
	};
	
	todo.fetch(function(todos) {

		var rows = [];

		// create a new table view row from the defined template and then
		// bind each todo model item to the row
		todos.each(function(todo)
		{
			// notice that the createRowTemplate is a special Allow function that will
			// create a table view row from the TableViewRowTemplate XML and bind the data from the 
			// row model into the template
			var row = table.createRowTemplate(todo);

			// add the row to our array
			rows.push(row);

			// subscribe to the model change event and rebind the data
			todo.on("change",function(){
				row.bind(todo);
			});
		});

		// set the table data
		table.setData(rows);

	});
	
})($w, $index1, $table1, $todo1);



$w.finishLayout();
$w.open();