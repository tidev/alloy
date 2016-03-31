var attributes = {
  greeting: 'hello',
  subject: 'world'
};

Alloy.Models.modelb.set({
  'mix-it': 'Mix It!',
  deep: {
    link: 'deep-link'
  }
});

Alloy.Models['model-a'].set(attributes);
Alloy.Collections['model-a'].reset([attributes]);

$.index.open();
