var path = require('path'),
	fs = require('fs'),
	U = require('../../utils'),
	_ = require("../../lib/alloy/underscore")._,
	logger = require('../../common/logger');

module.exports = function(name, args, program) {
	var vn = path.join(program.outputPath,'views',name+'.xml');
	var sn = path.join(program.outputPath,'styles',name+'.json');
	var templatePath = path.join(__dirname,'..','..','template');
	var viewTemplate = path.join(templatePath, 'view.js');
	var styleTemplate = path.join(templatePath, 'style.json');

	// validate paths
	if (path.existsSync(vn) && !program.force) {
		U.die("View file already exists: "+vn);
	}
	if (path.existsSync(sn) && !program.force) {
		U.die("Style file already exists: "+sn);
	}
	
	// write out view and style files based on templates
	var XML  = _.template(fs.readFileSync(viewTemplate,'utf8'), {}),
		JSON = _.template(fs.readFileSync(styleTemplate,'utf8'), {});
	fs.writeFileSync(vn,XML);
	fs.writeFileSync(sn,JSON);

	logger.info('Generated view and styles named '+name);
}