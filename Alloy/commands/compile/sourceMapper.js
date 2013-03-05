var SM = require('source-map'),
	fs = require('fs'),
	U = require('../../utils'),
	uglifyjs = require('uglify-js'),
	logger = require('../../common/logger'),
	_ = require('../../lib/alloy/underscore')._;

var lineSplitter = /(?:\r\n|\r|\n)/,
	mods = [
		'builtins',
		'optimizer',
		'compress'			
	],
	modLocation = './ast/';

var OPTIONS_OUTPUT = { 
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

exports.generateCodeAndSourceMap = function(generator, compileConfig) {
	var markers = _.map(generator.data, function(v,k) { return k }); 
	var mapper = new SM.SourceMapGenerator({ file: generator.target.filename });
	var genMap = {
		file: generator.target.filename,
		count: 1,
		code: ''
	}

	// initialize the rest of the generator properties
	var template = generator.target.template;
	var targetText = fs.existsSync(template) ? fs.readFileSync(template,'utf8') : '';
	generator.target.count = 1;
	generator.target.lines = targetText.split(lineSplitter);
	_.each(markers, function(marker) {
		var filepath = generator.data[marker].filepath;
		var dataText = fs.existsSync(filepath) ? fs.readFileSync(filepath,'utf8') : '';
		generator.data[marker].count = 1;
		generator.data[marker].lines = dataText.split(lineSplitter);
	});

	// generate the source map and composite code
	_.each(generator.target.lines, function(line) {
		console.log(line);

		var trimmed = U.trim(line).replace(/^\<\%\=\s+/,'').replace(/\s+\%\>$/,'');
		console.log(trimmed);
		if (_.contains(markers, trimmed)) {
			_.each(generator.data[trimmed].lines, function(line) {
				mapLine(mapper, generator.data[trimmed], genMap, line);
			});
		} else {
			mapLine(mapper, generator.target, genMap, line);
		}
	});

	// parse composite code into an AST
	var ast = uglifyjs.parse(genMap.code, { filename: genMap.file });

	// process all AST operations
	_.each(mods, function(mod) {
		logger.trace('- Processing "' + mod + '" module...');
		ast.figure_out_scope();
		ast = require(modLocation+mod).process(ast, compileConfig) || ast;
	});

	// create uglify-js source map and stream it out
	var sourceMap = uglifyjs.SourceMap({
		file: generator.target.filename,
		orig: mapper.toString()
	});
	var stream = uglifyjs.OutputStream(_.extend(_.clone(OPTIONS_OUTPUT), { 
		source_map: sourceMap
	}));
	ast.print(stream);

	// create the generated code and source map files
	fs.writeFileSync(generator.target.filepath, stream.toString());
	fs.writeFileSync(generator.target.filepath + '.map', sourceMap.toString());
};