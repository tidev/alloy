var text = 'CUSTOM LABEL.';

exports.createCustomLabel = function(args) {
    args.text = text;
    return Ti.UI.createLabel(args);
};
