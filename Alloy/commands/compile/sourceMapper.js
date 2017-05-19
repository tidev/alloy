/*
	Sets options and wraps some functionality around the source mapping functions
	provided by the UglifyJS library
*/
var SM = require('source-map'),
	fs = require('fs'),
	path = require('path'),
	wrench = require('wrench'),
	U = require('../../utils'),
	CONST = require('../../common/constants'),
	babylon = require('babylon'),
	babel = require('babel-core'),
	logger = require('../../logger'),
	_ = require('../../lib/alloy/underscore')._;

var lineSplitter = /(?:\r\n|\r|\n)/;

// Try to match this in our babel.transformFromAst calls?
exports.OPTIONS_OUTPUT = {
	ast: false,
	minified: false,
	compact: false,
	comments: false,
	babelrc: false,
	presets: [[require('babel-preset-babili'), {
		booleans: false, // true is default
		builtIns: false, // true is default
		consecutiveAdds: false, // true is default
		deadcode: true, // true is default // adds .2s to optimizing, required to match
		evaluate: true, // true is default, required, adss about .06s
		flipComparisons: false, // true is default, not required
		guards: false, // true is default, not required
		infinity: false, // true is default
		mangle: false, // true is default
		memberExpressions: false, // true is default, not required
		mergeVars: false, // true is default
		numericLiterals: true, // true is default, .03s, required
		propertyLiterals: false, // true is default, not required
		regexpConstructors: false, // true is default, not required
		removeConsole: false, // false is default
		removeDebugger: false, // false is default
		removeUndefined: false, // true is default, not required
		replace: false, // true is default
		simplify: false, // true is default
		simplifyComparisons: false, // true is default, not required
		typeConstructors: false, // true is default, not required
		undefinedToVoid: false, // true is default, not required
	}]]
};

function mapLine(mapper, theMap, genMap, line) {
	mapper.addMapping({
		original: {
			line: theMap.count++,
			column: 0
		},
		generated: {
			line: genMap.count++,
			column: 0
		},
		source: theMap.filename
	});
	genMap.code += line + '\n';
}

function getTextFromGenerator(content, template) {
	if (typeof content !== 'undefined' && content !== null) {
		return content;
	} else {
		if (template && fs.existsSync(template)) {
			return fs.readFileSync(template, 'utf8');
		} else {
			return '';
		}
	}
}

exports.generateCodeAndSourceMap = function(generator, compileConfig) {
	var target = generator.target;
	var data = generator.data;
	var markers = _.map(data, function(v, k) { return k; });
	var mapper = new SM.SourceMapGenerator({ file: target.filename });
	var genMap = {
		file: target.filename,
		count: 1,
		code: ''
	};

	// initialize the rest of the generator properties
	target.count = 1;
	target.lines = getTextFromGenerator(target.templateContent, target.template).split(lineSplitter);
	_.each(markers, function(m) {
		var marker = data[m];
		marker.count = 1;
		marker.lines = getTextFromGenerator(marker.fileContent, marker.filepath).split(lineSplitter);
	});

	// generate the source map and composite code
	_.each(target.lines, function(line) {
		var trimmed = U.trim(line);
		if (_.contains(markers, trimmed)) {
			_.each(data[trimmed].lines, function(line) {
				mapLine(mapper, data[trimmed], genMap, line);
			});
		} else {
			mapLine(mapper, target, genMap, line);
		}
	});

	// parse composite code into an AST
	var ast;
	try {
		ast = babylon.parse(genMap.code, {
			sourceFilename: genMap.file,
			sourceType: 'module'
		});
	} catch (e) {
		logger.trace(genMap.code);
		throw e;
	}

	// create source map and generated code
	var options = _.extend(_.clone(exports.OPTIONS_OUTPUT), {
		plugins: [
			[require('./ast/builtins-plugin'), compileConfig],
			[require('./ast/optimizer-plugin'), compileConfig.alloyConfig]
		]
	});
	if (compileConfig.sourcemap) {
		options.sourceMaps = true;
		options.sourceMapTarget = target.filename;
		options.inputSourceMap = mapper.toJSON();
	}
	var outputResult = babel.transformFromAst(ast, genMap.code, options);

	// write the generated controller code
	var outfile = target.filepath;
	var relativeOutfile = path.relative(compileConfig.dir.project, outfile);
	wrench.mkdirSyncRecursive(path.dirname(outfile), 0755);
	fs.writeFileSync(outfile, outputResult.code.toString());
	logger.info('  created:    "' + relativeOutfile + '"');

	// write source map for the generated file
	if (compileConfig.sourcemap !== false) {
		var mapDir = path.join(compileConfig.dir.project, CONST.DIR.MAP);
		outfile = path.join(mapDir, relativeOutfile) + '.' + CONST.FILE_EXT.MAP;
		relativeOutfile = path.relative(compileConfig.dir.project, outfile);
		wrench.mkdirSyncRecursive(path.dirname(outfile), 0755);
		fs.writeFileSync(outfile, JSON.stringify(outputResult.map));
		logger.debug('  map:        "' + relativeOutfile + '"');
	}
};

