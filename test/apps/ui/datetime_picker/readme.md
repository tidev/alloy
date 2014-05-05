# Date/time Pickers

Beginning with Alloy 1.4, you can create date and time type pickers in Alloy XML. Set the `type` attribute to one of the date/time picker types. Then, supply the date in the XML or TSS as a string that can be parsed by the moment.js library.

```
<Picker id="picker" top="50"
	type="Ti.UI.PICKER_TYPE_DATE"
	value="July 4, 2013"
	minDate="2013-02-08 09:30:26 Z"
	maxDate="2015,11,17">
</Picker>
```

See http://momentjs.com/docs/ for information on the formats that moment.js can parse.