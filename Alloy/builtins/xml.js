/**
 * @class Alloy.builtins.xml
 * A collection of useful XML utilities. To use the animation builtin library,
 * all you need to do is require it with the `alloy` root directory in your
 * `require` call. For example:
 *
 *     var xml = require('alloy/xml');
 *     xml.toJSON(xmlstring);
 */

/*
 * The method toJSON() is based on jQuery XML to JSON Plugin v1.1
 * by http://www.fyneworks.com/ - diego@fyneworks.com
 * Dual licensed under the MIT and GPL licenses:
 *   http://www.opensource.org/licenses/mit-license.php
 *   http://www.gnu.org/licenses/gpl.html
 * Website: http://www.fyneworks.com/jquery/xml-to-json/
 *
 * INSPIRED BY: http://www.terracoder.com/
 * AND: http://www.thomasfrank.se/xml_to_json.html
 * AND: http://www.kawa.net/works/js/xml/objtree-e.html
*/

/**
 * @method toJSON
 * Converts an XML string or Ti.XML.Document object into a JSON object.
 * @param {String/Ti.XML.Document} xml The XML to convert
 * @param {Boolean} extended Activate the extended parsing mode
 * @return {Object} JSON representation of the XML document
 */
exports.toJSON = function(xml, extended) {
    if (!xml)
        return {};
    // quick fail

    //### PARSER LIBRARY
    // Core function
    function parseXML(node, simple) {
        if (!node)
            return null;
        var txt = '', obj = null, att = null;
        var nt = node.nodeType;
        var nv = node.textContent || node.nodeValue || '';

        if (node.childNodes) {
            if (node.childNodes.length > 0) {
                for (var ii=0; ii<node.childNodes.length; ii++) {
                    var cn = node.childNodes.item(ii);
                    var cnt = cn.nodeType, cnn = jsVar(cn.localName || cn.nodeName);
                    var cnv = cn.textContent || cn.nodeValue || '';

                    if (cnt == 8) {
                        continue;
                    } else if (cnt == 3 || cnt == 4 || !cnn) {
                        // ignore white-space in between tags
                        if (cnv.match(/^\s+$/)) {
                            continue;
                        };
                        txt += cnv.replace(/^\s+/, '').replace(/\s+$/, '');
                        // make sure we ditch trailing spaces from markup
                    } else {
                        obj = obj || {};
                        if (obj[cnn]) {
                            // http://forum.jquery.com/topic/jquery-jquery-xml2json-problems-when-siblings-of-the-same-tagname-only-have-a-textnode-as-a-child
                            if (!obj[cnn].length)
                                obj[cnn] = myArr(obj[cnn]);
                            obj[cnn] = myArr(obj[cnn]);

                            obj[cnn][obj[cnn].length] = parseXML(cn, true/* simple */);
                            obj[cnn].length = obj[cnn].length;
                        } else {
                            obj[cnn] = parseXML(cn);
                        };
                    }
                    ;
                };
            };//node.childNodes.length>0
        };//node.childNodes
        if (node.attributes) {
            if (node.attributes.length > 0) {
                att = {};
                obj = obj || {};
                for (var aa=0; aa<node.attributes.length; aa++) {
                    var at = node.attributes.item(aa);
                    var atn = jsVar(at.name), atv = at.value;
                    att[atn] = atv;
                    if (obj[atn]) {

                        // http://forum.jquery.com/topic/jquery-jquery-xml2json-problems-when-siblings-of-the-same-tagname-only-have-a-textnode-as-a-child
                        obj[cnn] = myArr(obj[cnn]);

                        obj[atn][obj[atn].length] = atv;
                        obj[atn].length = obj[atn].length;
                    } else {
                        /*DBG*/ //if(window.console) console.log(['x2j',nn,'attr>',atn,'TEXT']);
                        obj[atn] = atv;
                    };
                };
                //obj['attributes'] = att;
            };//node.attributes.length>0
        };//node.attributes
        if (obj) {
            obj = _.extend((txt != '' ? new String(txt) : {}), /* {text:txt},*/obj || {}/*, att || {}*/);
            txt = (obj.text) ? ( typeof (obj.text) == 'object' ? obj.text : [obj.text || '']).concat([txt]) : txt;
            if (txt)
                obj.text = txt;
            txt = '';
        };
        var out = obj || txt;
        if (extended) {
            if (txt)
                out = {};
            //new String(out);
            txt = out.text || txt || '';
            if (txt)
                out.text = txt;
            if (!simple)
                out = myArr(out);
        };
        return out;
    };// parseXML
    // Core Function End
    // Utility functions
    var jsVar = function(s) {
        return String(s || '').replace(/-/g, "_");
    };

    // NEW isNum function: 01/09/2010
    // Thanks to Emile Grau, GigaTecnologies S.L., www.gigatransfer.com, www.mygigamail.com
    function isNum(s) {
        // based on utility function isNum from xml2json plugin (http://www.fyneworks.com/ - diego@fyneworks.com)
        // few bugs corrected from original function :
        // - syntax error : regexp.test(string) instead of string.test(reg)
        // - regexp modified to accept  comma as decimal mark (latin syntax : 25,24 )
        // - regexp modified to reject if no number before decimal mark  : ".7" is not accepted
        // - string is "trimmed", allowing to accept space at the beginning and end of string
        var regexp = /^((-)?([0-9]+)(([\.\,]{0,1})([0-9]+))?$)/
        return ( typeof s == "number") || regexp.test(String((s && typeof s == "string") ? jQuery.trim(s) : ''));
    };
    // OLD isNum function: (for reference only)
    //var isNum = function(s){ return (typeof s == "number") || String((s && typeof s == "string") ? s : '').test(/^((-)?([0-9]*)((\.{0,1})([0-9]+))?$)/); };

    var myArr = function(o) {

        // http://forum.jquery.com/topic/jquery-jquery-xml2json-problems-when-siblings-of-the-same-tagname-only-have-a-textnode-as-a-child
        //if(!o.length) o = [ o ]; o.length=o.length;
        if (!_.isArray(o))
            o = [o];
        o.length = o.length;

        // here is where you can attach additional functionality, such as searching and sorting...
        return o;
    };
    // Utility functions End
    //### PARSER LIBRARY END

    // Convert plain text to xml
    if ( typeof xml == 'string')
        xml = Ti.XML.parseString(xml);

    // Quick fail if not xml (or if this is a node)
    if (!xml.nodeType)
        return null;
    if (xml.nodeType == 3 || xml.nodeType == 4)
        return xml.nodeValue;

    // Find xml root node
    var root = (xml.nodeType == 9) ? xml.documentElement : xml;

    var nn = jsVar(root.localName || root.nodeName);
    var out = {};

    // Convert xml to json
    out[nn] = parseXML(root, true /* simple */);

    // Clean-up memory
    xml = null;
    root = null;

    // Send output
    return out;
};
