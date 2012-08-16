$.index.open();

function openDialog(e) {  
    Alloy.getController(e.source.title).openDialog($.index);
}
