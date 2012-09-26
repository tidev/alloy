var WIDGETID = 'com.savagelook.somewidget';
var tests = [
	[ 'index.xml', '/' + WIDGETID + '/index.xml' ],
	[ 'images/bob.png', '/images/' + WIDGETID + '/bob.png'],
	[ '/images/bob/image.png', '/images/bob/' + WIDGETID + '/image.png']
];

var pattern = /\/[^\/]+$/;
var regex = new RegExp(pattern);
console.log(pattern);

var _ = require('../../Alloy/lib/alloy/underscore')._;

function WPATH(s) {
	var index = s.lastIndexOf('/');
	var path = index === -1 ? WIDGETID + '/' + s : s.substring(0,index) + '/' + WIDGETID + '/' + s.substring(index+1);
	return path.indexOf('/') === 0 ? path : '/' + path;
}

for (i = 0; i < tests.length; i++) {
	var string = tests[i][0];
	var expect = tests[i][1];
	var actual = WPATH(string);
	var result = actual === expect;

	if (result) {
		console.log('PASSED: ' + string + ' -> ' + expect);
	} else {
		console.error('FAILED: ' + string + ' (expected "' + expect + '", got "' + actual + '")');
	}
}