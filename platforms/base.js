var _ = require('../Alloy/lib/alloy/underscore')._,
	U = require('../Alloy/utils');

module.exports = function(def) {
	if (!def.platform) {
		U.die([
			'platform undefined',
			new Error().stack
		]);
	}

	_.extend(this, _.defaults(def, {
		alloyFolder: def.platform,
		titaniumFolder: def.platform,
		name: def.platform,
		osname: def.platform,
		condition: {}
	}));

	this.condition = {
		compile: def.condition.compile || 'OS_' + this.platform.toUpperCase(),
		runtime: def.condition.runtime || runtimeCondition(this.osname, this.name)
	};
};

function runtimeCondition(osname, name) {
	var output, map;
	osname = osname || [];
	name = name || [];

	if (!osname && !name) {
		return 'true';
	} else if (_.isString(name)) {
		return "Ti.Platform.name === '" + name + "'";
	} else if (_.isString(osname)) {
		return "Ti.Platform.osname === '" + osname + "'";
	} else {
		if (_.isArray(name)) {
			map = _.map(name, function(n) { return "Ti.Platform.name === '" + n + "'"; });
		}
		if (_.isArray(osname) && (!map || osname.length < name.length)) {
			map = _.map(osname, function(n) { return "Ti.Platform.osname === '" + n + "'"; });
		}
		if (!map) { return 'true'; }
	}

	return map.join('||');
}
