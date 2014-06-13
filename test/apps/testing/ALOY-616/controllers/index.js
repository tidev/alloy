var util = require('util');
var rand = require('random')

function doClick(e) {
    alert(util.formatNumber(rand.getRandomNumber(12)));
}

function doFoo(num){
	alert('Random ' + num + '-digit rating = ' + util.formatNumber(rand.getRandomNumber(num)));
}
$.starwidget.init(doFoo);


$.index.open();
