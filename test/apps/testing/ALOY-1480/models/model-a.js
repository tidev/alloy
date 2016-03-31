exports.definition = {
  extendModel: function(Model) {
    _.extend(Model.prototype, {
      transform: function() {
        var transformed = this.toJSON();

        transformed.subject = transformed.subject.toUpperCase();
        transformed.font = {
          fontSize: 20,
          fontWeight: 'bold'
        };

        return transformed;
      }
    });

    return Model;
  }
};
