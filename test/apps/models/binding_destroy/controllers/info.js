$.info.addEventListener('close', function() {
	// Since we are referencing a global model for our bindings,
	// make sure to call $.destroy() when you are done with the 
	// controller/window. This will ensure that no memory is 
	// leaked and that the bindings are properly released.
	$.destroy();
});

Alloy.Models.info.fetch();