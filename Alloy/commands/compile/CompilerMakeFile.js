var logger = require('../../common/logger'),
	colors = require('colors');

function CompilerMakeFile() {
	var handlers = {};
	
	this.require = require;
	this.process = process;
	
	this.task = function(event, fn)
	{
		logger.debug('adding task: '+event.yellow);
		handlers[event] = fn;
	};
	
	this.trigger = function(event, config)
	{
		logger.debug("compile:trigger-> "+event.yellow);
		var fn = handlers[event];
		if (fn)
		{
			return fn(config,logger);
		}
		return null;
	};
	
	return this;
}

module.exports = CompilerMakeFile;