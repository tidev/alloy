/**
 * Alloy
 * Copyright (c) 2012 by Appcelerator, Inc. All Rights Reserved.
 * See LICENSE for more information on licensing.
 */
const _ = require('lodash');
const colors = require('colors');
const CONST = require('./common/constants');
const fs = require('fs');
const logger = require('./logger');
const path = require('path');
const U = require('./utils');
const pkg = require('../package.json');

// patch to remove the warning in node >=0.8
path.existsSync = fs.existsSync || path.existsSync;

class Alloy {

	constructor({ program }) {

		this.program = program;
		//TODO:  Temporary fix until proper constructor parameters are configured
		if ( _.isNil(program)) {
			U.die('program is a required parameter ');
		}

		// Setup up logging output
		Error.stackTraceLimit = Infinity;
		logger.stripColors = program['colors'] === false;
		logger.logLevel = program['logLevel'] || logger.TRACE;
		if (program.config && program.config.indexOf('logLevel') !== -1) {
			logger.logLevel = -1;
		}

		if (!program.noBanner && program.args[0] !== 'info' && (program.config && program.config.indexOf('noBanner') === -1)) {
			this.banner();
		}

		if (program.args.length === 0) {
			var help = program.helpInformation();
			help = help.replace('Usage: turbo COMMAND [ARGS] [OPTIONS]', 'Usage: ' + 'alloy'.blue + ' COMMAND'.white + ' [ARGS] [OPTIONS]'.grey);
			help = logger.stripColors ? colors.stripColors(help) : help;
			console.log(help);
			process.exit(0);
		}

		if (program.platform && !_.includes(CONST.PLATFORM_FOLDERS_ALLOY, program.platform)) {
			U.die('Invalid platform "' + program.platform + '" specified, must be [' + CONST.PLATFORM_FOLDERS_ALLOY.join(',') + ']');
		}

		// Validate the given command
		this.command = program.args[0];
		if (!_.includes(this.getCommands(), this.command)) {
			U.die('Unknown command: ' + this.command.red);
		}

	}

	execute() {
	// Launch command with given arguments and options
		(require('./commands/' + this.command + '/index'))(this.program.args.slice(1), this.program);	
	}


	banner() {
		var str =
	'       .__  .__                \n' +
	'_____  |  | |  |   ____ ___.__.\n' +
	'\\__  \\ |  | |  |  /  _ <   |  |\n' +
	' / __ \\|  |_|  |_(  <_> )___  |\n' +
	'(____  /____/____/\\____// ____|\n' +
	'     \\/                 \\/';

		if (!this.program.dump) {
			console.log(logger.stripColors ? str : str.blue);
			var m = 'Alloy ' + pkg.version + ' by Appcelerator. The MVC app framework for Titanium.\n'.white;
			console.log(logger.stripColors ? colors.stripColors(m) : m);
		}
	}

	getCommands() {
		try {
			var commandsPath = path.join(__dirname, 'commands');
			return _.filter(fs.readdirSync(commandsPath), function(file) {
				return path.existsSync(path.join(commandsPath, file, 'index.js'));
			});
		} catch (e) {
			U.die('Error getting command list', e);
		}
	}

}

module.exports = Alloy;