/**
 * @class Alloy.builtins.dialogs
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
