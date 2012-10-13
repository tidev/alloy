 /**
 * @class Alloy.widget.drawer, see the documentation in the docs folder for more details.
 * # Drawer Widget
 * ## Overview
 * 
 * The **Drawer** widget provides a sliding panel of buttons to pull up from the bottom of the screen. As an option, the drawer can automatically close after it has been used. On Android, the drawer manifests itself as the activity menu, unless the developer wants to specifically override that capability.
 * 
 * ![iOS Drawer Closed](img/ios_closed.png)
 * ![iOS Drawer Closed](img/ios_open.png)
 * 
 * ![Android Activity Menu Version](img/android_overridemenu_false.png)
 * ![Android Drawer Version](img/android_overridemenu_true.png)
 * 
 * ## Manifest
 * * Version: 1.0 (stable)
 * * Github: https://www.github.com/appcelerator/alloy
 * * License: [Apache 2.0](http://www.apache.org/licenses/LICENSE-2.0.html)
 * * Author: Carl Orthlieb
 * * Supported Platforms: iOS, Android, Mobile Web
 * 
 * ## Adding the Drawer Widget to Your Alloy Project
 * 
 * * In your application's config.json file you will want to include the following line in your dependencies:
 * 
 * ```
 * "dependencies": {
 *     "com.appcelerator.drawer":"1.0"
 * }
 * ```
 * * If the app/widgets directory doesn't exist in your app then create one.
 * * Copy the drawer folder from the test app (widget_drawer/app/widgets) into your app/widgets directory. 
 * 
 * ## Create a Drawer in the View
 * 
 * You can add a drawer to a view by *requiring* the Drawer widget. 
 * 
 *     <Require type="widget" src="com.appcelerator.drawer" id="drawer"/>
 * 
 * Assign it an ID that you can use in your controller. E.g. `id="drawer"` You can now access the drawer via `$.drawer` in your controller. Note that the containing view needs to have a layout of "absolute", which is the default, and not "horizontal" or "vertical", in order to have the drawer work properly.
 * 
 * ## Initializing the Drawer in the Controller
 * 
 * The drawer doesn't have any buttons in it until you initialize it in your controller. Before you open your window, you will want to call the drawer with the *init* method. For example:
 * 
 * ```
 * $.drawer.init({
 *     mainWindow: $.index,
 *     buttons: [
 *         { id: 'One', title: 'One', click: function (e) { alert("One"); } },
 *         { id: 'Two', title: 'Two',  click: function (e) { alert("Two"); } },    
 *         { id: 'Three', title: 'Three',  click: function (e) { alert("Three"); } }    
 *     ],
 *     autoClose: true,
 *     gutter: 5
 * });
 * ```
 * ### Required Initialization Parameters
 * 
 * | Parameter | Type | Description |
 * | --------- | ---- | ----------- |
 * | mainWindow | *TiUIWindow* | You must supply a window for your drawer so that it can create menu items for the menu attached to the window's activity on Android. Typically, you'll pass in `$.<yourwindowid>` If you haven't changed the main window id then the Alloy default will be `$.index`. |
 * | buttons | *array* | The buttons array is an array of button objects each of which  describes a button to create in the drawer. |
 * 
 * #### button Object
 * | Parameter | Type | Description |
 * | --------- | ---- | ----------- |
 * | id | *string* | Unique id for this item. This id also selects the image icons for this button. The drawer expects to find the image at app/assets/images/\<id\>Enabled.png and app/assets/images/\<id\>Disabled.png. Default icon size is 48x48 pixels. |
 * | title | *string* | The text that describes this button that will appear underneath the icon (Android activity menu version only). |
 * | click | *function* | *Optional.* The callback to call when the button is clicked. The function has an event parameter similar to that used for regular buttons. If you don't specify a click callback then the button does nothing. |
 * | enabled | *function* | *Optional.* The callback to call to determine whether the button should be enabled. This callback should return true (enabled) or false (disabled). Default is for the buttons to always be enabled. |
 * 
 * ### Optional Initialization Parameters
 * 
 * There are number of aspects of the Drawer that you can change, you can include these in your parameters when you call the init method.
 * 
 * | Parameter | Type | Affects | Description |
 * | --------- | ---- | ------- | ----------- |
 * | animationDuration | *integer* | iOS, MW | The duration, in milliseconds, of the animation to close/open the drawer. Default: *500* |
 * | annoy | *integer* | iOS, MW | Jiggle the drawer up and down *annoy* times until the user opens it the first time. Setting annoy to -1 causes it to happen forever. Default: *0* |
 * | autoClose | *boolean* | iOS, MW | If true, automatically closes the drawer after a button has been pressed. Default: *false* |
 * | closeOpacity| *number* | iOS, MW | A number between 0 (transparent) and 1 (opaque) that denotes the opacity of the drawer when it is closed. Default: *0.75* |
 * | gutter | *integer* | iOS, MW | The offset, in pixels, used to space buttons from each other in the drawer. Default: *0* |
 * | iconSize | *integer* | iOS, MW | Size of the icon, in pixels, to used on buttons in the drawer. Default: *48x48* |
 * | openOpacity | *number* | iOS, MW | A number between 0 (transparent) and 1 (opaque) that denotes the opacity of the drawer when it is open. Default: *0.9* |
 * | overrideMenu | *boolean* | Android | Override the use of the activity menu in Android and use a drawer like in iOS/MobileWeb. In this case, the above parameters do affect Android. Default: *false* |
 * 
 * ## Enabling and Disabling Buttons
 * 
 * With Android, if overrideMenu is not true, the `enable()` callback is called automatically before the menu is shown. In all other cases, you will need to explicitly call the drawer's `checkEnabled()` method in order to get those callbacks to fire.
 * 
 * You should call this function whenever a state change could affect the enable state of buttons in the drawer. For example, if your main window displays a web view and you want to enable some forward/back buttons based on the properties of that web view after it has loaded, you might create the following callback attached to the onLoad event:
 * 
 * ```
 * function webviewLoad(e) {
 *     $.index.title = $.webview.evalJS("document.title");
 *     $.drawer.checkEnabled();
 * }; 
 * ```
 * 
 * ## Binding
 * Because you are passing in functions to be called when a button is clicked, be aware of your binding. The *this* object is not the same when the `click()` and `enable()` callbacks are called as when they are defined. There are many excellent articles that talk about this issue:
 * 
 * * [Getting Out of Binding Situations in JavaScript](http://www.alistapart.com/articles/getoutbindingsituations/)
 * * [Javascript, "bind", and "this"](http://fitzgeraldnick.com/weblog/26/)
 * * [Binding Scope in JavaScript](http://www.robertsosinski.com/2009/04/28/binding-scope-in-javascript/)
 * 
 * It's recommended that you use the underscore library's [bind](http://underscorejs.org/#bind) function to bind your callbacks when needed.
 * 
 * ```
 * $.drawer.init({
 *     buttons: [
 *         { id: 'Fancy', text: 'Fancy', click: 
 *             _.bind(function FancyClick(e) { alert(this.one); }, this) 
 *         }
 *     ]
 * });
 * ```
 */

