function WPATH(s) {
    var index = s.lastIndexOf("/");
    var path = -1 === index ? "alloy.button/" + s : s.substring(0, index) + "/alloy.button/" + s.substring(index + 1);
    return true && 0 !== path.indexOf("/") ? "/" + path : path;
}

module.exports = [];