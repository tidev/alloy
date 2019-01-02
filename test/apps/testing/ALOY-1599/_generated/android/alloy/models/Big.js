var Alloy = require('/alloy'),
    _ = require("/alloy/underscore")._,
    model,
    collection;

exports.definition = {
	config: {

		adapter: {
			type: "properties",
			collection_name: "Big"
		}
	},
	extendModel: function (Model) {
		_.extend(Model.prototype, {});

		return Model;
	},
	extendCollection: function (Collection) {
		_.extend(Collection.prototype, {});

		return Collection;
	}
};

model = Alloy.M('Big', exports.definition, []);

collection = Alloy.C('Big', exports.definition, model);

exports.Model = model;
exports.Collection = collection;