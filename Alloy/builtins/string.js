/** 
 * @class Alloy.builtins.string
 * A collection of utilities for manipulating strings.
 * To use the string builtin library, 
 * require it with the `alloy` root directory in your `require` call. For example:
 *
 *		var string = require('alloy/string');
 *		var text = '     hola, mundo   ';
 *		Ti.API.info(string.ucfirst(string.trim(text))); // --> 'Hola, mundo'		
 */

/**
 * @method trim
 * Removes leading and trailing white space from a string.
 * @param {String} line String to trim.
 * @return {String} String without leading and trailing white space.
 */
exports.trim = function(line) {
	return String(line).replace(/^\s\s*/, '').replace(/\s\s*$/, '');
};

/**
 * @method trimZeros
 * Removes trailing zeroes from a float value after the decimal point.
 * @param num Number to trim.
 * @return {Number} Number without trailing zeroes.
 */
exports.trimZeros = function (num) {
    var str = new String(num || '0');
    if (str.indexOf('.') == -1)
        return str;
    return str.replace(/\.?0*$/, '');
};

/**
 * @method ucfirst 
 * Capitalizes the first character in the string.
 * @param {String} text String to capitalize.
 * @return {String} String with first character capitalized.
 */
exports.ucfirst = function (text) {
    if (!text)
        return text;
    return text[0].toUpperCase() + text.substr(1);
};

/**
 * @method lcfirst
 * Lowercases the first character in the string.
 * @param {String} text String to lowercase.
 * @return {String} String with first character lowercased.
 */
exports.lcfirst = function (text) {
    if (!text)
        return text;
    return text[0].toLowerCase() + text.substr(1);
};

/**
 * @method formatCurrency  
 * Returns an amount formatted as a currency value. 
 * Uses the device settings to determine the currency symbol.
 * On the Mobile Web platform, the currency symbol will always be dollars ('$').
 * @param {String} amount Amount to format.
 * @return {String} Amount formatted as a currency value. 
 */
exports.formatCurrency = !OS_MOBILEWEB ? String.formatCurrency : function (amount) {
    var num = isNaN(amount) || amount === '' || amount === null ? 0.00 : amount;
    return '$' + parseFloat(num).toFixed(2);
};


/**
 * @method urlDecode
 * Converts URL-encoded characters in a string to ASCII characters.
 * For example, the string '%38' will return '&'.
 * @param {String} url String to process.
 * @return {String} String with URL-encoded characters replaced with ASCII characters.
 */
exports.urlDecode = function (string){
    if (!string) {
        return '';
    }
    return string.replace(/%[a-fA-F0-9]{2}/ig, function (match) {
        return String.fromCharCode(parseInt(match.replace('%', ''), 16));
    });
};

/**
 * @method urlToJson
 * Parses an URL and converts it to JSON-formatted data.
 * For example, an URL with a query string will produce a JSON object with each query field paired
 * with its value as well as the base URL.
 * @param {String} url URL to process.
 * @return {Object} JSON-formatted URL data.
 */
exports.urlToJson = function (url){
	var ret = {};
    var arr = url.split('?');
	var list = {};
    var queryarr = arr[1].split('&');
    for (var n = 0; n < queryarr.length; ++n) {
        var item = queryarr[n];
        if (item == "") { continue; }
        var e = item.indexOf('='),
        	name,
			value;
        if (e < 0) {
            name = item;
            value = null;
        } else {
            name = item.substring(0, e);
            value = item.substring(e + 1);
        }
        list[name] = value;
    }			
	ret.url = arr[0];
	ret.query = list;
	return ret;		
};
