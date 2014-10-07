exports.definition = {
  config: {
    "columns" : {
      "username" : "text"
    },
    adapter: {
      type: "sql",
      collection_name: "test"
    }
  },
  extendModel: function(Model) {
    _.extend(Model.prototype, {
      // extended functions and properties go here
    });

    return Model;
  },
  extendCollection: function(Collection) {
    _.extend(Collection.prototype, {
      // extended functions and properties go here
    });

    return Collection;
  }
};