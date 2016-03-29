exports.definition = {
  extendModel: function(Model) {
    _.extend(Model.prototype, {
      transform: function() {
        var transformed = this.toJSON();

        transformed.foo = transformed.foo + 'D!';
        transformed.bar = transformed.bar + 'T!';

        return transformed;
      }
    });

    return Model;
  }
};
