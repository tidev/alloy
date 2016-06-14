var moment = require('alloy/moment');
var langs = [
	'en', // default
	'es', // added automatically since it's in the "i18n" project folder
	'de', // added via require() below
	'fr'  // added via require() below
];
var langIndex = 0;

// If you plan to use a particular language in your app that is _not_
// specified in your project's "i18n" folder, you need to explicitly
// require() it in your code and Alloy's builtin system will pull in the
// necessary files to use it. It needs to be an explicit string, you cannot
// assemble it with variables. In other words,
//
// do this:  require('alloy/moment/lang/es');
// NOT this: require('alloy/moment/lang/' + locale);
require('alloy/moment/lang/de');
require('alloy/moment/lang/fr');

function changeLanguage() {
	var lang = langs[langIndex++];
	moment.locale(lang);
	$.language.text = 'language: ' + lang;

	if (langIndex >= langs.length) { langIndex = 0; }
}

function updateDate() {
	$.theDate.text = moment().format('MMMM Do YYYY, h:mm:ss a');
}

// Set the initial formatted date and update (about) every half second to
// account for the inconsistency of javascript's timing.
changeLanguage();
updateDate();
setInterval(updateDate, 500);

$.index.open();
