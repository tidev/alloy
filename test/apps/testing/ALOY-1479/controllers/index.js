function init() {
  var attributes = {
    foo: 'FOO',
    bar: 'BAR'
  };

  $.modelinstance.set(attributes);

  Alloy.Models.mymodel.set(attributes);

  Alloy.Collections.mymodel.reset([attributes]);

  $.colinstance.reset([attributes]);
}

$.index.open();

// runtime unit tests
if (!ENV_PROD) {
  $.init = init;
  require('specs/index')($);
} else {
  init();
}
