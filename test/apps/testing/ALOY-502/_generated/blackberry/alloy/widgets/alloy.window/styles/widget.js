function WPATH(s) {
    var index = s.lastIndexOf("/");
    var path = -1 === index ? "alloy.window/" + s : s.substring(0, index) + "/alloy.window/" + s.substring(index + 1);
    return path;
}

module.exports = [];