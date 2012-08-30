var dpi = Ti.Platform.displayCaps.dpi;

exports.dpToPX = function (val) {
    if (!OS_ANDROID) {
        return val;
    }
    return val * dpi / 160;
};
exports.pxToDP = function (val) {
    if (!OS_ANDROID) {
        return val;
    }
    return val / dpi * 160;
};
exports.pointPXToDP = function (pt) {
    if (!OS_ANDROID) {
        return pt;
    }
    return { x: exports.pxToDP(pt.x), y: exports.pxToDP(pt.y) };
};