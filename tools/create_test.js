#!/usr/bin/env node

var path = require('path'),
	fs = require('fs'),
	os = require('os');

var EOL = os.EOL;

// ensure we're targeting the right folder
var TESTING_FOLDER = path.join(__dirname, '..', 'test', 'apps', 'testing');
if (!fs.existsSync(TESTING_FOLDER)) {
	die('"testing" folder does not exist at ' + rel(TESTING_FOLDER));
}

// get the name of the test app to be created
var args = process.argv.slice(2);
var appName = args[0];
if (!appName) {
	die('You must specify a name for the test app you want to create');
}

// make sure this doesn't already exist, then create it
var pathToTest = path.join(TESTING_FOLDER, appName);
if (fs.existsSync(pathToTest)) {
	die('Test app "' + appName + '" already exists at "' + rel(pathToTest) + '"');
}
fs.mkdirSync(pathToTest, 0755);
console.log('* Created folder ' + YELLOW(rel(pathToTest)));

var files = [
	{
		folder: path.join(pathToTest, 'views'),
		file: 'index.xml',
		data:
		'<Alloy>' + EOL +
		'\t<Window>' + EOL +
		'\t</Window>' + EOL +
		'</Alloy>'
	},
	{
		folder: path.join(pathToTest, 'controllers'),
		file: 'index.js',
		data: '$.index.open();'
	},
	{
		folder: path.join(pathToTest, 'styles'),
		file: 'index.tss',
		data:
		"'#index': {" + EOL +
		"\tbackgroundColor: '#fff'," + EOL +
		'\tfullscreen: false,' + EOL +
		'\texitOnClose: true' + EOL +
		'}'
	}
];

for (var i = 0; i < files.length; i++) {
	var o = files[i];
	var fullpath = path.join(o.folder, o.file);
	fs.mkdirSync(o.folder, 0755);
	fs.writeFileSync(fullpath, o.data);
	console.log('* Created file ' + YELLOW(rel(fullpath)));
}
console.log(GREEN('test app ' + appName + ' successfully created.'));
console.log('');
console.log(YELLOW('Make sure to create _generated code when you are done with: '));
console.log('   node tools/create_generated_code.js testing/' + appName);

// helper functions
function rel(p) {
	return path.relative(process.cwd(), p);
}

function GREEN(s) {
	return '\u001b[32m' + s + '\u001b[0m';
}

function YELLOW(s) {
	return '\u001b[33m' + s + '\u001b[0m';
}

function die(msg) {
	console.error('\u001b[31m' + 'ERROR: ' + msg + '\u001b[0m');
	process.exit(1);
}
