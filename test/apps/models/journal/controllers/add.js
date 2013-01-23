var moment = require('alloy/moment');
var journal = Alloy.Collections.journal;

function focusText() {
    $.text.focus();
}

function closeKeyboard(e) {
    e.source.blur();
}

function getMood(moodComponent) {
    if (OS_IOS) {
        switch(moodComponent.index) {
            case 0:
                return 'happy';
            case 2:
                return 'mad';
            case 1:
            default:
                return 'neutral';
        }
    } else {
        return moodComponent.getSelectedRow(0).title;
    }
}

function addEntry() {
    // create a new model instance based on user input
    var entry = Alloy.createModel('journal', {
        title : $.title.value,
        text: $.text.value,
        mood: getMood($.mood),
        dateCreated: moment().format('YYYYMMDDHHmmss')
    });

    // Add new model to the collection, use silent=true
    // so that a "change" event is not fired and the
    // UI is re-rendered.
    journal.add(entry, {silent:true});

    // Save the entry to persistence, which will re-render
    // the UI based on the binding.
    entry.save();

    closeWindow();
}

function closeWindow() {
    $.addWin.close();
}
