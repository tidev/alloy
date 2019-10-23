/*
	Sets options and wraps some functionality around the source mapping functions
	provided by the UglifyJS library
*/
var SM = require('source-map'),
	fs = require('fs-extra'),
	chmodr = require('chmodr'),
	path = require('path'),
	U = require('../../utils'),
	CONST = require('../../common/constants'),
	babylon = require('@babel/parser'),
	babel = require('@babel/core'),
	logger = require('../../logger'),
	_ = require('lodash');

var lineSplitter = /(?:\r\n|\r|\n)/;

// Try to match this in our babel.transformFromAst calls?
exports.OPTIONS_OUTPUT = {
	ast: false,
	// do NOT minify Alloy code because Titanium will do it!
	minified: false,
	compact: false,
	comments: true,
	babelrc: false,
	passPerPreset: false,
	retainLines: true
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
	var outfile = target.filepath;
	var relativeOutfile = path.relative(compileConfig.dir.project, outfile);
	var markers = _.map(data, function(v, k) { return k; });
	var mapper = new SM.SourceMapGenerator({
		file: `${compileConfig.dir.project}/${relativeOutfile}`,
		sourceRoot: compileConfig.dir.project
	});
	// the line counter and code string for the generated file
	var genMap = {
		count: 1,
		code: ''
	};
	// The line counter and reported source name for the input template
	var templateMap = {
		count: 1,
		filename: target.template || 'template.js'
	};

	// ensure target.templateContent will have a value so we can embed in sourcesContent
	target.templateContent = getTextFromGenerator(target.templateContent, target.template);
	target.lines = target.templateContent.split(lineSplitter);
	_.each(markers, function(m) {
		var marker = data[m];
		// set the line counter for each "data" object we place into the generated code at certain point in template
		// already has a filename, fileContent property
		marker.count = 1;
		// ensure marker.fileContent will have a value so we can embed in sourcesContent
		marker.fileContent = getTextFromGenerator(marker.fileContent, marker.filepath);
		marker.lines = marker.fileContent.split(lineSplitter);
	});

	// generate the source map and composite code
	_.each(target.lines, function(line) {
		var trimmed = U.trim(line);
		if (_.includes(markers, trimmed)) {
			templateMap.count++; // skip this line in the template count now or else we'll be off by one from here on out
			_.each(data[trimmed].lines, function(line) {
				mapLine(mapper, data[trimmed], genMap, line);
			});
		} else {
			mapLine(mapper, templateMap, genMap, line);
		}
	});

	// parse composite code into an AST
	var ast;
	try {
		ast = babylon.parse(genMap.code, {
			sourceFilename: outfile,
			sourceType: 'unambiguous',
			allowReturnOutsideFunction: true
		});
	} catch (e) {
		let filename;
		if (data.__MAPMARKER_CONTROLLER_CODE__) {
			filename = data.__MAPMARKER_CONTROLLER_CODE__.filename;
		} else if (data.__MAPMARKER_ALLOY_JS__) {
			filename = data.__MAPMARKER_ALLOY_JS__.filename;
		}

		U.dieWithCodeFrame(`Error parsing code in ${filename}. ${e.message}`, e.loc, genMap.code);
	}

	// create source map and generated code
	var options = _.extend(_.clone(exports.OPTIONS_OUTPUT), {
		plugins: [
			[require('./ast/builtins-plugin'), compileConfig],
			[require('./ast/optimizer-plugin'), compileConfig.alloyConfig]
		]
	});
	if (compileConfig.sourcemap) {
		// Tell babel to retain the lines so they stay correct (columns go wacky, but OH WELL)
		// we produce our own source maps and we want the lines to stay as we mapped them
		options.retainLines = true;
	}
	var outputResult = babel.transformFromAstSync(ast, genMap.code, options);

	// produce the source map and embed the original source (so the template source can be passed along)
	const sourceMap = mapper.toJSON();
	sourceMap.sourcesContent = [ target.templateContent, data[markers[0]].fileContent ];

	// append pointer to the source map to the generated code
	outputResult.code += `\n//# sourceMappingURL=file://${compileConfig.dir.project}/${CONST.DIR.MAP}/${relativeOutfile}.${CONST.FILE_EXT.MAP}`;

	// write the generated controller code
	fs.mkdirpSync(path.dirname(outfile));
	chmodr.sync(path.dirname(outfile), 0755);
	fs.writeFileSync(outfile, outputResult.code.toString());
	logger.info('  created:    "' + relativeOutfile + '"');

	// write source map for the generated file
	if (compileConfig.sourcemap !== false) {
		var mapDir = path.join(compileConfig.dir.project, CONST.DIR.MAP);
		outfile = path.join(mapDir, relativeOutfile) + '.' + CONST.FILE_EXT.MAP;
		relativeOutfile = path.relative(compileConfig.dir.project, outfile);
		fs.mkdirpSync(path.dirname(outfile));
		chmodr.sync(path.dirname(outfile), 0755);
		fs.writeFileSync(outfile, JSON.stringify(sourceMap));
	}
};

