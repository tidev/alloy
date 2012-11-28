var path = require('path'),
	wrench = require('wrench'),
	CU = require('../compilerUtils'),
	U = require('../../../utils'),
	CONST = require('../../../common/constants'),
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
		U.dieWithNode(node, 'All <Collection> elements must be a direct child of <Alloy>');
	}
	
	// Make sure there's models to be used as the "src" of the <Collection>>
	var modelsPath = path.join(CU.getCompilerConfig().dir.home,CONST.DIR.MODEL);
	var validModels;
	if (!path.existsSync(modelsPath) || !(validModels = wrench.readdirSyncRecursive(modelsPath)).length) {
		U.dieWithNode(node, [
			'You must have a valid model in your app/' + CONST.DIR.MODEL + ' folder to create a <Collection>',
			'Once you have a valid model, assign it like this for a singleton:',
			'  <Collection src="yourModelName"/>',
			'Or like this for an instance:',
			'  <Collection src="yourModelName" instance="true" id="someId"/>'
		]);
	}
	//var validModels = wrench.readdirSyncRecursive(modelsPath);

	// Make sure we have a valid model src
	var validModelsPrint = '[' + _.map(validModels, function(s) { return s.replace(/\.js$/,''); }).join(',') + ']';
	if (!src) { 
		U.dieWithNode(node, [
			'All collections must have a "src" attribute which identifies its base model',
			'"src" should be the name of a model in your app/' + CONST.DIR.MODEL + ' folder',
			'Valid models: ' + validModelsPrint
		]); 
	} else {
		var modelPath = path.join(modelsPath,src + '.' + CONST.FILE_EXT.MODEL);
		if (!path.existsSync(modelPath)) {
			U.dieWithNode(node, [
				'"src" attribute\'s model "' + src + '" does not exist in app/' + CONST.DIR.MODEL,
				'Valid models: ' + validModelsPrint
			]);
		}
	}
	var createCall = 'Alloy.createCollection(\'' + src + '\')';

	// create code based on whether the collection is a singleton or instance
	if (isSingleton) {
		if (id) {
			logger.warn([
				'Warning with <Collection> at line ' + node.lineNumber,
				'id="' + id + '" will be ignored, as only Collection instances can have ids, not singletons',
				'To create an instance of the Collection, add instance="true"',
				'This instance will be accessible in your controller as $.' + id,
				'Example: ',
				'  <Collection src="' + src + '" id="' + id + '" instance="true"/>'
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