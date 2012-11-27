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
	var collectionVar;
	
	if (!src) { 
		U.die([
			'Error processing <Collection>:',
			'All collections must have a "src" attribute'
		]); 
	} else {
		// TODO: validate the src exists
	}
	var createCall = 'Alloy.createCollection(\'' + src + '\')';

	if (isSingleton) {
		if (id) {
			logger.warn([
				'id="' + id + '" ignored in singleton <Collection> at line ' + node.lineNumber,
				'id is always equal to src attribute with singleton',
				'Use instance="true" to create a new instance of the collection.'
			]);
		} 
		collectionVar = 'Alloy.Collections[\'' + src + '\']';
		code += collectionVar + ' || (' + collectionVar + ' = ' + createCall + ');';
	} else {
		id || (id = args.id);
		collectionVar = '$.' + id;
		code += collectionVar + ' = ' + createCall + ';';
	}
	
	return {
		code: '',
		modelCode: code,
		args: {
			symbol: collectionVar
		}
	};
};