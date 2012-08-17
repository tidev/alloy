/**
 * A collection of string utilities
 */

exports.trim = function(line) {
	return String(line).replace(/^\s\s*/, '').replace(/\s\s*$/, '');
};

exports.trimZeros = function (num) {
    var str = new String(num || '0');
    if (str.indexOf('.') == -1)
        return str;
    return str.replace(/\.?0*$/, '');
};

exports.ucfirst = function (text) {
    if (!text)
        return text;
    return text[0].toUpperCase() + text.substr(1);
};

exports.lcfirst = function (text) {
    if (!text)
        return text;
    return text[0].toLowerCase() + text.substr(1);
};

exports.formatCurrency = !OS_MOBILEWEB ? String.formatCurrency : function (amount) {
    var num = isNaN(amount) || amount === '' || amount === null ? 0.00 : amount;
    return '$' + parseFloat(num).toFixed(2);
};

exports.urlDecode = function (string){
    if (!string) {
        return '';
    }
    return string.replace(/%[a-fA-F0-9]{2}/ig, function (match) {
        return String.fromCharCode(parseInt(match.replace('%', ''), 16));
    });
};

exports.urlToJson = function (url){
    var list = {};
    var urlarr = url.split('&');
    for (var n = 0; n < urlarr.length; ++n) {
        var item = urlarr[n];
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
	return list;		
};