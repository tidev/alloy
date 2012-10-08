var pro = require("../../../uglify-js/uglify-js").uglify;

exports.process = function(ast, config, report) {
	var opts = {
        make_seqs   : false,  // Make sequences out of multiple statements?
        dead_code   : true,   // Remove dead code?
        no_warnings : true,   // Don't print squeeze warning?
        keep_comps  : true,   // Don't try to optimize comparison operators? (unsafe)
        unsafe      : false   // Alloy potentially unsafe optimizations?
    };

	return pro.ast_squeeze(ast, opts); 
}