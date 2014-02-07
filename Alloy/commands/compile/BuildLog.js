var fs = require('fs'),
	path = require('path'),
	wrench = require('wrench'),
	CONST = require('../../common/constants'),
	logger = require('../../logger');

var dir, file, projectPath;

function BuildLog(_projectPath) {
	// make/reference singleton instance
	if (BuildLog.instance) {
		return BuildLog.instance;
  }
	BuildLog.instance = this;

	// set "private" variables
	projectPath = _projectPath;
	dir = path.join(projectPath, CONST.DIR.BUILD);
	file = path.join(dir, 'build.json');

	// expose data object
	this.isNew = true;
	this.data = {};

	// make sure the alloy build folder exists
	if (!fs.existsSync(dir)) {
		wrench.mkdirSyncRecursive(dir, 0755);
	}

	// load it up
	this.read();
}

BuildLog.prototype.read = function() {
	if (!fs.existsSync(file)) {
		this.isNew = true;
		this.data = {};
	} else {
		this.isNew = false;
		try {
			this.data = JSON.parse(fs.readFileSync(file, 'utf8'));
		} catch (e) {
			logger.warn('Build log at "' + path.relative(projectPath, file) +
				'" is corrupt, creating a new one...');
			this.data = {};
		}
	}
};

BuildLog.prototype.write = function() {
	try {
		fs.writeFileSync(file, JSON.stringify(this.data));
	} catch (e) {
		logger.warn('Unable to write build log to "' + path.relative(projectPath, file) + '"');
	}
};

module.exports = BuildLog;