var geocoder = null;
var map = null;
var numChapter = 0;
var openInfoWindow = null;
var currentLocation = null;
var lastMarker = null;
var allEvents = [];
var allLines = [];
var placeMarkerListener = null;
var askMeLines = ["Tell me about the first time you met your current spouse.",
	"Tell me about your first full-time job.", "Tell me about the first time you went on an airplane.",
	"Tell me about one of your favorite childhood memories.", "Tell me about the first date you ever went on."];


function initialize() {
	geocoder = new google.maps.Geocoder();

	var mapProp = {
		center:new google.maps.LatLng(39.828127,-98.579404), 
    	zoom: 5, 
    	mapTypeId:google.maps.MapTypeId.ROADMAP
	};

	map = new google.maps.Map(document.getElementById("googleMap"), mapProp);

	placeMarkerListener = google.maps.event.addListener(map, 'click', function(event) {
		closeOpenInfoWindow();
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

	// close focus on chapter
	$("#modal-chapter .close-reveal-modal").click(function(e) {
		$('#modal-chapter').foundation('reveal', 'close');
	});

	mockUp();
}

/* mockUp() 
 * --------
 * Artificial data for testing purposes. */
function mockUp() {
	// custom markers
	var imgStroller = {
	    url: 'img/stroller_30x30.png',
		size: new google.maps.Size(30, 27),
		// The origin for this image is 0,0.
		origin: new google.maps.Point(0,0),
		// The anchor for this image is the base of the flagpole at 0,32.
		anchor: new google.maps.Point(15, 27)
	};

	var shapeStroller = {
		coords: [0, 7, 6, 10, 17, 10, 16, 0, 23, 0, 29, 5, 29, 19, 25, 26, 7, 26, 5, 17, 4, 13, 0, 9],
		type: 'poly'
	};

	var imgHome = {
	    url: 'img/home_30x26.png',
		size: new google.maps.Size(30, 26),
		origin: new google.maps.Point(0,0),
		anchor: new google.maps.Point(15, 26)
	};

	var shapeHome = {
		coords: [0, 13, 15, 0, 24, 3, 29, 12, 26, 25, 2, 25, 3, 15], 
		type: 'poly'
	};


	// chapter 1
	var infowindow = new google.maps.InfoWindow({
	content: '<h4>Born in the Bay Area</h4>' +
			'<p><b>Year: 1932</b></p>' +
			'<p>I was born in the lovely town of Santa Clara in 1932. ' +
			'I lived in a large house with my parents and my three older sisters.</p>'
	});

	var marker = new google.maps.Marker({
		position: new google.maps.LatLng(37.35263822194673, -121.96969985961914),
		map: map, 
		icon: imgStroller,
		shape: shapeStroller
	});

	var event_entry = {
		year: "1932",
		details: 'I was born in the lovely town of Santa Clara in 1932. ' +
			'I lived in a large house with my parents and my three older sisters.',
		title: "Born in the Bay Area",
		infowindow: infowindow,
		marker: marker
	};

	// new entry is added to all events, array is sorted and lines are redrawn
	allEvents[allEvents.length] = event_entry;
	allEvents.sort(function(a, b) {
		var dateA = new Date(a.year);
		var dateB = new Date(b.year);
		return dateA - dateB;
	});
	redrawAllLines();

	google.maps.event.addListener(marker, 'click', function(e) {
		closeOpenInfoWindow();
		numChapter = getIndex(marker);
		focusOnChapter(getIndex(marker));
	});

	google.maps.event.addListener(marker, 'mouseover', function(e) {
		closeOpenInfoWindow();
		numChapter = getIndex(marker);
		focusOnChapter(getIndex(marker));
	});


	// chapter 2
	var infowindow2 = new google.maps.InfoWindow({
		content: '<h4>Moved to Our Current Home in Austin</h4>' +
			'<p><b>Year: 1980</b></p>' +
			'<p>Jim and I moved to Austin in 1980 to be closer to our children. ' +
			'Believe it or not, we really enjoy attending the music festivals every year!</p>'
	});

	var marker2 = new google.maps.Marker({
		position: new google.maps.LatLng(30.26729082565207, -97.646484375),
		map: map, 
		icon: imgHome,
		shape: shapeHome
	});

	var event_entry2 = {
		year: "1980",
		details: 'Jim and I moved to Austin in 1980 to be closer to our children. ' +
			'Believe it or not, we really enjoy attending the music festivals every year!',
		title: "Moved to Our Current Home in Austin",
		infowindow: infowindow2,
		marker: marker2
	};

	// new entry is added to all events, array is sorted and lines are redrawn
	allEvents[allEvents.length] = event_entry2;
	allEvents.sort(function(a, b) {
		var dateA = new Date(a.year);
		var dateB = new Date(b.year);
		return dateA - dateB;
	});
	redrawAllLines();

	google.maps.event.addListener(marker2, 'click', function(e) {
		closeOpenInfoWindow();
		numChapter = getIndex(marker2);
		focusOnChapter(getIndex(marker2));
	});

	google.maps.event.addListener(marker2, 'mouseover', function(e) {
		focusOnChapter(getIndex(marker2));
	});
}

function placeMarker(location) {
	// opens the form
	$('#form').trigger("reset");
	$("#location-field").attr("style", "display:none");
	$('#modal-form').foundation('reveal', 'open');

	currentLocation = location;		
}

function codeAddress() {
  var address = $("#location").val();
  console.log($("#location").val());
  geocoder.geocode( { 'address': address}, function(results, status) {
    if (status == google.maps.GeocoderStatus.OK) {
      currentLocation = results[0].geometry.location;
      console.log("location = " + results[0].geometry.location.toString());
      processEntry();
    } else {
      alert('Geocode was not successful for the following reason: ' + status);
    }
  });
}

/* processEntry()
 * --------------
 * Takes the values from the form, and creates a marker and an infowindow. */
function processEntry() {
	var infowindow = new google.maps.InfoWindow({
	content: '<h4>' + $("#event-name").val() + '</h4>' +
			'<p><b>Year:</b> ' + $("#year").val() + '</p>' +
			'<p>' + $("#details").val() + '</p>'
	});

	var imgMarker = {
	    url: 'img/poi_19x30.png',
		size: new google.maps.Size(19, 30),
		origin: new google.maps.Point(0,0),
		anchor: new google.maps.Point(10, 30)
	};

	var shapeMarker = {
		coords: [0, 6, 6, 0, 13, 0, 18, 6, 18, 13, 9, 29, 0, 13],
		type: 'poly'
	};

	var marker = new google.maps.Marker({
		position: currentLocation,
		map: map, 
		icon: imgMarker, 
		shape: shapeMarker
	});

	var event_entry = {
		year: $("#year").val(),
		details: $("#details").val(),
		title: $("#event-name").val(),
		infowindow: infowindow,
		marker: marker
	};

	// new entry is added to all events, array is sorted and lines are redrawn
	allEvents[allEvents.length] = event_entry;
	allEvents.sort(function(a, b) {
		var dateA = new Date(a.year);
		var dateB = new Date(b.year);
		return dateA - dateB;
	});
	redrawAllLines();

	google.maps.event.addListener(marker, 'click', function(e) {
		closeOpenInfoWindow();
		numChapter = getIndex(marker);
		focusOnChapter(numChapter);
	});

	google.maps.event.addListener(marker, 'mouseover', function(e) {
		focusOnChapter(getIndex(marker));
	});
}

function getIndex(marker) {
	for (var i = 0; i < allEvents.length; i++) {
		if (allEvents[i].marker == marker)
			return i;
	}
}

/* postEntry()
 * -----------
 * Processes the filled out form. If location is filled in, 
 * then geocoder request is sent before processing the entry. */
function postEntry() {
	$('#modal-form').foundation('reveal', 'close');

	if ($("#location").val().length > 0)
		codeAddress();
	else
		processEntry();
}

function redrawAllLines() {
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

	$("a").click(function(e) {
		e.stopPropagation();
	});

	removeAllLines();
	numChapter = 0;

	focusOnChapter(numChapter);

	if (allEvents.length > 1) {
		$("#googleMap").click(function(e) {
			if (e.target.nodeName.toUpperCase() == "A" || e.target.nodeName.toUpperCase() == "BUTTON")
				return;
			moveToNextChapter();
		});
	}
}

function moveToNextChapterFromModal() {
	closeOpenInfoWindow();
	$('#modal-chapter').foundation('reveal', 'close');
	window.setTimeout(moveToNextChapter(), 2000);
}

function moveToNextChapter() {
	numChapter++;

	if (numChapter > 0) {
		createDashedLine(allEvents[numChapter - 1].marker.getPosition(), allEvents[numChapter].marker.getPosition());
		bounds = new google.maps.LatLngBounds();
		bounds.extend(allEvents[numChapter].marker.getPosition());
		bounds.extend(allEvents[numChapter - 1].marker.getPosition());
		map.fitBounds(bounds);
	}

	focusOnChapter(numChapter);
}

/* closeOpenInfoWindow()
 * ---------------------
 * If an infowindow is open, close it. */
 function closeOpenInfoWindow() {
 	if (openInfoWindow) {
		openInfoWindow.close();
		openInfoWindow = null;
	}
 }

/* endJourney()
 * ------------
 * Returns user to editing mode. */
function endJourney() {
	redrawAllLines();
	placeMarkerListener = google.maps.event.addListener(map, 'click', function(event) {
		closeOpenInfoWindow();
		placeMarker(event.latLng);
	});
}

function openShortInfoWindow(chapter) {
	closeOpenInfoWindow();
	numChapter = getIndex(chapter.marker);

	var shortContent = chapter.details;
	if (shortContent.length > 50)
		shortContent = shortContent.substr(0, 50) + "...";

	var infowindow = new google.maps.InfoWindow({
		content: '<h4>' + chapter.title + '</h4>' +
			'<p><b>Year:</b> ' + chapter.year + '</p>' +
			'<p>' + shortContent + '</p>' +
			'<button type="button" id="btnReadMore" onclick="seeMore(\'' + chapter.title + '\');" class="btn btn-block btn-success">See More</button>'
	});

	infowindow.open(map, chapter.marker);
	openInfoWindow = infowindow;
	return infowindow;
}

function seeMore(title) {
	$("#modal-title").text(title);
	$('#modal-chapter').foundation('reveal', 'open');
}

function focusOnChapter(index) {
	numChapter = index;
	var chapter = allEvents[index];
	map.setCenter(chapter.marker.getPosition());
	closeOpenInfoWindow();
	openShortInfoWindow(chapter);

	if (index >= allEvents.length - 1) {
		$("#btnNextChapter").attr("style", "display:none");
		endJourney();
	} else {
		$("#btnNextChapter").removeAttr("style");
	}
}

function askMe() {
	$("#location-field").removeAttr("style");
	$("#modal-form-h2").text(askMeLines[Math.floor((Math.random() * 5))]);
	$('#modal-form').foundation('reveal', 'open');
}

function startAudioSequence() {
  var recognition = new webkitSpeechRecognition();
  recognition.continuous = true;
  recognition.interimResults = true;
  $('.player_audio')[0].play();
  setTimeout(function() { alert("here"); }, 4000);
  recognition.onresult = function (event) {
    for (var i = event.resultIndex; i < event.results.length; ++i) {
      if (event.results[i].isFinal) alert("voice input: " + event.results[i][0].transcript);
    }
  };
  recognition.start();
  var timeoutID2 = window.setTimeout(function() { }, 5000);
  recognition.stop();
}

google.maps.event.addDomListener(window, 'load', initialize);
