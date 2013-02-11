var GOOGLE_BASE_URL = 'http://maps.googleapis.com/maps/geo?output=json&q=';
var ERROR_MESSAGE = 'There was an error geocoding. Please try again.';

var GeoData = function(title, latitude, longitude) {
	this.title = title;
	this.coords = {
		latitude: latitude,
		longitude: longitude
	};
};

exports.forwardGeocode = function(address, callback) {
	if (Ti.Platform.osname === 'mobileweb') {
		forwardGeocodeWeb(address, callback);
	} else {
		forwardGeocodeNative(address, callback);
	}
};

var forwardGeocodeNative = function(address, callback) {
	var xhr = Titanium.Network.createHTTPClient();
	xhr.open('GET', GOOGLE_BASE_URL + address);
	xhr.onload = function() {
	    var json = JSON.parse(this.responseText);
	    if (!json.Placemark || !json.Placemark[0].Point || !json.Placemark[0].Point.coordinates) {
	    	alert('Unable to geocode the address');
	    	return;
	    }
	    
	    callback(new GeoData(
	    	address,
	    	json.Placemark[0].Point.coordinates[1],
	    	json.Placemark[0].Point.coordinates[0]
	    ));
	};
	xhr.onerror = function(e) {
		Ti.API.error(e.error);
		alert(ERROR_MESSAGE);
	};
	xhr.send();
};

var forwardGeocodeWeb = function(address, callback) {
	var geocoder = new google.maps.Geocoder();
	if (geocoder) {
      	geocoder.geocode({ 'address': address }, function (results, status) {
        	if (status == google.maps.GeocoderStatus.OK) {
        		callback(new GeoData(
        			address, 
        			results[0].geometry.location.lat(),
        			results[0].geometry.location.lng()
        		));
         	} else {
         		Ti.API.error(status);
         		alert(ERROR_MESSAGE); 	
         	}
      	});
	} else {
		alert('Google Maps Geocoder not supported');	
	}
};
