var animation = require('alloy/animation');

var input = {
	headerTitle : '', //String
	option : []
};

var layout = {
	_MAX_OPTION_NUM : 6.5,
	_BOTTOM_H : 70,
	_MARGIN : 10,
	_w : 290,
	_h : 0,
	_TITLE_H : 0,
	_TABLE_H : 0
};

var defaults = {
	view : {
	},
	title : {
		left : layout._MARGIN,
		right : layout._MARGIN
	},
	table : {
		left : layout._MARGIN,
		right : layout._MARGIN
	}
};

var main = {
	updateLayout : function(title, length) {
		layout._TITLE_H = title ? 50 : 16;
		layout._TABLE_H = Math.min(layout._MAX_OPTION_NUM, length) * 44;
		layout._h = layout._TITLE_H + layout._BOTTOM_H + layout._TABLE_H;
	}
};

/*
* Callback
* Q1 : unable to use callback.onCancelClicked
*/
// function onCancelClicked(e) {
// main.animate(0);
// $.container.visible = false;
//
// }

/*
 * Methods exported
 */
exports.init = function(params, title) {
	var max = params.length, data = [];

	main.updateLayout(title, max);
	$.container.applyProperties(_.defaults({
		width : layout._w,
		height : layout._h
	}, defaults.view));

	$.table.applyProperties(_.defaults({
		top : layout._TITLE_H,
		height : layout._TABLE_H
	}, defaults.table));

	$.title.applyProperties(_.defaults({
		text : title,
		height : layout._TITLE_H
	}, defaults.title));

	$.container.opacity = 0;

	_.each(params, function(ele, index) {
		var row = Ti.UI.createTableViewRow({
			className : "option",
			height : 44,
			backgroundColor : "#eeeeee"
		});

		var descr = Ti.UI.createLabel({
			text : ele["descr"] || '',
			height : 44,
			top : 0,
			left : 15,
			right : 10,
			font : {
				fontWeight : "bold",
				fontSize : 16
			},
			color : "#282828",
			shadowColor : "white",
			shadowOffset : {
				x : 0,
				y : 1
			}
		});

		row.add(descr);
		data.push(row);

	});

	// var t = Titanium.UI.create2DMatrix();
	// t = t.scale(0.5);
	// $.container.transform = t;

	$.table.setData(data);

	$.cancel.addEventListener("click", function(e) {
		animation.fadeOut($.container, 200);
		$.container.aState = 0;
	});

	$.table.addEventListener("click", function(e) {
		switch(e.index) {
			case 0 :
				params[0] && params[0]["cbFunc"] && params[0]["cbFunc"]();
				break;
		}
	});
};

exports.act = function(type) {
	switch(type) {
		case "hide" :
			animation.fadeOut($.container, 200);
			break;
		case "show" :
			if ($.container.aState == 0) {
				$.container.aState = 1;
				animation.popIn($.container);
			}
			break;
	}
};

/*
 * 	animate : function(iState, cbFunc) {
 iState = iState || 0;
 var t1 = Titanium.UI.create2DMatrix();
 t1 = t1.scale(0 == iState ? 0.5 : 1);
 var a = Titanium.UI.createAnimation({
 transform : t1,
 opacity : iState,
 duration : 150
 });
 a.addEventListener("complete", function() {
 if (cbFunc)
 cbFunc();
 });
 $.container.animate(a);
 },
 *
 */