var DRAWER_PULLTAB_HEIGHT = 16;

var defaults = {
    autoClose: false,       // Automatically close the drawer after a button has been selected. 
    iconSize: 48,           // Size of the icon to be used in the drawer
    openOpacity: 0.9,       // Opacity of the drawer when it is open in the view. 
    closeOpacity: 0.75,     // Opacity of the drawer when it is closed in the view.
    animationDuration: 500, // Duration, in milliseconds, to close/open the drawer. 
    gutter: 0,              // Offset used to space buttons from each other.
    overrideMenu: false,     // Override the use of the menu in Android and use a drawer like in iOS/MobileWeb.
    annoy: 0
};

$._isOpen = false;        // Whether the drawer is open or not.
$._buttons = [];          // Button descriptions.
$._params = {};           // Behavior and styling parameters for the drawer. Originally set to defaults.
$._annoy = false;         // Annoy interval variable, useful for clearInterval.

function pullTabClick(e) {
    $._isOpen = !$._isOpen;
    $.pulltab.backgroundImage = "/images/com.appcelerator.drawer/" + ($._isOpen ? "PullTabDown.png" : "PullTabUp.png");
    
    Ti.API.info(($._isOpen ? "Opening" : "Closing") + " the drawer (buttonbar=" + ($._params.iconSize + $._params.gutter * 2) + ", drawer=" + $.drawer.size.height + ")");
    $.pulltab.accessibilityHint = "Click to " + ($._isOpen ? "close" : "open") + " the drawer";
    
    $.drawer.animate({
        bottom: $._isOpen ? 0 : -($._params.iconSize + $._params.gutter * 2),
        opacity: $._isOpen ? $._params.openOpacity : $._params.closeOpacity,
        duration: $._params.animationDuration
    });
    
    if ($._isOpen && $._annoy)
        clearInterval($._annoy);
}

/**
 * @method jiggle
 * Jiggles the drawer up and down slightly to draw the user's attention to it. Does nothing if the drawer is already open or the
 * Android activity menu is being used.
 */
exports.jiggle = function DrawerJiggle() {
    if ($._isOpen || (OS_ANDROID && !$._params.overrideMenu))
        return;
        
    var animation = require('alloy/animation');
      
    var chain = [ // Fade out and move off screen, fade in and move below center, bounce up above center, bring down to center, fade
        Ti.UI.createAnimation({ bottom: -($._params.iconSize + $._params.gutter * 2) + DRAWER_PULLTAB_HEIGHT, duration: 250 }),
        Ti.UI.createAnimation({ bottom: -($._params.iconSize + $._params.gutter * 2) - DRAWER_PULLTAB_HEIGHT / 2, duration: 125 }),
        Ti.UI.createAnimation({ bottom: -($._params.iconSize + $._params.gutter * 2), duration: 125 })
     ];
    animation.chainAnimate($.drawer, chain);           
};

