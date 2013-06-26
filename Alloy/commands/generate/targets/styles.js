var basePath = '../../../';
var path = require('path'),
    fs = require('fs'),
    wrench = require('wrench'),
    xml2tss = require('xml2tss'),
    alloyRoot = path.join(__dirname,'..','..'),
    _ = require(basePath + 'lib/alloy/underscore')._,
    U = require(basePath + 'utils'),
    CONST = require(basePath + 'common/constants'),
    logger = require(basePath + 'logger');

// a recursive function to generate styles since xml2tss is async
function generateStyles(targets) {
  if (targets.length > 0) {
    // generate style
    var current = targets.pop();
    xml2tss.convertFile(current.view_path, function(err,content) {
      fs.writeFileSync(current.style_path, content);
      logger.info('Style generated: ' + current.style);
      generateStyles(targets);
    });
  }
}

module.exports = function(name, args, program) {
  var paths      = U.getAndValidateProjectPaths(program.outputPath),
      view_root  = path.join(paths.app,CONST.DIR.VIEW),
      style_root = path.join(paths.app,CONST.DIR.STYLE),
      targets =[];

  wrench.readdirSyncRecursive(view_root).forEach(function(view) {
    if (view.match(".xml$")) {
      var style = view.replace(/\.xml/,'.tss'),
          style_path = path.join(style_root, style),
          view_path  = path.join(view_root, view);

      // only generate if the style doesn't exist
      if (!path.existsSync(style_path)) {
        // make sure the target folder exists
        var fullDir = path.dirname(style_path);
        if (!path.existsSync(fullDir)) {
          wrench.mkdirSyncRecursive(fullDir);
        } 
        targets.push({style:style, style_path: style_path, view_path:view_path});
      }
    }
  });
  generateStyles(targets);
};
