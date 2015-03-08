var map = null;
var numChapter = 0;
var openInfoWindow = null;
var currentLocation = null;
var lastMarker = null;
var allEvents = [];
var allLines = [];
var placeMarkerListener = null;


function initialize() {
	var mapProp = {
		center:new google.maps.LatLng(39.828127,-98.579404), 
    	zoom: 5, 
    	mapTypeId:google.maps.MapTypeId.ROADMAP
	};

	map = new google.maps.Map(document.getElementById("googleMap"), mapProp);

	placeMarkerListener = google.maps.event.addListener(map, 'click', function(event) {
		if (openInfoWindow) 
			openInfoWindow.close();
		placeMarker(event.latLng);
	});

	// sets style of map
	var styles = [
	  {
	    stylers: [
	      { hue: "" },
	      { saturation: 10 }
	    ]
	  },{
	    featureType: "road",
	    elementType: "geometry",
	    stylers: [
	      { lightness: 100 },
	      { visibility: "simplified" }
	    ]
	  },{
	    featureType: "road",
	    elementType: "labels",
	    stylers: [
	      { visibility: "off" }
	    ]
	  }
	];
	map.setOptions({styles: styles});

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

	var event_entry = {
		year: $("#year").val(),
		info: infowindow,
		marker: marker
	};

	// new entry is added to all events, array is sorted and lines are redrawn
	allEvents[allEvents.length] = event_entry;
	allEvents.sort(function(a, b) {
		var dateA = new Date(a.year);
		var dateB = new Date(b.year);
		return dateA - dateB;
	});
	redrawLines();

	google.maps.event.addListener(marker, 'click', function(e) {
		if (openInfoWindow)
			openInfoWindow.close();
		infowindow.open(map, marker);
		openInfoWindow = infowindow;
	});
}

function redrawLines() {
	removeAllLines();

	for (var index = 1; index < allEvents.length; index++)
		createDashedLine(allEvents[index - 1].marker.getPosition(), allEvents[index].marker.getPosition());
}

function removeAllLines() {
	for (var i = 0; i < allLines.length; i++)
		allLines[i].setMap(null);
}

function createDashedLine(fromPos, toPos) {
	var lineSymbol = {
		path: 'M 0,-1 0,1',
		strokeOpacity: 1,
		scale: 4
	};

	var lineCoordinates = [
		fromPos,
		toPos
	];

	// Create the polyline, passing the symbol in the 'icons' property.
	// Give the line an opacity of 0.
	// Repeat the symbol at intervals of 20 pixels to create the dashed effect.
	var line = new google.maps.Polyline({
		geodesic: true,
		path: lineCoordinates,
		strokeOpacity: 0,
		icons: [{
		  icon: lineSymbol,
		  offset: '0',
		  repeat: '20px'
		}],
		map: map
	});

	allLines[allLines.length] = line;

}

/* showAll()
 * ---------
 * Zoom out the map such that all markers are shown. */
function showAll() {
	if (allEvents.length > 0) {
		bounds = new google.maps.LatLngBounds();
		for (var i = 0, len = allEvents.length; i < len; i++)
			bounds.extend(allEvents[i].marker.getPosition());
		map.fitBounds(bounds);
	}
}

/* startJourney()
 * --------------
 * Commence animation through entire journey. */
function startJourney() {
	if (allEvents.length < 1) 
		return;

	google.maps.event.removeListener(placeMarkerListener);
	removeAllLines();
	$("#btnStartJourney").attr("disabled", "disabled");
	$("#btnExitJourney").removeAttr("disabled");
	numChapter = 0;

	focusOnChapter(numChapter);
	numChapter++;

	$("#googleMap").click(function(e) {
		if (numChapter > 0) {
			createDashedLine(allEvents[numChapter - 1].marker.getPosition(), allEvents[numChapter].marker.getPosition());
			bounds = new google.maps.LatLngBounds();
			bounds.extend(allEvents[numChapter].marker.getPosition());
			bounds.extend(allEvents[numChapter - 1].marker.getPosition());
			map.fitBounds(bounds);
		}

		focusOnChapter(numChapter);

		numChapter++;
		if (numChapter >= allEvents.length)
			endJourney();
	});
}

function endJourney() {
	redrawLines();
	placeMarkerListener = google.maps.event.addListener(map, 'click', function(event) {
		if (openInfoWindow) 
			openInfoWindow.close();
		placeMarker(event.latLng);
	});

	$("#googleMap").off("click");
	$("#btnStartJourney").removeAttr("disabled");
	$("#btnExitJourney").attr("disabled", "disabled");
}

function focusOnChapter(index) {
	map.setCenter(allEvents[index].marker.getPosition());
}

google.maps.event.addDomListener(window, 'load', initialize);