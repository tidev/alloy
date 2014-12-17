function WPATH(s) {
    var index = s.lastIndexOf("/");
    var path = -1 === index ? "com.random.widget/" + s : s.substring(0, index) + "/com.random.widget/" + s.substring(index + 1);
    return true && 0 !== path.indexOf("/") ? "/" + path : path;
}

module.exports = [ {
    isApi: true,
    priority: 1000.0002,
    key: "Label",
    style: {
        top: "5dp",
        color: "gray",
        font: {
            fontSize: "12dp",
            fontWeight: "bold"
        },
        height: Ti.UI.SIZE,
        width: Ti.UI.SIZE,
        right: 20
    }
}, {
    isId: true,
    priority: 100000.0003,
    key: "header",
    style: {
        top: "20dp"
    }
} ];