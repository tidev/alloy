/**
 * Adds thousands separators to a number
 * @param {Number} _number The number to perform the action on
 */
exports.formatNumber = function(_number) {
	_number = _number + "";

	x = _number.split(".");
	x1 = x[0];
	x2 = x.length > 1 ? "." + x[1] : "";

	var expression = /(\d+)(\d{3})/;

	while(expression.test(x1)) {
		x1 = x1.replace(expression, "$1" + "," + "$2");
	}

	return x1 + x2;
};
