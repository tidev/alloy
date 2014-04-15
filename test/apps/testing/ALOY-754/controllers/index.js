function showAlert(e) {
    Ti.API.debug(JSON.stringify(Alloy.CFG, null, '\t'));
	alert('Alloy.CFG.mainConfig = ' + Alloy.CFG.mainConfig);
    alert('Alloy.CFG.bothConfig = ' + Alloy.CFG.bothConfig);
    alert('Alloy.CFG.themeConfig = ' + Alloy.CFG.themeConfig);
}
$.index.open();

// runtime unit tests
if (!ENV_PROD) {
	require('specs/index')($);
}
