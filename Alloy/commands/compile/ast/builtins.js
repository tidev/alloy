var path = require('path'),
	_ = require('../../../lib/alloy/underscore')._,
	jsp = require('../../../uglify-js/uglify-js').parser,
	pro = require('../../../uglify-js/uglify-js').uglify,
	logger = require('../../../common/logger'),
	U = require('../../../utils');

var EXCLUDE = ['backbone','CFG','underscore'];
var BUILTINS_PATH = path.join(__dirname,'..','..','..','builtins');

function appendExtension(file, extension) {
	extension = '.' + extension;
	file = U.trim(file);

	var len = extension.length;
	if (file.substring(file.length - extension.length) !== extension) {
		return file + extension;
	} else {
		return file;
	}
}

exports.process = function(ast, config, report) {
	report.builtins = report.builtins || [];

	function processCall() {
		var func = this[1];
		var params = this[2];
		var rx = /^alloy\/(.+)$/;
		var match;

		if (func[0] === 'name' && func[1] === 'require' &&  // Is this a require call?
			params[0] && params[0][0] === 'string' &&       // Is the 1st param a literal string?
			(match = params[0][1].match(rx)) !== null &&    // Is it an alloy builtin?
			!_.contains(EXCLUDE, match[1])                  // Make sure it's not excluded. 
		) {
			var name = appendExtension(match[1], 'js');
			var source = path.join(BUILTINS_PATH,name);

			// add builtin to array if we find it
			if (path.existsSync(source)) {
				report.builtins = _.union(report.builtins, [source]);
			}
		}
	}

	var w = pro.ast_walker();
	w.with_walkers(
		{ 'call': processCall }, 
		function() { return w.walk(ast);}
	);
	
	return ast;
}

exports.postProcess = function(config, report) {

}