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
	if (args.length === 0) {
		U.die('Missing parameter "get"');
		return;
	}

	if (!args.includes('get')) {
		return;
	}

	try {
		tiapp.init();
		const bundleId = tiapp.getBundleId();
		const adbPath = getAdbPath();

		console.log('Downloading _alloy_ database to: ' + bundleId + '.db');
		execCommand(adbPath + ' shell "run-as ' + bundleId + ' cat /data/data/' + bundleId + '/databases/_alloy_" > ' + bundleId + '.db');
	} catch (error) {
		console.error('Failed to get database: ' + error);
	}
};

function getAdbPath() {
	if (os.platform() !== 'darwin') {
		return 'adb';
	}

	// try to get android.sdkPath from ti config
	let sdkPath;
	const output = execSync('ti config android.sdkPath --json');
	const jsonObject = JSON.parse(output);
	if (!Object.hasOwn(jsonObject, 'success')) {
		// found string
		sdkPath = jsonObject;
	}

	// fall back to the default location (the folder has been spelled "sdk" and "Sdk" over the years)
	if (!sdkPath) {
		sdkPath = ['sdk', 'Sdk']
			.map(dir => path.join(os.homedir(), 'Library', 'Android', dir))
			.find(dir => fs.existsSync(dir)) || path.join(os.homedir(), 'Library', 'Android', 'sdk');
	}

	// check if adb is in that folder
	const adbPath = path.join(sdkPath, 'platform-tools', 'adb');
	if (!fs.existsSync(adbPath)) {
		U.die('adb not found at ' + adbPath + '. Please check "ti config android.sdkPath" and point to your SDK folder.');
	}
	return adbPath;
}

function execCommand(currentCommand) {
	exec(currentCommand, (error, response) => {
		if (error) {
			if (error.message) {
				console.error(error.message);
			} else {
				console.error("Couldn't fetch database");
			}
		}
		if (response) {
			console.log(response);
		}
		return true;
	});
}
