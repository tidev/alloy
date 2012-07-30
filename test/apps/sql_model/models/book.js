(function(Model) {
	Model.__validate = function (key, value)
	{
		if (key == "book")
		{
			if (value.length <= 0)
				return false;
		}
		if (key == "author")
		{
			if (value.length <= 0)
				return false;
		}	
		
		return true;
	};

	return Model;
})
