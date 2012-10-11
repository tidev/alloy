 /**
 * @class com.appcelerator.bouncylogo, see the documentation in the docs folder for more details.
 */

var defaults = {
    opacity: 0.5,           // Fade into the background after it settles
    durationIn: 1000,        // Duration to slide onto the screen and become opaque
    durationBounce: 500,    // Duration to bounce before settling
    durationFade: 2000,     // Duration to fade to specified opacity
    bounciness: 0.25        // 0 = no bounce, 1 = full height bounce
};

var animation = require('alloy/animation');

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

function BouncyLogoReset(e) {
    BouncyLogoBounce($._params);
};
exports.reset = BouncyLogoReset;
