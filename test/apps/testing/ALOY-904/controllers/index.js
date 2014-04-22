function doFoo(num){
	Ti.API.info('Your rating = ' + num);
//	Ti.API.info("View parent: " + $.starwidget.getView().viewParent);
//	Ti.API.info("View parent's ID: " + $.getView($.starwidget.getView().viewParent).id);
}
$.starwidget.init(doFoo);

$.index.open();