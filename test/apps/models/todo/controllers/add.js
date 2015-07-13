function addItem() {
    var todos = Alloy.Collections.todo;

    // Create a new model for the todo collection
    var task = Alloy.createModel('Todo', {
        item : $.itemField.value,
        done : 0
    });

    // add new model to the global collection, and make it
    // silent so we don't fire UI updates twice
    todos.add(task, { silent: true } );

    if (task.isValid()) {
        // save the model to persistent storage, which will give
        // a "server" id (sqlite) and update the UI
        task.save();
    } else {
        task.destroy();
    }

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
