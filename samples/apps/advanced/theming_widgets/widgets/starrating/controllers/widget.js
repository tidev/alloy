var args = arguments[0] || {},
	stars = [],
	rating = 0,
	max = 5;

// public method to set the rating
var setRating = function(newRating) {
	// save newRating to the instance's rating property
	if (newRating > max) {
		newRating = max;
	}
	rating = newRating;

	// use a loop to set the stars[i].image property
	// using the half-image for fractional values
	for (var i = 0, l = stars.length; i < l; i++) {
		if (i >= rating) {
			stars[i].image = WPATH('star_off.png');
		} else if (rating > i && rating < i + 1) {
			stars[i].image = WPATH('star_half.png');
		} else {
			stars[i].image = WPATH('star.png');
		}
	}
};
exports.setRating = setRating;

// public method to get current rating
exports.getRating = function() {
	return rating;
};

// private method
var createStars = function(num, cb) {
	for (var i = 0; i < num; i++) {
		// define the image view
		var star = Alloy.createWidget('starrating', 'star').getView();

		// use a closure (self-calling function) to add
		// a click-event listener that calls setRating
		// passing the value of i+1
		(function() {
			var index = i;
			star.addEventListener('click', function() {
				setRating(index + 1);
				cb(index + 1);
			});
		})();
		// add the star image to the stars array
		stars.push(star);
		// add the star image to the instance view
		$.starrating.add(star);
	}
};

exports.init = function (callback) {
	var max = args.max || 5,
		initialRating = args.initialRating || 0,
		cb = callback || function() {};
	createStars(max, cb);
	setRating(initialRating);
	// can't apply view properties from the calling context when you use this widget
	// without coding them in to this controller, alloy limitation as of this writing
	_.extend($.starrating, args);

};












