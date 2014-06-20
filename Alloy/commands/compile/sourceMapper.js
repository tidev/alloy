var SM = require('source-map'),
	fs = require('fs'),
	path = require('path'),
	wrench = require('wrench'),
	U = require('../../utils'),
	CONST = require('../../common/constants'),
	uglifyjs = require('uglify-js'),
	logger = require('../../logger'),
	_ = require('../../lib/alloy/underscore')._;

var lineSplitter = /(?:\r\n|\r|\n)/,
	mods = [
		'builtins',
		'optimizer',
		'compress'
	],
	modLocation = './ast/';

exports.OPTIONS_OUTPUT = {
	indent_start  : 0,     // start indentation on every line (only when `beautify`)
	indent_level  : 4,     // indentation level (only when `beautify`)
	quote_keys    : false, // quote all keys in object literals?
	space_colon   : true,  // add a space after colon signs?
	ascii_only    : false, // output ASCII-safe? (encodes Unicode characters as ASCII)
	inline_script : false, // escape "</script"?
	width         : 80,    // informative maximum line width (for beautified output)
	max_line_len  : 32000, // maximum line length (for non-beautified output)
	ie_proof      : false,  // output IE-safe code?
	beautify      : true, // beautify output?
	bracketize    : false, // use brackets every time?
	comments      : false, // output comments?
	semicolons    : true  // use semicolons to separate statements?
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
			return fs.readFileSync(template,'utf8');
		} else {
			return '';
		}
	}
}

exports.generateCodeAndSourceMap = function(generator, compileConfig) {
	var target = generator.target;
	var data = generator.data;
	var markers = _.map(data, function(v,k) { return k; });
	var mapper = new SM.SourceMapGenerator({ file: target.filename });
	var genMap = {
		file: target.filename,
		count: 1,
		code: ''
	};

	// initialize the rest of the generator properties
	target.count = 1;
	target.lines = getTextFromGenerator(target.templateContent,target.template).split(lineSplitter);
	_.each(markers, function(m) {
		var marker = data[m];
		marker.count = 1;
		marker.lines = getTextFromGenerator(marker.fileContent,marker.filepath).split(lineSplitter);
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
		ast = uglifyjs.parse(genMap.code, { filename: genMap.file });
	} catch (e) {
		logger.trace(genMap.code);
		throw e;
	}

	// process all AST operations
	_.each(mods, function(mod) {
		logger.trace('- Processing "' + mod + '" module...');
		ast.figure_out_scope();
		ast = require(modLocation+mod).process(ast, compileConfig) || ast;
	});

	// create uglify-js source map and stream it out
	var stream, sourceMap;
	if (compileConfig.sourcemap) {
		sourceMap = uglifyjs.SourceMap({
			file: target.filename,
			orig: mapper.toString()
		});
		stream = uglifyjs.OutputStream(_.extend(_.clone(exports.OPTIONS_OUTPUT), {
			source_map: sourceMap
		}));
	} else {
		stream = uglifyjs.OutputStream(exports.OPTIONS_OUTPUT);
	}
	ast.print(stream);

	// write the generated controller code
	var outfile = target.filepath;
	var relativeOutfile = path.relative(compileConfig.dir.project,outfile);
	wrench.mkdirSyncRecursive(path.dirname(outfile), 0755);
	fs.writeFileSync(outfile, stream.toString());
	logger.info('  created:    "' + relativeOutfile + '"');

	// write source map for the generated file
	if (compileConfig.sourcemap !== false) {
		var mapDir = path.join(compileConfig.dir.project,CONST.DIR.MAP);
		outfile = path.join(mapDir,relativeOutfile) + '.' + CONST.FILE_EXT.MAP;
		relativeOutfile = path.relative(compileConfig.dir.project,outfile);
		wrench.mkdirSyncRecursive(path.dirname(outfile), 0755);
		fs.writeFileSync(outfile, sourceMap.toString());
		logger.debug('  map:        "' + relativeOutfile + '"');
	}
};

exports.generateSourceMap = function(generator, compileConfig) {
	if(/(?:^|[\\\/])should\.js$/.test(generator.target.filename)) {
		// TODO: remove should.js check here once ALOY-921 is resolved
		//		also remove from compile/index.js getJsFiles()
		return;
	}
	var target = generator.target;
	var data = generator.data;
	var markers = _.map(data, function(v,k) { return k; });
	var mapper = new SM.SourceMapGenerator({ file: target.filename });
	var genMap = {
		file: target.filename,
		count: 1,
		code: ''
	};

	// initialize the rest of the generator properties
	target.count = 1;
	target.lines = getTextFromGenerator(target.templateContent,target.template).split(lineSplitter);
	_.each(markers, function(m) {
		var marker = data[m];
		marker.count = 1;
		marker.lines = getTextFromGenerator(marker.fileContent,marker.filename).split(lineSplitter);
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
		ast = uglifyjs.parse(genMap.code, { filename: genMap.file });
	} catch (e) {
		logger.trace(genMap.code);
		throw e;
	}

	// process all AST operations
	_.each(mods, function(mod) {
		logger.trace('- Processing "' + mod + '" module...');
		ast.figure_out_scope();
		ast = require(modLocation+mod).process(ast, compileConfig) || ast;
	});

	// create uglify-js source map and stream it out
	var origFileName = path.relative(compileConfig.dir.project,generator.origFile.filename),
		compiledFileName = path.join('Resources',path.basename(generator.origFile.filename));
	var sourceMap = uglifyjs.SourceMap({
			file: compiledFileName,
			orig: mapper.toString()
		});
	var stream = uglifyjs.OutputStream(_.extend(_.clone(exports.OPTIONS_OUTPUT), {
			source_map: sourceMap
		}));
	ast.print(stream);

	// write source map for the generated file
	var relativeOutfile = path.relative(compileConfig.dir.project,target.filepath);
	var mapDir = path.join(compileConfig.dir.project,CONST.DIR.MAP);
	var outfile = path.join(mapDir,relativeOutfile,path.basename(target.filename)) + '.' + CONST.FILE_EXT.MAP;
	wrench.mkdirSyncRecursive(path.dirname(outfile), 0755);
	var tmp = JSON.parse(sourceMap.toString())
	tmp.sources[0] = compiledFileName;
	tmp.sources[1] = origFileName;
	fs.writeFileSync(outfile, JSON.stringify(tmp));
	logger.debug('  map:        "' + outfile + '"');
};
