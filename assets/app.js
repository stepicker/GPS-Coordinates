var calculateDMS = function(val) {

    var valDeg, valMin, valSec;
    val = Math.abs(val);

    // Calculate the degrees
    valDeg = Math.floor(val);

    // Calculate the minutes
    valMin = Math.floor((val - valDeg) * 60);

    // Calculate the seconds
    valSec = Math.round((val - valDeg - valMin / 60) * 3600 * 1000) / 1000;

    return valDeg + "° " + valMin + "' " + valSec + "\"";

}

var convertToDMS = function(lat, lng) {

    var latNS, lngEW, valueDMS;
 
    lat = parseFloat(lat);  
    lng = parseFloat(lng);

    if (lat >= 0) {
        latNS = 'N ';
        } else {
        latNS = 'S ';
    }
    if (lng >= 0) {
        lngEW = 'E ';
      } else {
        lngEW = 'W ';
    }
    
    valueDMS = "Latitude: " + latNS + calculateDMS(lat) + "  |  Longitude: " + lngEW + calculateDMS(lng);
    console.log(valueDMS);
    return valueDMS;

}


var map, pos, locationInfo;

function initMap() {

    // Initialize map with view on the Eastern U.S.
    map = new google.maps.Map(document.getElementById('map'), {
        center: {lat: 35.7309, lng: -77.9872},
        streetViewControl: false,
        fullscreenControl: false,
        zoom: 5
    });

    var infoWindow = new google.maps.InfoWindow();
    var geocoder = new google.maps.Geocoder;

    // Try to geolocate the user
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {
        pos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
        };
        map.zoom = 11;
        infoWindow.setPosition(pos);
        locationInfo = convertToDMS(pos.lat, pos.lng);
        infoWindow.setContent(locationInfo);
        infoWindow.open(map);
        map.setCenter(pos);
        });
    }

    // Set up the search form with autocomplete
    var input = document.getElementById('pac-input');
    var autocomplete = new google.maps.places.Autocomplete(input);
    autocomplete.bindTo('bounds', map);
    autocomplete.setFields(['place_id', 'geometry']);

    autocomplete.addListener('place_changed', function() {

        var place = autocomplete.getPlace();

        geocoder.geocode({'placeId': place.place_id}, function(results, status) {

            if (status === 'OK') {
                if (results[0]) {
                  map.setZoom(11);
                  map.setCenter(results[0].geometry.location);
                  infoWindow = new google.maps.InfoWindow({
                    map: map,
                    position: results[0].geometry.location
                  });

                  pos = {
                    lat: results[0].geometry.location.lat(),
                    lng: results[0].geometry.location.lng()
                }
                  console.log(pos);
                  locationInfo = convertToDMS(pos.lat, pos.lng);
                  infoWindow.setContent(locationInfo);

                } else {
                  window.alert('No results found');
                }
            } else {
                window.alert('Geocoder failed due to: ' + status);
            }
        });

    });

}