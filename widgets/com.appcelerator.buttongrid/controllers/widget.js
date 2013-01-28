/**
 * @class Alloy.widgets.buttongrid
 * 
 * The **ButtonGrid** widget provides a cross-platform grid of buttons that automatically lay themselves out in the view similar to the iOS native Dashboard control. 
 * 
 * ## Manifest
 * * Version: 1.0 (stable)
 * * Github: https://www.github.com/appcelerator/alloy
 * * License: [Apache 2.0](http://www.apache.org/licenses/LICENSE-2.0.html)
 * * Author: Carl Orthlieb
 * * Supported Platforms: iOS, Android, Mobile Web
 * 
 * ## Adding the ButtonGrid Widget to Your Alloy Project
 * 
 * In your application's config.json file you will want to include the following line in your dependencies:
 * 
 *     "dependencies": {
 *         "com.appcelerator.buttongrid":"1.0"
 *     }
 * 
 * ### Creating a Local Copy
 * Normally, ButtonGrid can be accessed without copying because it is part of Alloy.
 * Adding it as a dependency to your project is enough. However, if you want to create a copy
 * local to your application so that you can further modify it, then you will need to:
 * 
 * 1. Create a widgets directory in your app directory if it does not already exist.
 * 2. Copy the com.appcelerator.buttongrid folder from the `Resources/alloy/widgets` directory into your `app/widgets` directory. 
 * 
 * ## Create a ButtonGrid in the View
 * 
 * You can add a ButtonGrid to a view by *requiring* the ButtonGrid widget. 
 * 
 *     <Widget id="buttongrid" src="com.appcelerator.buttongrid"/>
 * 
 * Assign it an ID that you can use in your controller, for example, `id="buttongrid"`.
 * You can now access the ButtonGrid using `$.buttongrid` in your controller. 
 * 
 * ## Initializing the ButtonGrid in the Controller
 * 
 * The buttongrid does not have any buttons in it until you initialize it in your controller.
 * Before you open your window, you will want to call the buttongrid with the `init` method. For example:
 * 
 *     $.buttongrid.init({
 *         buttons: [
 *             { id: 'Cloudy', title: "Cloudy", backgroundColor: gray, backgroundSelectedColor: lightgray },
 *             { id: 'Drizzle', title: "Drizzle" },
 *             { id: 'Haze', title: 'Haze' },
 *             { id: 'MostlyCloudy', title: "Mostly Cloudy" },
 *             { id: 'SlightDrizzle' },
 *             { id: 'Snow', title: 'Snow' },
 *             { id: 'Sunny', title: 'Sunny' },
 *             { id: 'Thunderstorms', title: 'Thunderstorms', click: function (e) { alert("Thunder!"); } }
 *         ],
 *         buttonWidth: Alloy.isTablet ? 200: 100,
 *         buttonHeight: Alloy.isTablet ? 200 : 100,
 *         backgroundColor: red,
 *         backgroundSelectedColor: brightred
 *     });
 * 
 * ## Binding
 * Because you are passing in functions to be called when a button is clicked, be aware of your binding.
 * The *this* object is not the same when the `click()` and `enable()` callbacks are called as when
 * they are defined. There are many excellent articles that talk about this issue:
 * 
 * * [Getting Out of Binding Situations in JavaScript](http://www.alistapart.com/articles/getoutbindingsituations/)
 * * [Javascript, "bind", and "this"](http://fitzgeraldnick.com/weblog/26/)
 * * [Binding Scope in JavaScript](http://www.robertsosinski.com/2009/04/28/binding-scope-in-javascript/)
 * 
 * It is recommended that you use the underscore library's [bind](http://underscorejs.org/#bind) function to bind your callbacks when needed.
 * 
 *     $.buttongrid.init({
 *         buttons: [
 *             { id: 'Fancy', text: 'Fancy', click: 
 *                 _.bind(function FancyClick(e) { alert(this.one); }, this) 
 *             }
 *         ]
 *     });
 * 
 * ## Relaying out the ButtonGrid
 * If you ever have a need to relayout the ButtonGrid for a reason other than orientation (which is automatically supported), you can call the `relayout` method directly.
 * 
 *     $.buttongrid.relayout();
 * 
 * The grid will calculate a new gutter between the buttons and animate the buttons into place one at a time.
 * **Note**: If you use autoLayout="true" (default) then a Ti.Gesture event handler will be used to relayout 
 * the widget based on orientation changes. To avoid any potential memory leaks associated with using these 
 * global event handlers, you must call the **destroy()** function on the widget when you are done using it.
 * This will free all memory resources associated with the widget. If you have autoLayout="false", then you are
 * not required to call **destroy()** when you are done with the widget.
 */

var TEXTSIZE = 10;

