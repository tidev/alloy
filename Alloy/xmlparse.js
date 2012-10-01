var XMLSerializer = require("xmldom").XMLSerializer,
	DOMParser = require("xmldom").DOMParser;

var filename = process.argv[2];
var doc = new DOMParser().parseFromString(string);
console.log(filename);