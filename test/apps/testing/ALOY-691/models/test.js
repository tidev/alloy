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
  
  extendCollection: function(Collection) {
  
    _.extend(Collection.prototype, {});
  
    return Collection;
  }
};