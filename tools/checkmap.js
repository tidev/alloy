#!/usr/bin/env node

/*
	Reads the source map files (foo.js.map) for the Harness app
	and outputs the the generated and original line information
	for each map
*/

var async = require('async'),
	path = require('path'),
	platforms = require('../platforms'),
	fs = require('fs'),
	os = require('os'),
	SM = require('source-map'),
	_ = require('lodash');

scan(path.join(__dirname, '..', 'test', 'projects', 'Harness', 'build', 'map', 'Resources'), '.map', function(err, files) {
	// Do something with files that ends in '.ext'.
	_.map(files, function(sourceMapFile) {
		console.log(path.basename(sourceMapFile));
		console.log('------------------------------');
		console.log('Generated line -> Original line');
		var sourceMap = fs.readFileSync(sourceMapFile, {encoding: 'utf8'}),
			lineArray = [];
		var smc = new SM.SourceMapConsumer(sourceMap);
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
	});
});


function scan(dir, suffix, callback) {
	fs.readdir(dir, function(err, files) {
		var returnFiles = [];
		async.each(files, function(file, next) {
			var filePath = dir + '/' + file;
			fs.stat(filePath, function(err, stat) {
				if (err) {
					return next(err);
				}
				if (stat.isDirectory()) {
					scan(filePath, suffix, function(err, results) {
						if (err) {
							return next(err);
						}
						returnFiles = returnFiles.concat(results);
						next();
					});
				} else if (stat.isFile()) {
					if (file.indexOf(suffix, file.length - suffix.length) !== -1) {
						returnFiles.push(filePath);
					}
					next();
				}
			});
		}, function(err) {
			callback(err, returnFiles);
		});
	});
}
