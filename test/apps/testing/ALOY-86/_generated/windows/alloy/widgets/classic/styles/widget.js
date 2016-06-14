function WPATH(s) {
    var index = s.lastIndexOf("/");
    var path = -1 === index ? "classic/" + s : s.substring(0, index) + "/classic/" + s.substring(index + 1);
    return path;
}

module.exports = [ {
    isApi: true,
    priority: 1000.0001,
    key: "Label",
    style: {
        top: 20
    }
} ];