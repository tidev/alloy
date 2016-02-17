function WPATH(s) {
    var index = s.lastIndexOf("/");
    var path = -1 === index ? "classic/" + s : s.substring(0, index) + "/classic/" + s.substring(index + 1);
    return true && 0 !== path.indexOf("/") ? "/" + path : path;
}

module.exports = [ {
    isApi: true,
    priority: 1000.0002,
    key: "Label",
    style: {
        top: 20
    }
} ];