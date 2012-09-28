/**
 * Alloy
 * Copyright (c) 2012 by Appcelerator, Inc. All Rights Reserved.
 * See LICENSE for more information on licensing.
 */

exports.init = function (logger, config, cli) {

	cli.addHook('prebuild', function (data, finished) {
		finished();
	});
	
};
