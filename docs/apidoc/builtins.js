/**
 * @class Alloy.builtins
 * Alloy provides some additional utility libraries that simplify certain functions,
 * such as animations, string manipultation and display unit conversion.  These libraries
 * are referred to as "builtins."
 *
 * To use a builtin library, require the library name, minus the '.js' extension,
 * with `alloy` as the root directory in your `require` call.
 * For example, to use the animation builtin:
 *
 *     var animation = require('alloy/animation');
 *     animation.crossFade(view1, view2, 500, finishCallback);
 *
 * During the compilation process, Alloy determines which builtins are being used,
 * and adds them to the generated Titanium project.
 */
