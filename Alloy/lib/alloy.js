
module.exports.$ = require("alloy/sizzle");
module.exports._ = require("alloy/underscore");


//
//TODO: we need to check for db and migrations and then do the migrations if necessary (optimize if no models);
//TODO: we need to implement sizzle if we want a selector
//TODO: do we really need backbone for the models or maybe we can just plug the models into our model code?