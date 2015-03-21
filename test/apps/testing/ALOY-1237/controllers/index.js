function doOpen() {
	// Showing the all events in this controller
	var events = $.getEvents();
	_.each(events, function(event){
		console.log(event);
	});
}

function doClose() {
	// Window closed event
}

// Once event fire, you do not fire again.
// All events was nothing in this controller.
function doClick() {
	$.removeEvents();
	console.log('Removed the all events in this controller');
}

$.index.open();
