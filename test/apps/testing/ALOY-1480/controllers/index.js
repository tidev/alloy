var attributes = {
  greeting: 'hello',
  subject: 'world'
};

Alloy.Models['model-a'].set(attributes);
Alloy.Collections['model-a'].reset([attributes]);

Alloy.Models.modelb.set({
  'mix-it': 'Mix It!'
});

$.index.open();
