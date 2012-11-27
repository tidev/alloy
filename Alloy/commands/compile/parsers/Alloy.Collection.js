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

	// Make sure the parent is <Alloy>
	if (!node.parentNode || node.parentNode.nodeName !== 'Alloy') {
		U.die([
			'<Collection> at line ' + node.lineNumber + ' is not a child of <Alloy> element',
			'All <Collection> elements must be a direct child of <Alloy>.'
		]);
	}
	
	// Make sure we have a valid model src
	if (!src) { 
		U.die([
			'Error processing <Collection>:',
			'All collections must have a "src" attribute'
		]); 
	} else {
		// TODO: validate the src exists
	}
	var createCall = 'Alloy.createCollection(\'' + src + '\')';

	// create code based on whether the collection is a singleton or instance
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
		modelCode: code, // modelCode will add this before the UI code
		args: {
			symbol: collectionVar
		}
	};
};