const { exec } = require('child_process');
const U = require('../../utils');

module.exports = async function(args, program) {
	let options = '';
	try {
		if (args.length === 0) {
			execCommand('purgetss');
		} else {
			args.forEach(command => {
				switch (command) {
					case 'init':
						execCommand('purgetss init');
						break;
					case 'build':
						execCommand('purgetss build');
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
		if (error && error.code === 127) U.die('\n::PurgeTSS:: First install purgetss globally using: [sudo] npm i purgetss -g');
		return console.log(response);
	});
}
