var logger = require('../../common/logger');

module.exports = function(args, program) {
	logger.warn('hook command not yet implemented');
}

// var path = require('path'),
// 	wrench = require('wrench'),
// 	appc = require('node-appc'),
// 	logger = require('../../common/logger'),
// 	alloyRoot = path.join(__dirname,'..','..','..'); 

// var HOOK_NAME = 'alloy.js';

// module.exports = function(args, program) {
// 	// establish the Titanium path for this system
// 	var installPath = appc.fs.resolvePath(appc.environ.os.sdkPaths[0], 'modules', 'alloy');
// 	logger.info('Installing Alloy hook "' + HOOK_NAME + '" into Titanium...');

// 	// blast the existing hooks path for Alloy
// 	wrench.rmdirSyncRecursive(installPath, true);

// 	// Copy the Alloy hook into Titanium
// 	var hookPath = appc.fs.resolvePath(alloyRoot, 'hooks', HOOK_NAME);
// 	var destPath = path.join(installPath, appc.pkginfo.package(module).version, 'cli', 'hooks', HOOK_NAME);
// 	appc.fs.copyFileSync(hookPath, destPath);

// 	logger.info('Installed "hooks/' + HOOK_NAME + '" to "' + destPath + '"');
// }
