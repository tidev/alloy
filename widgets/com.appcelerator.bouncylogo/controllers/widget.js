/**
 * @class Alloy.widgets.bouncylogo
 * 
 * The **BouncyLogo** widget provides a animated logo that is suitable for displaying when your application first starts.
 * 
 * ## Manifest
 * * Version: 1.0 (stable)
 * * Github: https://www.github.com/appcelerator/alloy
 * * License: [Apache 2.0](http://www.apache.org/licenses/LICENSE-2.0.html)
 * * Author: Carl Orthlieb
 * * Supported Platforms: iOS, Android, Mobile Web
 * 
 * ## Adding the BouncyLogo Widget to Your Alloy Project
 * 
 * In your application's config.json file you will want to include the following line in your dependencies:
 * 
 *     "dependencies": {
 *         "com.appcelerator.bouncylogo":"1.0"
 *     }
 * 
 * ### Creating a Local Copy
 * Normally, BouncyLogo can be accessed without copying because it is part of Alloy. Adding it
 * as a dependency to your project is enough. However, if you want to create a copy local to your
 * application so that you can further modify it, then you will need to:
 * 
 * 1. Create a widgets directory in your app directory if it does not already exist.
 * 2. Copy the `com.appcelerator.bouncylogo` folder from the `Resources/alloy/widgets` directory into your `app/widgets` directory. 
 * 
 * ## Adding the BouncyLogo to the View
 * 
 * You can add a bouncy logo to a view by using the *Widget* tag to bring in the BouncyLogo widget. 
 * 
 *     <Widget src="com.appcelerator.bouncylogo" id="logo"/>
 * 
 * Assign it an ID that you can use in your controller, for example, `id="logo"`. You can now access the
 * BouncyLogo via `$.logo` in your controller. Note that the containing view needs to have a
 * layout of "absolute", which is the default, and not "horizontal" or "vertical", in order
 * to have BouncyLogo work properly. 
 * 
 * Note that the logo starts offscreen and hidden, you will need to initialize it after your window
 * is open. Change your window to register for the `open` event if it has not already done so:
 * 
 *     <Window onOpen="IndexOpen">
 * 
 * ## Initializing the BouncyLogo in the Controller
 * 
 * Note that your logo starts offscreen and hidden, you will need to initialize it after your
 * window is open. During the open call you will want to call the BouncyLogo with the `init`
 * method. For example:
 * 
 *     function IndexOpen(e) {
 *         $.logo.init({ image: '/images/alloy.png', width: 216, height: 200 });
 *     }
 */

var defaults = {
    opacity: 0.5,           // Fade into the background after it settles
    durationIn: 1000,        // Duration to slide onto the screen and become opaque
    durationBounce: 500,    // Duration to bounce before settling
    durationFade: 2000,     // Duration to fade to specified opacity
    bounciness: 0.25        // 0 = no bounce, 1 = full height bounce
};

var animation = require('alloy/animation');

/**
 * @method init 
 * Initializes the bouncy logo, then bounces the logo into position.
 * @param {String} image The logo image resource.
 * @param {Number} width Width of the logo.
 * @param {Number} height Height of the logo.
 * @param {Number} [opacity=0.5] The final opacity of the logo once animation is complete.
 * @param {Number} [durationIn=1000] The duration, in milliseconds, for the logo to slide onto the screeen.
 * @param {Number} [durationBounce=500] The duration, in milliseconds, for the logo to bounce before settling.
 * @param {Number} [durationFade=2000] The duration, in milliseconds, for the logo to fade after it has settled.
 * @param {Number} [bounciness=0.25] The "bounciness" of the animation, where 0 is no bounce and 1 is a full logo height bounce.
 */
function BouncyLogoInit(args) {
    $._params = _.defaults(args, defaults);
    $.imageview.image = $._params.image;
    $.imageview.width = $._params.width;  
    $.imageview.height = $._params.height;

    BouncyLogoBounce($._params);
    Ti.Gesture.addEventListener('orientationchange', BouncyLogoRelayout); 
};
exports.init = BouncyLogoInit;

function BouncyLogoBounce(args) {
    // Bounce in the logo and fade.
    var w = Ti.Platform.displayCaps.platformWidth; // $.parent.size.width;
    var h = Ti.Platform.displayCaps.platformHeight; // $.parent.size.height;
    var chain = [ // Fade out and move off screen, fade in and move below center, bounce up above center, bring down to center, fade
        Ti.UI.createAnimation({ center: { x: w / 2, y: - h / 2 }, opacity: 0, duration: args.durationIn }),
        Ti.UI.createAnimation({ center: { x: w / 2, y: h / 2 + args.height * args.bounciness }, opacity: 1.0, duration: args.durationIn }),
        Ti.UI.createAnimation({ center: { x: w / 2, y: h / 2 - args.height * args.bounciness * 0.5 }, opacity: 1.0, duration: args.durationBounce }),
        Ti.UI.createAnimation({ center: { x: w / 2, y: h / 2 }, duration: args.durationBounce }),
        Ti.UI.createAnimation({ opacity: args.opacity, duration: args.durationFade })
    ];
    animation.chainAnimate($.imageview, chain);           
}

/**
 * @method relayout
 * Fades the logo out, then fades it in.
 */
function BouncyLogoRelayout(e) {
    // Fade logo out and then in in the right position.
    var w = Ti.Platform.displayCaps.platformWidth; // $.parent.size.width;
    var h = Ti.Platform.displayCaps.platformHeight; // $.parent.size.height;
    var chain = [ 
        Ti.UI.createAnimation({ opacity: 0, duration: 100 }),
        Ti.UI.createAnimation({ center: { x: w / 2, y: h / 2 }, duration: 100 }),
        Ti.UI.createAnimation({ opacity: $._params.opacity, duration: $._params.durationIn })
    ];
    Ti.API.info("BouncyLogo animating on re-orientation " + Ti.Gesture.orientation + " (" + w + "x" + h + ")");
    animation.chainAnimate($.imageview, chain);       
};
exports.relayout = BouncyLogoRelayout;

/**
 * @method reset
 * Logo exits upward off screen, then bounces in and fades
 */
function BouncyLogoReset(e) {
    BouncyLogoBounce($._params);
};
exports.reset = BouncyLogoReset;
