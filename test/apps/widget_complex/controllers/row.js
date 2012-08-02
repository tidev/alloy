function postLayout(args) {
	$.thumbnail.image = args.image;
	$.title.text = args.title || '';
	$.authors.text = args.authors || '';
}