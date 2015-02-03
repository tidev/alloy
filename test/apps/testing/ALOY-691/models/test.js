exports.definition = {

  configuration : {
    "columns": {
      "username":"string"
    },
    "adapter": {
      "type": "sql",
      "collection_name": "test"
    },
  },

  extendModel: function(Model) {

    _.extend(Model.prototype, {});

    return Model;
  },

  extendCollection : function(Collection) {
    _.extend(Collection.prototype, {

      // For Backbone v1.1.2, uncomment this to override the fetch method
      /*
      fetch: function(options) {
        options = options ? _.clone(options) : {};
        options.reset = true;
        return Backbone.Collection.prototype.fetch.call(this, options);
      },
      */
    });
    return Collection;
  }
};