/**
 * @method checkEnabled
 * Request that the drawer run all the associated `enabled` callbacks for the buttons and set
 * their state. Call this function whenever a state change could affect the enable state of
 * buttons in the drawer.
 *
 * On Android, if `overrideMenu` is `false`, the `enabled` callback is called automatically
 * before the menu is shown. In all other cases, you will need to explicitly call the
 * `checkEnabled` method in order to get those callbacks to fire.
 */
exports.checkEnabled = function DrawerCheckEnabled() {
    if (OS_IOS || OS_MOBILEWEB || $._params.overrideMenu) {
        Object.keys($._buttons).forEach(
            function (key) {
                var i = parseInt(key);
                if ($._buttons[i].enabled)
                    $._buttons[i].button.enabled = $._buttons[i].enabled();
            }
        );
    }
}

/**
 * @method init
 * Initializes the drawer.
 * @param {Titanium.UI.Window} mainWindow Window to add the menu items to on Android.
 * @param {Array.<Object>} buttons Array of button objects.
 * @param {String} buttons.id ID of this button and identifies the image icon.
 * @param {String} buttons.title Text for this button in the Android menu.
 * @param {function(Object)} [buttons.click] Callback fired when the button is clicked.
 * Passed context is an event object, which is the same as the one from Titanium.UI.Button.click.
 * @param {function(void):Boolean} [buttons.enabled] Callback to determine if the button should
 * be enabled. No context is passed. Returned value is a boolean.
 * @param {Boolean} [autoClose=false] Automatically close the drawer after a button has been selected.
 * @param {Number} [iconSize=48] Size of the icon to be used in the drawer.
 * @param {Number} [openOpacity=0.9] Opacity of the drawer when it is open in the view.
 * @param {Number} [closeOpacity=0.75] Opacity of the drawer when it is closed in the view.
 * @param {Number} [animationDuration=500] Duration, in milliseconds, to close or open the drawer.
 * @param {Number} [gutter=0] Offset used to space buttons from each other.
 * @param {String} [overrideMenu=false] Overrides the use of the menu in Android and use a drawer like in iOS and Mobile Web.
 * @param {Number} [annoy=0] Jiggle the drawer up and down <annoy> times until the user opens it the first time. Setting annoy to -1 causes it to happen forever.
 * */

exports.init = function DrawerInit(args) {
    $._buttons = args.buttons;
    $._params = _.defaults(args, defaults);
     
    if (OS_IOS || OS_MOBILEWEB || $._params.overrideMenu) {
        // Resize the drawer based on the icon size
        $.buttonbar.height = $._params.iconSize + $._params.gutter * 2;   
        $.drawer.height = DRAWER_PULLTAB_HEIGHT + $.buttonbar.height;
        $.drawer.bottom = - $.buttonbar.height;
        
        // Create and add buttons to the drawer
        Object.keys($._buttons).forEach(
            function (key) {
                var i = parseInt(key); 
                Ti.API.info("Setting enabled image " + '/images/' + $._buttons[i].id + 'Enabled.png');
                $._buttons[i].button = Ti.UI.createButton({
                    top: $._params.gutter, left: $._params.gutter, width: $._params.iconSize, height: $._params.iconSize,
                    backgroundImage: '/images/' + $._buttons[i].id + 'Enabled.png',
                    backgroundDisabledImage: '/images/' + $._buttons[i].id + 'Disabled.png'
                });
        
                $._buttons[i].button.addEventListener('click', function (e) {
                    $._buttons[i].click(e);
                    if ($._params.autoClose)
                        pullTabClick(e);    // Close the drawer.
                });
                
                $.buttonbar.add($._buttons[i].button);      
            }
        );  
        
        if ($._params.annoy) {
            $._annoy = setInterval(function DrawerAnnoy() {
                // Decrement the annoy parameter if it is set and greater than zero. Once it
                // hits zero then clear the interval.
                if ($._params.annoy > 0)
                    $._params.annoy--;
                if ($._params.annoy == 0)
                    clearInterval($._annoy);
                $.jiggle();
            }, 2000);
        } 
    } else if (OS_ANDROID && !$._params.overrideMenu) {
        // On Android, the drawer takes the form of the standard Android menu.
        $.drawer.visible = false;   // Hide the drawer, not needed.
        
        var activity = $._params.mainWindow.activity;

        activity.onCreateOptionsMenu = function(e) {
            var menu = e.menu;
            Object.keys($._buttons).forEach(
                function (key) {
                    var i = parseInt(key);
                    var menuItem = menu.add({ title: $._buttons[i].title, itemId: i });
                    menuItem.setIcon('/images/' + $._buttons[i].id + 'Enabled.png');
                    if ($._buttons[i].click)
                        menuItem.addEventListener("click", $._buttons[i].click);
                }
            );
        };
        activity.onPrepareOptionsMenu = function(e) {
             var menu = e.menu;
             Object.keys($._buttons).forEach(
                function (key) {
                    var i = parseInt(key);
                    var menuItem = menu.findItem(i);
                    menuItem.enabled = $._buttons[i].enabled ? $._buttons[i].enabled() : true;
                }
            );
        };
    }
}


