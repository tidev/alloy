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

exports.formatCurrency = function (amount) {
    if (exports.mobileweb) {
        var num = isNaN(amount) || amount === '' || amount === null ? 0.00 : amount;
        return '$' + parseFloat(num).toFixed(2);
    }
    return String.formatCurrency(amount);
};
