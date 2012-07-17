var CONST = require('../../common/constants');

exports.pad = function(x)
{
	if (x < 10)
	{
		return '0' + x;
	}
	return x;
}

exports.generateMigrationFileName = function(t)
{
	var d = new Date;
	var s = String(d.getUTCFullYear()) + String(exports.pad(d.getUTCMonth())) + String(exports.pad(d.getUTCDate())) + String(exports.pad(d.getUTCHours())) + String(exports.pad(d.getUTCMinutes())) + String(d.getUTCMilliseconds())
	return s + '_' + t + '.' + CONST.FILE_EXT.MIGRATION;
}