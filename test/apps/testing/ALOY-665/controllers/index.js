var touch = {
	start: function(e) {
		Ti.API.info('touchstart');
	},
	end: {
		func: function(e) {
			Ti.API.info('touchend');
		}
	}
};

function doSwipe(e) {
	Ti.API.info('swipe: ' + e.direction);
}

$.index.open();