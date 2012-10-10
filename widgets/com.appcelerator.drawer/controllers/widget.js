 /**
 * @class com.appcelerator.drawer, see the documentation in the docs folder for more details.
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

$._isOpen = false;        // Whether the drawer is open or not.
$._buttons = [];          // Button descriptions.
$._params = {};           // Behavior and styling parameters for the drawer. Originally set to defaults.

function pullTabClick(e) {
    $._isOpen = !$._isOpen;
    $.pulltab.backgroundImage = "/images/com.appcelerator.drawer/" + ($._isOpen ? "PullTabDown.png" : "PullTabUp.png");
    
    Ti.API.info(($._isOpen ? "Opening" : "Closing") + " the drawer (buttonbar=" + ($._params.iconSize + $._params.gutter * 2) + ", drawer=" + $.drawer.size.height + ")");
    
    var animation = Ti.UI.createAnimation({
        bottom: $._isOpen ? 0 : -($._params.iconSize + $._params.gutter * 2),
        opacity: $._isOpen ? $._params.openOpacity : $._params.closeOpacity,
        duration: $._params.animationDuration
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
 * @param {String} [overrideMenu=false] Overrides the use of the menu in Android and use a drawer
 * like in iOS and Mobile Web.
 */

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


