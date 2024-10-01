const {
	exec
} = require('child_process');
const U = require('../../utils');
const tiapp = require('../../tiapp');
const fs = require('fs');
const os = require('os');

module.exports = async function(args, program) {

	try {
		if (args.length === 0) {
			execCommand('db');
		} else {
			args.forEach(command => {
				switch (command) {
					case 'get':
						tiapp.init();
						var adbPath = 'adb';
						if (os.platform() === 'darwin') {
							adbPath = '~/Library/Android/sdk/platform-tools/adb';
							var testPath = path.join(adbPath);
							if (!fs.existsSync(testPath)) {
								console.error('adb not found at ' + adbPath);
								return;
							}
						}
						console.log('Downloading _alloy_ database to: ' + tiapp.getBundleId() + '.db');
						execCommand(adbPath + ' shell "run-as ' + tiapp.getBundleId() + ' cat /data/data/' + tiapp.getBundleId() + '/databases/_alloy_" > ' + tiapp.getBundleId() + '.db');
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
		if (error) {
			console.error(error);
		}
		if (response) {
			console.log(response);
		}
		return true;
	});
}