exports.generateSourceMap = function(generator, compileConfig) {
	var target = generator.target;
	var data = generator.data;
	var origFile = generator.origFile;
	var markers = _.map(data, function(v, k) { return k; });
	var mapper = new SM.SourceMapGenerator({
		file: `${compileConfig.dir.project}/${target.filename}`,
		sourceRoot: compileConfig.dir.project
	});
	var genMap = {
		count: 1,
		code: ''
	};
	// passed in to mapLine so "sources" points at original src file
	var theMap = {
		count: 1, // used to track line numbers for source mapping
		filename: origFile.filename // relative path to src file from project root
	};

	// initialize the rest of the generator properties
	target.count = 1;
	// gets text from original src file since template content is empty
	// ensure target.templateContent will have a value so we can embed in sourcesContent if we want to
	target.templateContent = getTextFromGenerator(null, origFile.filepath);
	target.lines = target.templateContent.split(lineSplitter);
	_.each(markers, function(m) {
		var marker = data[m];
		marker.count = 1;
		// ensure marker.fileContent will have a value so we can embed in sourcesContent if we want to
		marker.fileContent = getTextFromGenerator(marker.fileContent, marker.filename);
		marker.lines = marker.fileContent.split(lineSplitter);
	});

	// generate the source map and composite code
	// (should simply map every line from src -> dest)
	_.each(target.lines, function(line) {
		var trimmed = U.trim(line);
		if (_.includes(markers, trimmed)) {
			theMap.count++; // skip this line number in the input file now or else we'll be off by one from here on out
			_.each(data[trimmed].lines, function(line) {
				mapLine(mapper, data[trimmed], genMap, line);
			});
		} else {
			mapLine(mapper, theMap, genMap, line);
		}
	});

	// parse composite code into an AST
	// TODO: Remove? This is a sanity check, I suppose, but is it necessary?
	// Our classic build should blow up on bad JS files
	var ast;
	try {
		ast = babylon.parse(genMap.code, {
			sourceFilename: genMap.file,
			sourceType: 'unambiguous',
			allowReturnOutsideFunction: true,
		});
	} catch (e) {
		const filename = path.relative(compileConfig.dir.project, generator.target.template);

		U.dieWithCodeFrame(`Error parsing code in ${filename}. ${e.message}`, e.loc, genMap.code);
	}

	// TODO: We do not run the babel plugins (optimizer/builtins) here. Is that ok?
	// TODO: embed sourcesContent into source map? Shouldn't need to since this is supposed to be a straight copy

	// write source map for the generated file
	var relativeOutfile = path.relative(compileConfig.dir.project, target.filepath);
	var mapDir = path.join(compileConfig.dir.project, CONST.DIR.MAP);
	var outfile = path.join(mapDir, relativeOutfile) + '.' + CONST.FILE_EXT.MAP;
	fs.mkdirpSync(path.dirname(outfile));
	chmodr.sync(path.dirname(outfile), 0755);
	fs.writeFileSync(outfile, JSON.stringify(mapper.toJSON()));
	logger.debug('  map:        "' + outfile + '"');
};
