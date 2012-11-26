var CU = require('../compilerUtils'),
	U = require('../../../utils'),
	_ = require('../../../lib/alloy/underscore')._,
	logger = require('../../../common/logger');

exports.parse = function(node, state) {
	return require('./base').parse(node, state, parse);
};

function parse(node, state, args) {
	var code = '';
	var isSingleton = node.getAttribute('instance') !== 'true';
	var id = node.getAttribute('id');
	var src = node.getAttribute('src');
	
	if (!src) { 
		U.die([
			'Error processing <Collection>:',
			'All collections must have a "src" attribute'
		]); 
	} else {
		// TODO: validate the src exists
	}

	if (isSingleton) {
		if (id) {
			logger.warn([
				'id attribute ignored in singleton <Collection>',
				'id is always equal to src attribute with singleton',
				'Use the attribute `instance="true"` to create a new instance of the collection.'
			]);
		} 
		id = src;
	} else {
		id || (id = args.id);
	}

	var col = 'Alloy.Collections[\'' + id + '\']';
	code += col + ' || (' + col + ' = Alloy.createCollection(\'' + id + '\'));'
	
	return {
		code: '',
		modelCode: code,
		args: {
			symbol: col
		}
	};
};