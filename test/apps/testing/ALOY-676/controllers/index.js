var constants = require('alloy/constants');

$.constantsLabel.text = JSON.stringify(constants.IMPLICIT_NAMESPACES, null, '\t');

$.index.open();