var deployType, dist;
if (ENV_DEV) {
	deployType = 'development';
} else if (ENV_TEST) {
	deployType = 'test';
} else if (ENV_PROD) {
	deployType = 'production';
}

if (DIST_ADHOC) {
	dist = 'adhoc';
} else if (DIST_STORE) {
	dist = 'store';
}

$.build.text = deployType + (dist ? ':' + dist : '');

$.index.open();