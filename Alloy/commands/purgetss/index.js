const { exec } = require('child_process');
const commandExistsSync = require('command-exists').sync;

module.exports = async function(args, program) {
	// console.log('module:', program.module);
	// console.log('vendor:', program.vendor);
	let options = '';
	try {
		if (args.length === 0) {
			if (program.all) options += ' --all';
			if (program.debug) options += ' --debug';
			execCommand(`purgetss ${options}`);
		} else {
			args.forEach(command => {
				switch (command) {
					case 'init':
						execCommand('purgetss init');
						break;
					case 'build':
						execCommand('purgetss build');
						break;
					case 'watch':
						execCommand('purgetss watch');
						break;
					case 'fonts':
						if (program.vendor) options += ` -v=${program.vendor}`;
						if (program.modules) options += ' --modules';
						execCommand(`purgetss fonts${options}`);
						break;
					case 'build-fonts':
						if (program.modules) options += ' --modules';
						execCommand(`purgetss build-fonts${options}`);
						break;
					case 'module':
						execCommand('purgetss module');
						break;
				}
			});
		}
	} catch (error) {
		//
	}
};

function execCommand(currentCommand) {
	exec(currentCommand, (error, response) => {
		if (error && error.code === 127) return console.error('\n::PurgeTSS:: First install purgetss globally using: [sudo] npm i purgetss -g');
		return console.log(response);
	});
}
