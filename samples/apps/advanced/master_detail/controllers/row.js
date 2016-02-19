var args = arguments[0] || {};

$.row.fighterName = $.name.text = args.name;
$.nickname.text = args.nickname;

// runtime unit tests
if (!ENV_PROD) {
	require('specs/row')($, {
		name: args.name,
		nickname: args.nickname
	});
}