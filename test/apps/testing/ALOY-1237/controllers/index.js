function doOpen() {
	var button = Ti.UI.createButton({
		right: 10,
		bottom: 10,
		left: 10,
		title: 'button'
	});
	$.index.add(button);
	$.addListener(button, 'click', function(e){
		// __trackId testing dummy event
		e.cancelBubble = true;
	});

	// manually add event
	$.addListener($.index, 'click', doWindowClick);

	$.addListener($.index, 'click', function(){
		_.each($.getListener($.index), function(listener){
			if (listener.type === 'click' &&
				listener.handler !== doWindowClick) {
				console.log('This is anonymous callback function');
				console.log(listener);
			}
		});
	});

	console.log('Showing the all events in this controller');
	console.log($.getListener());
}

// Once event fire, you do not fire again.
// All events to this window have been removed.
function doWindowClick() {
//	$.removeListener($.index);
	console.log('Removed the all events on this window');
}

// Once event fire, you do not fire again.
// All events was nothing in this controller.
function doClick() {
	$.removeListener();
	console.log('Removed the all events in this controller');
}

$.index.open();
