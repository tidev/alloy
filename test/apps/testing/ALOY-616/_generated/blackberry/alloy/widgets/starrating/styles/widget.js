function WPATH(s) {
    var index = s.lastIndexOf("/");
    var path = -1 === index ? "starrating/" + s : s.substring(0, index) + "/starrating/" + s.substring(index + 1);
    return path;
}

module.exports = [ {
    isId: true,
    priority: 100000.0003,
    key: "starrating",
    style: {
        layout: "horizontal",
        width: Ti.UI.SIZE,
        backgroundColor: "transparent"
    }
} ];