function doOpen() {

  // manually add event
  $.addListener($.index, 'click', doWindowClick);

	// Showing the all events in this controller
	_.each($.__events, function(event){
		console.log(event);
	});
}

// Once event fire, you do not fire again.
// All events to this window have been removed.
function doWindowClick() {
	$.removeListener($.index);
  console.log('Removed the all events on this window');
}

// Once event fire, you do not fire again.
// All events was nothing in this controller.
function doClick() {
	$.removeListener();
	console.log('Removed the all events in this controller');
}

$.index.open();
