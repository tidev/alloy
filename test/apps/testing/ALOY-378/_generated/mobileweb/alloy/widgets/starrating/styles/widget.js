function WPATH(s) {
    var index = s.lastIndexOf("/");
    var path = -1 === index ? "starrating/" + s : s.substring(0, index) + "/starrating/" + s.substring(index + 1);
    return path;
}

module.exports = [ {
    isApi: true,
    priority: 1000.0001,
    key: "TableViewRow",
    style: {
        color: "black",
        height: "50dp"
    }
}, {
    isApi: true,
    priority: 1000.9001999999999,
    key: "TableViewRow",
    style: {
        color: "blue"
    }
}, {
    isId: true,
    priority: 100000.0004,
    key: "starrating",
    style: {
        layout: "horizontal",
        width: Ti.UI.SIZE,
        backgroundColor: "transparent"
    }
} ];