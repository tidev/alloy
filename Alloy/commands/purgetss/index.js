let purgetss = require('purgetss');

module.exports = async function(args, program) {
	if (args.length === 0) {
		purgetss.purgeClasses({});
	} else {
		args.forEach(command => {
			switch (command) {
				case 'init':
					purgetss.init({});
					break;
				case 'build':
					purgetss.buildCustom();
					break;
				case 'watch':
					purgetss.watchMode({});
					break;
				case 'fonts':
					purgetss.copyFonts({ modules: true });
					break;
				case 'build-fonts':
					purgetss.buildCustomFonts({ modules: true });
					break;
				case 'module':
					purgetss.copyModulesLibrary();
					break;
			}
		});
	}
};
