var wows = require('vows'),
	assert = require('assert');
var DOMParser = require('xmldom').DOMParser;


wows.describe('errorHandle').addBatch({
  'unclosedcomment': function() {
    var parser = new DOMParser();
	assert.throws(function () {
		var doc = parser.parseFromString('<!--', 'text/xml');
	}, 'Unclosed comment');
  }
}).run();