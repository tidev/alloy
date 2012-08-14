var args = arguments[0] || {};
$.getView('thumbnail').image = args.image;
$.getView('title').text = args.title || '';
$.getView('authors').text = args.authors || '';