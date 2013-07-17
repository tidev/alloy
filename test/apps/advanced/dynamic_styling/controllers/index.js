var views = Alloy.Collections.views;

function loadView(e) {
	var model = views.get(e.row.modelId);
	Alloy.createController('features/' + model.get('controller')).getView().open();
}

views.trigger('change');
$.index.open();