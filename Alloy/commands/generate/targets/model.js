var path = require('path'),
	fs = require('fs'),
	GU = require('../generateUtils'),
	U = require('../../../utils'),
	_ = require('../../../lib/alloy/underscore')._,
	CONST = require('../../../common/constants'),
	logger = require('../../../common/logger');

	module.exports = function(name, args, program) {
		var type = 'MODELAPP';
		var basename = path.basename(name,'.'+CONST.FILE_EXT.MODEL);

		// validate arguments and paths
		if (args.length === 0) {
			U.die(
				'You need to specify columns for your model.\n' +
				'   `alloy generate model MODEL_NAME COL1:COL_TYPE COL2:COL_TYPE ...`'
			);
		}

		var columns = {};
		_.each(args, function(pair) {
			var arr = pair.split(':');
			columns[arr[0]] = arr[1];
		});	

		// generate model file
		var info = GU.generate(name, type, program, {
			template: { name: basename,
						columns:U.stringifyJSON(columns)
			},
		});

		logger.info('Generated model named ' + name);

		var template = { up: '', down: '' };
		var migrationCode = info.code.split("\n");
		template.up = '\tdb.createTable("' + basename + '",configuration);\n';
		template.down = '\tdb.dropTable("' + basename + '");';

		// run the migration generator with the template
		(require('./migration'))(name, args, program, template);
	}