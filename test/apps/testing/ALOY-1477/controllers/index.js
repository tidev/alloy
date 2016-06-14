Alloy.Models.mymodel.set({
  id: 0,
  title: 'mod TITLE'
});

Alloy.Collections.mymodel.reset([{
  id: 0,
  title: 'col TITLE'
}]);

$.index.open();

function createModel() {
  Alloy.Collections.mymodel.create({
    title: 'crt TITLE'
  });
}

// runtime unit tests
if (!ENV_PROD) {
  $.createModel = createModel;
	require('specs/index')($);
}
