/**
 * Returns a random number with the number of digits specified
 * @param {Number} _number The number of digits
 */
exports.getRandomNumber = function(numDigits) {
	var num = numDigits || 10,
		mult = Math.pow(10, num - 1);
	if (num !== 1) {
		return Math.floor(Math.random() * mult * 0.9) + mult;
	} else {
		return Math.round(Math.random() * 10);
	}
};