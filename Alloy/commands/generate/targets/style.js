var basePath = '../../../';
var path = require('path'),
	fs = require('fs-extra'),
	walkSync = require('walk-sync'),
	xml2tss = require('xml2tss'),
	GU = require('../generateUtils'),
	U = require(basePath + 'utils'),
	CONST = require(basePath + 'common/constants'),
	logger = require(basePath + 'logger');

// a recursive function to generate styles since xml2tss is async
function generateStyles(targets) {
	if (targets.length > 0) {
		// generate style
		var current = targets.pop();
		xml2tss.updateFile(
			current.view_path,
			current.style_path,
			function(err, ok) {
				if (ok) {
					logger.info('Style generated: ' + current.style);
				}
				generateStyles(targets);
			}
		);
	}
}

module.exports = function(name, args, program) {
	var paths = U.getAndValidateProjectPaths(program.outputPath),
		view_root  = path.join(paths.app, CONST.DIR.VIEW),
		style_root = path.join(paths.app, CONST.DIR.STYLE),
		targets = [];
	if (name) {
		var info = GU.generate(name, 'STYLE', program);
		if (info) {
			logger.info('Generated style named ' + name);
		}
	} else if (program.all) {
		walkSync(view_root).forEach(function(view) {
			view = path.normalize(view);
			if (view.match('.xml$')) {
				var style = view.replace(/\.xml/, '.tss'),
					style_path = path.join(style_root, style),
					view_path  = path.join(view_root, view);

				// make sure the target folder exists
				var fullDir = path.dirname(style_path);
				if (!path.existsSync(fullDir)) {
					fs.mkdirpSync(fullDir);
				}
				targets.push({
					style:style,
					style_path: style_path,
					view_path:view_path
				});
			}
		});
		generateStyles(targets);
	} else {
		U.die("'alloy generate style' requires a file name, or the --all flag");
	}
};
