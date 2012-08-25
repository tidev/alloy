
var books = Alloy.getCollection('Book');

var item= { //create an book and assign manually id
    author : 'Tolstoy',
    title : 'War and Peace',
    _id:'WarAndPeaceId'
};


var book = Alloy.getModel('Book',item);
books.add(book);
book.save(); //save in _defaults store only
Ti.API.info('books after add');
Ti.API.info(books.toJSON());	
book.destroy(); //remove in primary

books.reset();
books.fetch({synchronize:{
		stores : ['properties','sql'],
}});
Ti.API.info('with fecth after destroy');
Ti.API.info(books.toJSON());		



book = Alloy.getModel('Book',{author:'Tolstoy',title:'Jungle Book'});
books.add(book);
book.save(); //save in primary

books.fetch({synchronize:{
		stores : ['properties','sql'],
}});
Ti.API.info('fetch after save in primary');
Ti.API.info(books.toJSON());	


book.set('title','War and Peace');
book.save({},{ 
	synchronize:{
		stores : ['sql','properties'],
		options:{
			sameId:true, //same id attributes for stores
		}		
	}
});		

Ti.API.info('fetch after modification and save all store');
books.fetch({synchronize:{
		stores : ['properties','sql'],
}});	
Ti.API.info(books.toJSON());	

book.destroy({synchronize:{
		stores : ['properties','sql'],
}});


Ti.API.info('fetch after destroy in all store');
books.fetch({synchronize:{
		stores : ['properties','sql'],
}});	
Ti.API.info(books.toJSON());


Ti.API.info('==== BOOK2 =====');

var book2 = Alloy.getModel('Book',{_id:'kiplingID',author:'Kipling',title:'Jungle Book'});	
books.create(book2,{ //save the book2 in stores
	synchronize:{
		stores : ['properties','sql'],
		options:{
			sameId:true, //not same id attributes for stores
		}		
	}
});


books.reset();
books.fetch({synchronize:{
		stores : ['properties'],
}});
Ti.API.info('with fecth in properties store');
Ti.API.info(books.toJSON());	


 var book3 = Alloy.getModel('Book',{id:'kiplingID'});	
book3.fetch({synchronize:{
		stores : ['properties'],
}});
Ti.API.info('fetch by ID in properties store');
Ti.API.info(book3.toJSON());

book3 = Alloy.getModel('Book',{id:'kiplingID'});	
book3.fetch({synchronize:{
		stores : ['sql'],
}});
Ti.API.info('fetch by ID in sql store');
Ti.API.info(book3.toJSON());	


books.reset();
books.fetch({synchronize:{
		stores : ['properties','sql'],
}});
Ti.API.info('fetch in properties AND SQL store');
Ti.API.info(books.toJSON());	



books.reset();
books.fetch({
	filter:{
		conditions:["author = 'Kipling'"],
		operator:'',
	},		
	synchronize:{
		stores : ['sql'],
}}); //synchronize and filter sql by	
Ti.API.info('fetch filter by author in SQL store');
Ti.API.info(books.toJSON());


var bookRemove = Alloy.getModel('Book',{id:'kiplingID'});	
bookRemove.fetch({synchronize:{
		stores : ['properties','sql'],
}});	
Ti.API.info('fecth book for remove');
Ti.API.info(bookRemove.toJSON());	
bookRemove.destroy({synchronize:{
		stores : ['properties','sql'],
}});

books.reset();
books.fetch({synchronize:{
		stores : ['properties','sql'],
}});
Ti.API.info('with fecth after destroy');
Ti.API.info(books.toJSON());

Ti.API.info('==== Multi Add =====');
var book1 = Alloy.getModel('Book',{author:'Kipling',title:'Jungle Book'});	
var book2 = Alloy.getModel('Book',{author:'Tolstoy',title:'Jungle Book'});	
books.add(book1);
books.add(book2);

book1.save(); //save in primary
book2.save(); //save in primary

books.fetch({synchronize:{
		stores : ['properties','sql'],
}});
Ti.API.info('fetch multi books after save');
Ti.API.info(books.toJSON());	

book1.save({},{ 
	synchronize:{
		stores : ['sql','properties'],
		options:{
			sameId:false, //not same id attributes for stores
		}		
	}
});	
book2.save({},{ 
	synchronize:{
		stores : ['sql','properties'],
		options:{
			sameId:false, //not same id attributes for stores
		}		
	}
});	

books.fetch({synchronize:{
		stores : ['properties','sql'],
}});
Ti.API.info('fetch multi books after save in all store');
Ti.API.info(books.toJSON());	

book2.destroy({synchronize:{
		stores : ['properties','sql'],
}});
book1.destroy({synchronize:{
		stores : ['properties','sql'],
}});		


books.fetch({synchronize:{
		stores : ['properties','sql'],
}});
Ti.API.info('fetch multi books after destroy in all store');
Ti.API.info(books.toJSON());




function doClick(e) {  
    alert($.label.text);
}


$.index.open();