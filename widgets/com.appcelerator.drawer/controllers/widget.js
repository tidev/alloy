/**
 * The drawer widget manifests itself as a sliding panel on iOS and MobileWeb and as additions to the activity menu on Android.
 * The sliding panel has a row of horizontal buttons that take a 48x48 icon by default.
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
 * Request that the drawer run all the associated enabled callbacks for the buttons and set
 * their state.
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
 * Initialize the drawer
 * @param {TiUIWindow} mainWindow Window to add the menu items to on Android.
 * @param {Array} buttons
 * @example
 * [{
 *      id: STRING the id of this item.  Also selects the image icon for this item. (should be 48x48)
 *      title: STRING the text for this item (Android only).
 *      click: FUNCTION the callback to call when the button is clicked
 *      enabled: FUNCTION the callback to call to determine if the button should be enabled (returns true/false)
 * }]
 * @param {boolean} autoClose Automatically close the drawer after a button has been selected. default: false
 * @param {integer} iconSize Size of the icon to be used in the drawer. default: 48x48
 * @param {number} openOpacity Opacity of the drawer when it is open in the view. default: 0.9
 * @param {number} closeOpacity Opacity of the drawer when it is closed in the view. default: 0.75
 * @param {integer} animationDuration Duration, in milliseconds, to close/open the drawer. default: 500
 * @param {integer} gutter Offset used to space buttons from each other. default: 0
 * @param {string} overrideMenu Override the use of the menu in Android and use a drawer like in iOS/MobileWeb
 * * */

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


