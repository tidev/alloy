function WPATH(s) {
    var index = s.lastIndexOf("/");
    var path = -1 === index ? "widget1/" + s : s.substring(0, index) + "/widget1/" + s.substring(index + 1);
    return path;
}

module.exports = [];