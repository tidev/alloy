function WPATH(s) {
    var index = s.lastIndexOf("/");
    var path = -1 === index ? "com.test.hellobutton/" + s : s.substring(0, index) + "/com.test.hellobutton/" + s.substring(index + 1);
    return 0 !== path.indexOf("/") ? "/" + path : path;
}

module.exports = [ {
    isId: true,
    priority: 100000.0002,
    key: "helloButton",
    style: {
        backgroundImage: WPATH("hello.png"),
        height: 135,
        width: 233
    }
} ];