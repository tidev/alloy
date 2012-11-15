var moment = require('moment');
var todos = Alloy.Collections.todo;
var id;

// $model represents the current model accessible to this 
// controller from the markup's model-view binding. $model
// will be null if there is no binding in place. 

if ($model) {
	id = $model.get('id');
	if ($model.get('done')) {
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
	// toggle the "done" status of the IDed todo
	var todo = todos.get(id);
	todo.set({
    		"done": todo.get('done') ? 0 : 1,
    		"date_completed": moment().unix()
  	}).save();

  	// update views from sql storage
  	todos.fetch();
}

function deleteTask(e) {
	// delete the IDed todo from the collection
	var todo = todos.get(id);
	todos.remove(todo);
	todo.destroy();

  	// update views from sql storage
  	todos.fetch();
}