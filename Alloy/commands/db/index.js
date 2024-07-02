const {
	exec
} = require('child_process');
const U = require('../../utils');
const tiapp = require('../../tiapp');

module.exports = async function(args, program) {

	try {
		if (args.length === 0) {
			execCommand('db');
		} else {
			args.forEach(command => {
				switch (command) {
					case 'get':
						tiapp.init();
						console.log('Downloading _alloy_ database to: ' + tiapp.getBundleId() + '.db');
						execCommand('adb -d shell "run-as ' + tiapp.getBundleId() + ' cat /data/data/' + tiapp.getBundleId() + '/databases/_alloy_" > ' + tiapp.getBundleId() + '.db');
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
		return console.log(response);
	});
}
