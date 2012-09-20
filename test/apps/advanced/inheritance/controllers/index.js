$.index.open();

function openDialog(e) {  
    Alloy.createController(e.source.title, {
    	message: 'Opened ' + e.source.title
    }).openDialog($.index);
}
