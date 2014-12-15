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
    isClass: true,
    priority: 10000.0002,
    key: "star",
    style: {
        height: "24dp",
        width: "24dp",
        left: "5dp"
    }
}, {
    isClass: true,
    priority: 10000.9003,
    key: "star",
    style: {
        height: "32dp",
        width: "10dp",
        left: "8dp"
    }
}, {
    isClass: true,
    priority: 10100.9004,
    key: "star",
    style: {
        backgroundColor: "#ffffcc"
    }
} ];