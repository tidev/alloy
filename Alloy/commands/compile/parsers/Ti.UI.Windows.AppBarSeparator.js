exports.parse = function(node, state) {
	return require('./base').parse(node, state, parse);
};

function parse(node, state, args) {
	// Generate runtime code using default
	return require('./default').parse(node, state);
}
