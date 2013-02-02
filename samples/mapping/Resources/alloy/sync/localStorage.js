function S4() {
    return ((1 + Math.random()) * 65536 | 0).toString(16).substring(1);
}

function guid() {
    return S4() + S4() + "-" + S4() + "-" + S4() + "-" + S4() + "-" + S4() + S4() + S4();
}

function InitAdapter(config) {
    throw "No support for localStorage persistence in non MobileWeb environments.";
}

function Sync(model, method, opts) {
    function storeModel(data) {
        localStorage.setItem(name, JSON.stringify(data));
    }
    var name = model.config.adapter.collection_name, data = model.config.data;
    switch (method) {
      case "create":
        model.id || (model.id = model.attributes.id = guid());
        data[model.id] = model;
        storeModel(data);
        break;
      case "read":
        var store = localStorage.getItem(name), store_data = store && JSON.parse(store) || {}, len = 0;
        for (var key in store_data) {
            var m = new model.config.Model(store_data[key]);
            model.models.push(m);
            len++;
        }
        model.length = len;
        model.trigger("fetch");
        break;
      case "update":
        data[model.id] = model;
        storeModel(data);
        break;
      case "delete":
        delete data[model.id];
        storeModel(data);
    }
}

var _ = require("alloy/underscore")._;

module.exports.sync = Sync;

module.exports.beforeModelCreate = function(config) {
    config = config || {};
    config.data = {};
    InitAdapter(config);
    return config;
};

module.exports.afterModelCreate = function(Model) {
    Model = Model || {};
    Model.prototype.config.Model = Model;
    return Model;
};