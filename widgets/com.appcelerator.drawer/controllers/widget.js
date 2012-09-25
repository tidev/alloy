/**
 * @class Alloy.widgets.drawer
 * The drawer widget appears as a sliding panel on iOS and Mobile Web, and as additions to
 * the activity menu or as a sliding panel on Android.
 * The sliding panel has a row of horizontal buttons. By default, the buttons are a set of
 * 48x48-pixel PNG images.
 *
 * ### Usage
 *
 * To use the widget, first add it as a dependency in the `config.json` file:
 *
 *      "dependencies": {
 *          "com.appcelerator.drawer":"1.0"
 *      }
 *
 * Next, add it to a view in the project, using the Require tag:
 *
 *     <Require id="drawer" type="widget" src="com.appcelerator.drawer"/>
 *
 * Note: the `id` attribute is a unique identfier and can be anything. `drawer` is just an example.
 *
 * In the controller, use the `init` method to initialize the drawer configration before opening
 * the window:
 *
 *     $.drawer.init({
 *         mainWindow: $.index,
 *         buttons: [
 *             { id: 'One', text: 'One', click: function (e) { alert("One"); } },
 *             { id: 'Two', text: 'Two',  click: function (e) { alert("Two"); } },
 *             { id: 'Three', text: 'Three',  click: function (e) { alert("Three"); } }
 *         ],
 *         autoClose: true,
 *         gutter: 5
 *     });
 *
 * In the 'assets' folder, add a folder called 'images' and place the drawer icons inside it.
 * Each button will have its own enabled and disabled icon.  The icon images will need to be called
 * '<button.id>Enabled.png' and '<button.id>Disabled.png'. For instance, in this example,
 * the project will need the following icons: OneEnabled.png, OneDisabled.png, TwoEnabled.png,
 * TwoDisabled.png, ThreeEnabled.png and ThreeDisabled.png.
 *
 * ### Accessing View Elements
 *
 * The following is a list of GUI elements in the widget's view.  These IDs can be used to
 * override or access the properties of these elements:
 *
 * - `drawer`: Titanium.UI.View for the entire widget.
 * - `pulltab`: Titanium.UI.Button for the pull tab button.
 * - `buttonbar`: Titanium.UI.View for the row of buttons.
 *
 * Prefix the special variable `$` and the widget ID to the element ID, to access
 * that view element, for example, `$.drawer.pulltab` will give you access to the Button.
 */

var DRAWER_PULLTAB_HEIGHT = 16;

var defaults = {
    autoClose: false,       // Automatically close the drawer after a button has been selected. 
    iconSize: 48,           // Size of the icon to be used in the drawer
    openOpacity: 0.9,       // Opacity of the drawer when it is open in the view. 
    closeOpacity: 0.75,     // Opacity of the drawer when it is closed in the view.
    animationDuration: 500, // Duration, in milliseconds, to close/open the drawer. 
    gutter: 0,              // Offset used to space buttons from each other.
    overrideMenu: false     // Override the use of the menu in Android and use a drawer like in iOS/MobileWeb.
};

_isOpen = false;        // Whether the drawer is open or not.
_buttons = [];          // Button descriptions.
_params = {};           // Behavior and styling parameters for the drawer. Originally set to defaults.

function pullTabClick(e) {
   _isOpen = !_isOpen;
   $.pulltab.backgroundImage = "/images/com.appcelerator.drawer/" + (_isOpen ? "PullTabDown.png" : "PullTabUp.png");
    
    var animation = Ti.UI.createAnimation({
        bottom: _isOpen ? 0 : -(_params.iconSize + _params.gutter * 2),
        opacity: _isOpen ? _params.openOpacity : _params.closeOpacity,
        duration: _params.animationDuration
    });
    $.drawer.animate(animation);
}

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
    if (OS_IOS || OS_MOBILEWEB || _params.overrideMenu) {
        Object.keys(_buttons).forEach(
            function (key) {
                var i = parseInt(key);
                if (_buttons[i].enabled)
                    _buttons[i].button.enabled = _buttons[i].enabled();
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
 * @param {String} [overrideMenu=false] Overrides the use of the menu in Android and use a drawer
 * like in iOS and Mobile Web.
 */

exports.init = function DrawerInit(args) {
    _buttons = args.buttons;
    _params = _.defaults(args, defaults);
     
    if (OS_IOS || OS_MOBILEWEB || _params.overrideMenu) {
        // Resize the drawer based on the icon size
        $.buttonbar.height = _params.iconSize + _params.gutter * 2;   
        $.drawer.height = DRAWER_PULLTAB_HEIGHT + $.buttonbar.height;
        $.drawer.bottom = - $.buttonbar.height;
        
        // Create and add buttons to the drawer
        Object.keys(_buttons).forEach(
            function (key) {
                var i = parseInt(key); 
                _buttons[i].button = Ti.UI.createButton({
                    top: _params.gutter, left: _params.gutter, width: _params.iconSize, height: _params.iconSize,
                    backgroundImage: '/images/' + _buttons[i].id + 'Enabled.png',
                    backgroundDisabledImage: '/images/' + _buttons[i].id + 'Disabled.png'
                });
        
                _buttons[i].button.addEventListener('click', function (e) {
                    _buttons[i].click(e);
                    if (_params.autoClose)
                        pullTabClick(e);    // Close the drawer.
                });
                
                $.buttonbar.add(_buttons[i].button);      
            }
        );   
    } else if (OS_ANDROID && !_params.overrideMenu) {
        // On Android, the drawer takes the form of the standard Android menu.
        $.drawer.visible = false;   // Hide the drawer, not needed.
        
        var activity = _params.mainWindow.activity;

        activity.onCreateOptionsMenu = function(e) {
            var menu = e.menu;
            Object.keys(_buttons).forEach(
                function (key) {
                    var i = parseInt(key);
                    var menuItem = menu.add({ title: _buttons[i].title, itemId: i });
                    menuItem.setIcon('/images/' + _buttons[i].id + 'Enabled.png');
                    if (_buttons[i].click)
                        menuItem.addEventListener("click", _buttons[i].click);
                }
            );
        };
        activity.onPrepareOptionsMenu = function(e) {
             var menu = e.menu;
             Object.keys(_buttons).forEach(
                function (key) {
                    var i = parseInt(key);
                    var menuItem = menu.findItem(i);
                    menuItem.enabled = _buttons[i].enabled ? _buttons[i].enabled() : true;
                }
            );
        };
    }
}


