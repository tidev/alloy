/**
 * @class Alloy.builtins.dialogs
 * A collection of utilities for generating dialog boxes.
 * To use the dialogs builtin library,
 * require it with the `alloy` root directory in your `require` call. For example:
 *
 *     var dialogs = require('/alloy/dialogs');
 *     dialogs.confirm({});
 */

/**
 * @property {String} title
 * To be used as default title for confirm-method AlertDialog
 */
exports.title = 'Confirm';

/**
 * @property {String} message
 * To be used as default message for confirm-method AlertDialog
 */
exports.message = 'Are you sure?';

/**
 * @property {Array} buttonNames
 * To be used as default buttonNames for confirm-method AlertDialog
 */
exports.buttonNames = ['No', 'Yes'];

/**
 * @method confirm
 * Creates a confirmation dialog box. Default values may be overridden and a callback function
 * may be called after an affirmative response.
 * @param {...*} args Dialog box parameters.
 * @param {String} [args.title="Confirm"] Title of the dialog box.
 * @param {String} [args.message="Are you sure?"] Message of the dialog box.
 * @param {String} [args.yes="Yes"] Label of the affirmative button of the dialog box.
 * @param {String} [args.no="No"] Label of the negative button of the dialog box.
 * @param {Function} [args.callback] Callback function invoked after an affirmative response.
 * @param {Function} [args.cancel] Callback function invoked after a negative response.
 * @param {...*} [args.evt] Callback context.
 */
exports.confirm = function (args) {
	args = args || {};
	if (args.buttonNames) {
		args.no = args.no || args.buttonNames[0];
		args.yes = args.yes || args.buttonNames[1];
	}

	var alertDialog = Ti.UI.createAlertDialog({
		title: args.title || exports.title,
		message: args.message || exports.message,
		buttonNames: [args.no || exports.buttonNames[0], args.yes || exports.buttonNames[1]],
		cancel: 0
	});
	alertDialog.addEventListener('click', function (evt) {
		if (evt.index) {
			if (args.callback) {
				args.callback(args.evt || {});
			}
		} else if (args.cancel) {
			args.cancel(args.evt || {});
		}
		args = null;
	});
	alertDialog.show();
};
