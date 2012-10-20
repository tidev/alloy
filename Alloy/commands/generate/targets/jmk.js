var path = require('path'),
	fs = require('fs'),
	logger = require('../../../common/logger'),
	U = require('../../../utils'),
	alloyRoot = path.join(__dirname,'..','..','..');

module.exports = function(name, args, program) {
	var filename = 'alloy.jmk';
	var filepath = path.join(program.projectDir,'app',filename);
	var templatePath = path.join(alloyRoot,'template',filename);
	
	// only overwrite if using force option
	if (path.existsSync(filepath) && !program.force) {
		U.die('"alloy.jmk" file already exists. Use "-f,--force" to overwrite.');
	}

	// write template to Alloy project
	fs.writeFileSync(filepath, fs.readFileSync(templatePath, 'utf8'));

	logger.info('Generated "' + filename + '" compiler hooks file.');
}