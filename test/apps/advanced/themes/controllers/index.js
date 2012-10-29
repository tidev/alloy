function updateLabel(e) {  
    $.label.text = Math.round($.slider.value) + 's';
}

function testPatience(e) {
		Alloy.createController('dialog').show($.slider.value * 1000);
}

$.index.open();
