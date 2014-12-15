function WPATH(s) {
    var index = s.lastIndexOf("/");
    var path = -1 === index ? "tony.section/" + s : s.substring(0, index) + "/tony.section/" + s.substring(index + 1);
    return path;
}

module.exports = [];