function addItem() {
    var todos = Alloy.Collections.todo;

    // Create a new model for the todo collection
    var task = Alloy.createModel('Todo', {
        item : $.itemField.value,
        done : 0
    });

    // add new model to the global collection
    todos.add(task);

    if (task.isValid()) {
        // save the model to persistent storage
        task.save();
    } else {
        task.destroy();
    }

    // reload the tasks
    todos.fetch();

    closeWindow();
}

function focusTextField() {
    $.itemField.focus();
}

function closeKeyboard(e) {
    e.source.blur();
}

function closeWindow() {
    $.addWin.close();
}
