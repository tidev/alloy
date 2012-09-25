/**
 * @class Alloy.widgets.loading
 * The loading widget displays an animated circular icon, which can be used to indicate that the
 * application is busy with a process or loading.
 *
 * ### Usage
 *
 * To use the widget, first add it as a dependency in the `config.json` file:
 *
 *     "dependencies": {
 *         "com.appcelerator.loading":"1.0"
 *     }
 *
 * Next, add it to a view in the project, using the Require tag:
 *
 *     <Require id="loading" type="widget" src="com.appcelerator.loading"/>
 *
 * Note: the `id` attribute is a unique identfier and can be anything. `loading` is just an example.
 *
 * In the controller, use the `setOpacity` method to hide or show the loading icon.
 *
 *     // Show the loading icon.
 *     $.loading.setOpacity(1.0);
 *
 *     // Load some content...
 *
 *     // Hide the loading icon.
 *     $.loading.setOpacity(0.0);
 *
 * ### Accessing View Elements
 *
 * The following is a list of GUI elements in the widget's view.  These IDs can be used to
 * override or access the properties of these elements:
 *
 * - `loading`: Titanium.UI.ImageView for the loading icon.
 *
 * Prefix the special variable `$` and the widget ID to the element ID, to access
 * that view element, for example, `$.loading.loading` will give you access to the ImageView.
 */


var args = arguments[0] || {};

for (var k in args) {
	$.loading[k] = args[k];	
}

if (Ti.Platform.osname === 'mobileweb') {
    $.loading.duration = 100;
} 
$.loading.start();

/**
 * @method setOpacity
 * Sets the opacity of the loading image.
 * @param {Number} opacity Opacity from 0.0 (transparent) to 1.0 (opaque).
 */
exports.setOpacity = function(opacity) {
	$.loading.opacity = opacity;		
};