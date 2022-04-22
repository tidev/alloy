#!/usr/bin/env node

/*
	Reads the source map files (foo.js.map) for the Harness app
	and outputs the the generated and original line information
	for each map
*/

var path = require('path'),
	fs = require('fs'),
	SM = require('source-map'),
	_ = require('lodash'),
	walkSync = require('walk-sync');



const resourcesDir = path.join(__dirname, '..', 'test', 'projects', 'Harness', 'build', 'map', 'Resources');
const files = walkSync(resourcesDir, { globs: ['**/*.map']});
(async () => {
	for (const file of files) {
		const sourceMapFile = path.join(resourcesDir, file);
		console.log(path.basename(sourceMapFile));
		console.log('------------------------------');
		console.log('Generated line -> Original line');
		var sourceMap = fs.readFileSync(sourceMapFile, {encoding: 'utf8'}),
			lineArray = [];
		var smc = await new SM.SourceMapConsumer(sourceMap);
		smc.eachMapping(function (m) {
			lineArray.push({gen: m.generatedLine, orig: m.originalLine});
		});
		var uniqueList = _.uniq(lineArray, function(item, key, gen) {
			return item.gen;
		});
		_.each(uniqueList, function(l) {
			var spacer = '                  '.slice(JSON.stringify(l.gen).length);
			console.log('   ' + l.gen + spacer + l.orig);
		});
		console.log('');
	}
})();