exports.generateSourceMap = function(generator, compileConfig) {
	if (!fs.existsSync(generator.target.filename) || fs.statSync(generator.target.filename).isDirectory()) {
		return;
	}
	var target = generator.target;
	var data = generator.data;
	var markers = _.map(data, function(v, k) { return k; });
	var mapper = new SM.SourceMapGenerator({ file: target.filename });
	var genMap = {
		file: target.filename,
		count: 1,
		code: ''
	};

	// initialize the rest of the generator properties
	target.count = 1;
	target.lines = getTextFromGenerator(target.templateContent, target.template).split(lineSplitter);
	_.each(markers, function(m) {
		var marker = data[m];
		marker.count = 1;
		marker.lines = getTextFromGenerator(marker.fileContent, marker.filename).split(lineSplitter);
	});

	// generate the source map and composite code
	_.each(target.lines, function(line) {
		var trimmed = U.trim(line);
		if (_.contains(markers, trimmed)) {
			_.each(data[trimmed].lines, function(line) {
				mapLine(mapper, data[trimmed], genMap, line);
			});
		} else {
			mapLine(mapper, target, genMap, line);
		}
	});

	// parse composite code into an AST
	var ast;
	try {
		ast = babylon.parse(genMap.code, {
			sourceFilename: genMap.file,
			sourceType: 'module'
		});
	} catch (e) {
		logger.trace(genMap.code);
		throw e;
	}

	// create source map
	var origFileName = path.relative(compileConfig.dir.project, generator.origFile.filename),
		compiledFileName = path.join('Resources', path.basename(generator.origFile.filename));
	var options = _.extend(_.clone(exports.OPTIONS_OUTPUT), {
		plugins: [
			[require('./ast/builtins-plugin'), compileConfig],
			[require('./ast/optimizer-plugin'), compileConfig.alloyConfig]
		],
		sourceMaps: true,
		sourceMapTarget: compiledFileName,
		inputSourceMap: mapper.toJSON()
	});
	var outputResult = babel.transformFromAst(ast, genMap.code, options);

	// write source map for the generated file
	var relativeOutfile = path.relative(compileConfig.dir.project, target.filepath);
	var mapDir = path.join(compileConfig.dir.project, CONST.DIR.MAP);
	var outfile = path.join(mapDir, relativeOutfile, path.basename(target.filename)) + '.' + CONST.FILE_EXT.MAP;
	wrench.mkdirSyncRecursive(path.dirname(outfile), 0755);
	var tmp = outputResult.map;
	tmp.sources[0] = compiledFileName;
	tmp.sources[1] = origFileName;
	fs.writeFileSync(outfile, JSON.stringify(tmp));
	logger.debug('  map:        "' + outfile + '"');
};
