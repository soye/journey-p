var map;

function initialize() {
	var mapProp = {
		center:new google.maps.LatLng(39.828127,-98.579404), 
    zoom:5, 
    mapTypeId:google.maps.MapTypeId.ROADMAP
	};

	map = new google.maps.Map(document.getElementById("googleMap"),mapProp);

	google.maps.event.addListener(map, 'click', function(event) {
		placeMarker(event.latLng);
	});
}

function placeMarker(location) {
	var marker = new google.maps.Marker({
		position: location,
		map: map
	});

  // opens the form
  $('#modal-form').foundation('reveal', 'open');

	var infowindow = new google.maps.InfoWindow({
		content: '<p>Event: </p><p>Description:</p>'
	});
	
	google.maps.event.addListener(marker, 'click', function(e) {
		infowindow.open(map,marker);
	});

	overlay();  		
}


function overlay() {
	el = document.getElementById("overlay");
	el.style.visibility = (el.style.visibility == "visible") ? "hidden" : "visible";
}	

google.maps.event.addDomListener(window, 'load', initialize);