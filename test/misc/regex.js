var PLATFORM = 'android';
var tests = [
	[ 'index.xml', true ],
	[ 'android/index.xml', PLATFORM === 'android'],
	[ 'android/index/index.xml', PLATFORM === 'android'],
	[ 'ios/index.xml', PLATFORM === 'ios'],
	[ 'mobileweb/index.xml', PLATFORM === 'mobileweb'],
	[ 'ios/mobileweb/something.js', PLATFORM === 'ios'],
	[ 'android.js', true],
	[ 'ios.js', true],
	[ 'mobileweb.js', true]
];

var platforms = ['ios','android','mobileweb'];
var filtered = [];
for (var i = 0; i < platforms.length; i++) {
	if (platforms[i] !== PLATFORM) {
		filtered.push(platforms[i] + '[\\\\\\/]');
	}
}
var pattern = '^(?:(?!' + filtered.join('|') + '))';
var regex = new RegExp(pattern);
console.log(pattern);

for (i = 0; i < tests.length; i++) {
	var string = tests[i][0];
	var expect = tests[i][1];
	var result = regex.test(string);

	if (result == expect) {
		console.log('PASSED: ' + string);
	} else {
		console.error('FAILED: ' + string + ' (expected "' + expect + '", got "' + result + '")');
	}
}