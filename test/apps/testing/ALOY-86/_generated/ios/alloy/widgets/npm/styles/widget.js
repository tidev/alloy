function WPATH(s) {
    var index = s.lastIndexOf("/");
    var path = -1 === index ? "npm/" + s : s.substring(0, index) + "/npm/" + s.substring(index + 1);
    return 0 !== path.indexOf("/") ? "/" + path : path;
}

module.exports = [ {
    isApi: true,
    priority: 1000.0002,
    key: "Label",
    style: {
        top: 20
    }
} ];