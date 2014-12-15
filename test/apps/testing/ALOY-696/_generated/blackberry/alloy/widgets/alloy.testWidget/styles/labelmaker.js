function WPATH(s) {
    var index = s.lastIndexOf("/");
    var path = -1 === index ? "alloy.testWidget/" + s : s.substring(0, index) + "/alloy.testWidget/" + s.substring(index + 1);
    return path;
}

module.exports = [ {
    isApi: true,
    priority: 1000.0003,
    key: "Label",
    style: {
        top: "10dp",
        color: "#ff0",
        backgroundColor: "#000",
        font: {
            fontSize: "24dp",
            fontWeight: "bold"
        },
        height: Ti.UI.SIZE,
        width: Ti.UI.SIZE
    }
}, {
    isClass: true,
    priority: 10000.0002,
    key: "container",
    style: {
        height: Ti.UI.SIZE,
        width: Ti.UI.FILL,
        layout: "vertical"
    }
} ];