var defaults = {
    buttonWidth: 50,
    buttonHeight: 75,
    textSize: TEXTSIZE + 'dp',  // Font size of the label for the button.
    textColor: 'white',         // Text color of the label.
    textSelectedColor: 'black',  // Text color of the label when the button is selected.
    assetDir: '/images/'		// Subdirectory to find the button assets.
};
/**
 * @method init
 * Initializes the button grid.
 * @param {Boolean} [autoLayout=true] If true, the widget will automatically adjust the layout for orientation events, which requires you to execute destroy() when you are done. if false, the widget does not adjust its layout automatically, and you are not required to call destroy() when finished using it.
 * @param {Array.<Object>} buttons The buttons array is an array of button objects each of which  describes a button to create in the grid.
 * @param {String} buttons.id Unique id for this item. This id also selects the image icons for this button. The ButtonGrid expects to find the image at app/assets/images/\<id\>.png.
 * @param {String} [buttons.title] The text that describes this button that will appear underneath the icon.
 * @param {function(Object)} [buttons.click] The callback to call when the button is clicked. The function has an event parameter similar to that used for Titanium.UI.Button.click. Overrides the global click callback, if any. 
 * @param {String} [buttons.backgroundColor=transparent] RGB triplet or named color to use as the background for the button. This overrides any ButtonGrid level backgroundColor.
 * @param {String} [buttons.backgroundSelectedColor=transparent] RGB triplet or named color to use as the background for the button when it is selected. This overrides any ButtonGrid level backgroundColor.         
 * @param {Number} buttonWidth Width of a button in pixels.
 * @param {Number} buttonHeight Height of a button in pixels.
 * @param {String} [backgroundColor=transparent] RGB triplet or named color to use as the background for the button. This can be overridden by button definition itself.
 * @param {String} [backgroundSelectedColor=transparent] RGB triplet or named color to use as the background for the button when it is selected. This can be overridden by button definition itself.
 * @param {Number} [duration=2000] Duration, in milliseconds, for the grid to animate when relaying out on orientation change.
 * @param {Number/String} [textSize=10dp] Size of the text label in the button.
 * @param {String} [textColor=white] RGB triplet or named color to use for the text label on the button.
 * @param {String} [textSelectedColor=black] RGB triplet or named color to use for the text label on the button when it is selected.
 * @param {String} [assetDir='/images/'] Directory where assets for the button grid can be found. 
 * @param {function(Object)} [click] The general callback to call when any button is clicked. The function has an event parameter similar to that used for Titanium.UI.Button.click. Can be overridden by the individual button click callbacks.
 */
exports.init = function ButtonGridInit(args) {
    $._buttons = args.buttons;
    $._params = _.defaults(args, defaults);
    
    _.each($._buttons, function (button, index) {
        Ti.API.info('Buttongrid: creating button ' + button.id);
            
        var buttonProps = _.defaults(button, {
            center: { x: "50%", y: "50%" },    
            backgroundImage: $._params.assetDir + button.id + '.png',
            backgroundColor: $._params.backgroundColor || 'transparent',
            backgroundSelectedColor: $._params.backgroundSelectedColor || 'transparent',
            width: $._params.buttonWidth,
            height: $._params.buttonHeight,
            click: $._params.click
        });
            
        if (OS_ANDROID || OS_MOBILEWEB) {
            if (button.title) {
                // On Android we can add a label to a button and align it to the bottom. The vertical align doesn't work on iOS.
                buttonProps.title = button.title;
                buttonProps.textAlign = Ti.UI.TEXT_ALIGNMENT_CENTER;
                buttonProps.verticalAlign = Ti.UI.TEXT_VERTICAL_ALIGNMENT_BOTTOM;
                buttonProps.font = { fontSize: $._params.textSize };
                buttonProps.color = $._params.textColor;
                buttonProps.selectedColor = $._params.textSelectedColor;
            }
        }
            
        // Create and add the button to the scroll view.
        $._buttons[index].b = Ti.UI.createButton(buttonProps);
        if (button.click) {
            $._buttons[index].b.addEventListener('click', button.click);
        }
        $.scrollview.add($._buttons[index].b);
            
        if (OS_IOS && button.title) {
            // On iOS we need to place the text label into the button view proper. 
            var theLabel = Ti.UI.createLabel({
                color: $._params.textColor,
                backgroundColor: 'transparent',
                width: $._params.buttonWidth,
                height: Ti.UI.SIZE,
                bottom: (TEXTSIZE / ((button.title.split("\n").length - 1) ? 2 : 1)) + 'dp',
                font: { fontSize: $._params.textSize },
                text: button.title,
                textAlign: 'center',
                touchEnabled: false
            });
            $._buttons[index].b.add(theLabel);  
            $._buttons[index].b.title = ''; // Override the default title, which doesn't work well with the icon.                
        }
    });
    
    var autoLayout = $._params.autoLayout || typeof $._params.autoLayout === 'undefined';
    if (autoLayout) {
        Ti.Gesture.addEventListener("orientationchange", exports.relayout);
    }
    exports.relayout();
};

/** 
 * @method destroy
 * Frees all resources associated with the button grid when done using it.
 * This function should be called when the button grid is no longer being 
 * used to ensure that all memory allocated to it is released.
 */
exports.destroy = function() {
    Ti.Gesture.removeEventListener('orientationchange', exports.relayout);
    _.each($._buttons, function(button) {
        if (button.click) {
            button.b.removeEventListener('click', button.click);
        }
        $.scrollview.remove(button.b);
        button.b = null;
    });
};

/**
 * @method relayout
 * Redraws the buttons grid.
 * @param {Object} e Unused.
 */
exports.relayout = function ButtonGridRelayout(e) {
    Ti.API.info("ButtonGrid: relayout");
    var duration = $._params.duration || 2000;
    
    // Modify the width of the overall scroll view to reflect the rotation.
    $.scrollview.contentWidth = Ti.Platform.displayCaps.getPlatformWidth();
    $.scrollview.contentHeight = 'auto';

    // Calculate the new gutter.
    var w = Ti.Platform.displayCaps.getPlatformWidth();
    var n = Math.floor(w / $._params.buttonWidth);
    var gutter = (w - n * $._params.buttonWidth) / (n + 1);
    var left = gutter, top = gutter;

    // Animate the buttons into place.
    _.each($._buttons, function (button) {
        button.b.animate({
            left: left,
            top: top,
            duration: duration
        });
        left += gutter + $._params.buttonWidth;
        if (left >= w) {
            left = gutter;
            top += gutter + $._params.buttonHeight;
        }
    });
};

exports.getButton = function (id) {
    for (var i in $._buttons) {
        if ($._buttons[i].id == id)
            return $._buttons[i].b;
    }
    
    return false;
}
