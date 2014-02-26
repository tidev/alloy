exports.definition = {

    config : {
        "columns" : {
            "name" : "text",
            "status" : "integer"
        },
        "defaults" : {
            "name" : "",
            "captured" : 0
        },
        "adapter" : {
            "type" : "sql",
            "collection_name" : "heroes"
        }
    },

    extendModel : function(Model) {
        _.extend(Model.prototype, {

        });
        // end extend

        return Model;
    },

    extendCollection : function(Collection) {
        _.extend(Collection.prototype, {

        });
        // end extend

        return Collection;
    }
};