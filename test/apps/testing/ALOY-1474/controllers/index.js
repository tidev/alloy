Alloy.Models.transformless.set({
  foo: 'FOO',
  bar: 'BAR'
});

Alloy.Models.transformer.set({
  foo: 'FOO',
  bar: 'BAR'
});

Alloy.Collections.transformless.reset([{
  foo: '1 FOO',
  bar: '1 BAR'
}, {
  foo: '2 FOO',
  bar: '2 BAR'
}]);

Alloy.Collections.transformer.reset([{
  foo: '1 FOO',
  bar: '1 BAR'
}, {
  foo: '2 FOO',
  bar: '2 BAR'
}]);

$.index.open();

function myTransformer(model) {
  var transformed = model.toJSON();

  transformed.foo = transformed.foo + 'D';
  transformed.bar = transformed.bar + 'T';

  return transformed;
}
