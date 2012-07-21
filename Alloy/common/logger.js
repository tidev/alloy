var colors = require('colors');

exports.DEBUG = 3;
exports.INFO = 2;
exports.WARN = 1;
exports.ERROR = 0;
exports.NONE = -1;
exports.logLevel = exports.DEBUG;
exports.stripColors = false;

exports.debug = function(msg) {
	if (exports.logLevel >= exports.DEBUG) { printMessage(msg, 'debug'); }
}

exports.info = function(msg) {
	if (exports.logLevel >= exports.INFO) { printMessage(msg, 'info'); }
}

exports.warn = function(msg) {
	if (exports.logLevel >= exports.WARN) { printMessage(msg, 'warn'); }
}

exports.error = function(msg) {
	if (exports.logLevel >= exports.ERROR) { printMessage(msg, 'error'); }
}


// Private functions and members
var levels = ['info','debug','error','warn'];
var has = function(array, item) {
	var len = array.length;
	for (var i = 0; i < len; i++) {
		if (array[i] === item) {
			return true;
		}
	}
	return false;
};
var isArray = function(object) {
	return Object.prototype.toString.call(object) === '[object Array]';
};

var formattedDate = function() {
	var date = new Date();
	var pad = function(val) {
		val += '';
		return val.length < 2 ? '0' + val : val;
	};  
	return date.getFullYear() + '-' + pad(date.getMonth()+1) + '-' + pad(date.getDate()) + ' ' + 
	       pad(date.getHours()) + ':' + pad(date.getMinutes()) + ':' + pad(date.getSeconds());
};

function formatTag(t,m)
{
	var s = t;
	if (s.length < m)
	{
		for (var c=s.length;c<m;c++)
		{
			s+=' ';
		}
	}
	return s;
}

var printMessage = function(msg, level) {
	// Validate arguments
	msg = msg || '';
	level = level || 'info';
	level = has(levels, level) ? level : 'info'

	// Have to wrap in a function to avoid "Illegal invocation" error on android
	var logFunc = function(msg){console.log(msg)};

	// Create message array and print
	if (!isArray(msg)) {
		msg = [msg || ''];
	}
	for (var i = 0; i < msg.length; i++) {
		var str = (formattedDate() + ' -- [' + formatTag(level.toUpperCase(),5) + '] ').grey + msg[i].cyan;
		var m = exports.stripColors ? colors.stripColors(str) : str;
		logFunc(m);
	}
};