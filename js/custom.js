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

var currentMarker;

function placeMarker(location) {
	var marker = new google.maps.Marker({
		position: location,
		map: map
	});
	currentMarker = marker;

	// opens the form
	$('#form').trigger("reset");
	$('#modal-form').foundation('reveal', 'open');

	overlay();  		
}

function postEntry() {
	$('#modal-form').foundation('reveal', 'close');

  infowindow = new google.maps.InfoWindow({
    content: '<h4>' + $("#event-name").val() + '</h4>' +
    		'<p><b>Year:</b> ' + $("#year").val() + '</p>' +
    		'<p>' + $("#details").val() + '</p>'
  });

  thisMarker = currentMarker;
  google.maps.event.addListener(thisMarker, 'click', function(e) {
	infowindow.open(map, thisMarker);
  });
}


function overlay() {
	el = document.getElementById("overlay");
	el.style.visibility = (el.style.visibility == "visible") ? "hidden" : "visible";
}	

google.maps.event.addDomListener(window, 'load', initialize);