function WPATH(s) {
    var index = s.lastIndexOf("/");
    var path = -1 === index ? "foo/" + s : s.substring(0, index) + "/foo/" + s.substring(index + 1);
    return path;
}

module.exports = [];