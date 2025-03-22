const {
	exec,
	execSync
} = require('child_process');
const U = require('../../utils');
const tiapp = require('../../tiapp');
const fs = require('fs');
const os = require('os');
const path = require('path');

module.exports = async function(args, program) {

	try {
		if (args.length === 0) {
			U.die('Missing parameter "get"');
		} else {
			args.forEach(command => {
				switch (command) {
					case 'get':
						tiapp.init();
						var adbPath = 'adb';
						if (os.platform() === 'darwin') {
							// default path
							adbPath = '~/Library/Android/sdk/platform-tools/adb';

							// try to get android.sdkPath from ti config
							const output = execSync('ti config android.sdkPath --json');
							const jsonObject = JSON.parse(output);
							if (!Object.prototype.hasOwnProperty.call(jsonObject, 'success')) {
								// found string
								adbPath = jsonObject;
							}

							// check if adb is in that folder
							const testPath = path.join(adbPath, 'platform-tools/adb');
							if (!fs.existsSync(testPath)) {
								U.die('adb not found at ' + testPath + '. Please check "ti config android.sdkPath" and point to your SDK folder.');
								return;
							} else {
								// use the new path
								adbPath = testPath;
							}
						}
						console.log('Downloading _alloy_ database to: ' + tiapp.getBundleId() + '.db');
						execCommand(adbPath + ' shell "run-as ' + tiapp.getBundleId() + ' cat /data/data/' + tiapp.getBundleId() + '/databases/_alloy_" > ' + tiapp.getBundleId() + '.db');
						break;
				}
			});
		}
	} catch (error) {
		console.error('Failed to get database: ' + error);
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
