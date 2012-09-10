/**
 * @class Alloy.builtins.dialogs
 * A collection of utilities for generating dialog boxes.
 * To use the dialogs builtin library, 
 * require it with the `alloy` root directory in your `require` call. For example:
 *
 *     var dialogs = require('alloy/dialogs');
 *     dialogs.confirm({});
 */


/**
 * @method confirm
 * Creates a confirmation dialog box. Default values may be overridden and a callback function
 * may be called after an affirmative response. 
 * @param {...*} args Dialog box parameters.
 * @param {String} [args.title="Confirm"] Title of the dialog box.
 * @param {String} [args.message="Are you sure?"] Message of the dialog box.
 * @param {String} [args.yes="Yes"] Label of the affirmative button of the dialog box.
 * @param {String} [args.no="No"] Label of the negative button of the dialog box.
 * @param {function} [args.callback] Callback function invoked after an affirmative response.
 * @param {...*} [args.evt] Callback context.
 */
exports.confirm = function (args) {
    var alertDialog = Ti.UI.createAlertDialog({
        title: args.title || 'Confirm',
        message: args.message || 'Are you sure?',
        buttonNames: [args.no || 'No', args.yes || 'Yes'],
        cancel: 0
    });
    alertDialog.addEventListener('click', function (evt) {
        if (evt.index) {
            args.callback && args.callback(args.evt || {});
        }
        args = null;
    });
    alertDialog.show();
};
