var map = null;
var openInfoWindow = null;
var currentLocation = null;


function initialize() {
	var mapProp = {
		center:new google.maps.LatLng(39.828127,-98.579404), 
    	zoom: 5, 
    	mapTypeId:google.maps.MapTypeId.ROADMAP
	};

	map = new google.maps.Map(document.getElementById("googleMap"),mapProp);

	google.maps.event.addListener(map, 'click', function(event) {
		if (openInfoWindow) 
			openInfoWindow.close();
		placeMarker(event.latLng);
	});

}

function placeMarker(location) {
	// opens the form
	$('#form').trigger("reset");
	$('#modal-form').foundation('reveal', 'open');

	currentLocation = location;		
}

function postEntry() {
	$('#modal-form').foundation('reveal', 'close');

	var infowindow = new google.maps.InfoWindow({
	content: '<h4>' + $("#event-name").val() + '</h4>' +
			'<p><b>Year:</b> ' + $("#year").val() + '</p>' +
			'<p>' + $("#details").val() + '</p>'
	});

	var marker = new google.maps.Marker({
		position: currentLocation,
		map: map
	});

	google.maps.event.addListener(marker, 'click', function(e) {
		if (openInfoWindow)
			openInfoWindow.close();
		infowindow.open(map, marker);
		openInfoWindow = infowindow;
	});
}

google.maps.event.addDomListener(window, 'load', initialize);