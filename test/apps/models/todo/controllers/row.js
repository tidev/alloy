var moment = require('moment');
var todos = Alloy.Globals.todos;
var args = arguments[0] || {};
var id;

if (args.todo) {
	$.task.text = args.todo.get('item');
	id = args.todo.get('id');

	if (args.todo.get('done')) {
		$.row.backgroundColor = '#eee';
		$.check.backgroundColor = '#eee';
		$.task.color = '#ccc';
		$.check.image = '/tick_64.png';
	} else {
		$.row.backgroundColor = '#fff';
		$.check.backgroundColor = '#fff';
		$.task.color = '#000';
		$.check.image = '/tick_gray_64.png';
	}
}

function toggleStatus(e) {
	var todo = todos.get(id);
	
	// toggle the "done" status of the IDed todo
	todo.set({
    "done": todo.get('done') ? 0 : 1,
    "date_completed": moment().unix()
  }).save();

  // update views from sql storage
  todos.fetch({ add : false });
}

function deleteTask(e) {
	// delete the IDed todo from the collection
	var todo = todos.get(id);
	todos.remove(todo);
	todo.destroy();

  // update views from sql storage
  todos.fetch({ add : false });
}