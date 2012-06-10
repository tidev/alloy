

// attach a validation function to the model

todo._validate = function (key, value)
{
	if (key == "name")
	{
		return value.length > 0;
	}
	return true;
};

