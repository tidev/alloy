var args = arguments[0] || {};
$.id = $.row.id = args.id;
$.name.text = args.name || '<no name>';
$.score.text = args.score || 0;
