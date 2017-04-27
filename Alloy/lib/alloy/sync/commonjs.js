var _ = require('alloy/underscore')._;

function Sync(method, model, opts) {

	if ("read" === method) {
		_.isFunction(opts.success) && opts.success(require(model.config.adapter.collection_name));
		model.trigger("fetch");

	} else {
		throw "The CommonJS sync adapter is read-only.";
	}
}

module.exports.sync = Sync;
