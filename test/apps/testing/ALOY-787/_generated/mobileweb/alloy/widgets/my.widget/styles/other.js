function WPATH(s) {
    var index = s.lastIndexOf("/");
    var path = -1 === index ? "my.widget/" + s : s.substring(0, index) + "/my.widget/" + s.substring(index + 1);
    return 0 !== path.indexOf("/") ? "/" + path : path;
}

module.exports = [];