var Alloy = require('/alloy'),
Backbone = Alloy.Backbone,
_ = Alloy._;




function __processArg(obj, key) {
  var arg = null;
  if (obj) {
    arg = obj[key] || null;
  }
  return arg;
}

function Controller() {

  require('/alloy/controllers/' + 'BaseController').apply(this, Array.prototype.slice.call(arguments));
  this.__controllerPath = 'index';
  this.args = arguments[0] || {};

  if (arguments[0]) {
    var __parentSymbol = __processArg(arguments[0], '__parentSymbol');
    var $model = __processArg(arguments[0], '$model');
    var __itemTemplate = __processArg(arguments[0], '__itemTemplate');
  }
  var $ = this;
  var exports = {};
  var __defers = {};

  // Generated code that must be executed before all UI and/or
  // controller code. One example is all model and collection
  // declarations from markup.


  // Generated UI code
  $.__views.index = Ti.UI.createWindow(
  { backgroundColor: "#fff", fullscreen: false, exitOnClose: true, id: "index" });

  $.__views.index && $.addTopLevelView($.__views.index);
  $.__views.webview = Ti.UI.createWebView(
  { id: "webview", onlink: onLinkHandler });

  $.__views.index.add($.__views.webview);
  exports.destroy = function () {};

  // make all IDed elements in $.__views available right on the $ in a
  // controller's internal code. Externally the IDed elements will
  // be accessed with getView().
  _.extend($, $.__views);

  // Controller code directly from the developer's controller file
  var htmlText =
  '<!DOCTYPE html>\n' +
  '<html>\n' +
  '	<head>\n' +
  '		<meta name="viewport" content="width=device-width, initial-scale=1.0">\n' +
  '	</head>\n' +
  '	<body>\n' +
  '		<p>WebView "onlink" Test</p>\n' +
  '		<br/>\n' +
  '		<br/>\n' +
  '		<a href="mylink://show/alert">Show Alert</a>\n' +
  '	</body>\n' +
  '</html>\n';

  function onLinkHandler(e) {
    if (e.url === 'mylink://show/alert') {
      alert("The 'onLinkHandler' callback was invoked.");
      return false;
    }
    return true;
  }
  $.webview.html = htmlText;
  $.index.open();

  // Generated code that must be executed after all UI and
  // controller code. One example deferred event handlers whose
  // functions are not defined until after the controller code
  // is executed.


  // Extend the $ instance with all functions and properties
  // defined on the exports object.
  _.extend($, exports);
}

module.exports = Controller;
//# sourceMappingURL=file:///Users/eharris/Documents/git/alloy/test/projects/Harness/build/map/Resources/windows/alloy/controllers/index.js.map