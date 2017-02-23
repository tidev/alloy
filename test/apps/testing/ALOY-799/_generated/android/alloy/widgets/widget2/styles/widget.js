function WPATH(s) {
    var index = s.lastIndexOf("/");
    var path = -1 === index ? "widget2/" + s : s.substring(0, index) + "/widget2/" + s.substring(index + 1);
    return 0 !== path.indexOf("/") ? "/" + path : path;
}

module.exports = [];