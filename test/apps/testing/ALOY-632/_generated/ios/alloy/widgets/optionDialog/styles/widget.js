function WPATH(s) {
    var index = s.lastIndexOf("/");
    var path = -1 === index ? "optionDialog/" + s : s.substring(0, index) + "/optionDialog/" + s.substring(index + 1);
    return 0 !== path.indexOf("/") ? "/" + path : path;
}

module.exports = [ {
    isId: true,
    priority: 100000.0001,
    key: "theView",
    style: {
        height: 200,
        width: 200,
        backgroundColor: "#888"
    }
} ];