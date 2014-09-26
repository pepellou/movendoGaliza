var map_stops;
var markers = [];
var santiago = new google.maps.LatLng(42.88,-8.58);
var MAPTYPE_ID = 'stops';

function showStops(
	stops
) {
	var pinLocation = new google.maps.Point(7, 55);
	var image = './img/pin.png';
	for (var i in markers) {
		marker = markers[i];
		marker.setMap(null);
	}
	markers = [];
	for (var i in stops) {
		stop = stops[i];
		marker = new google.maps.Marker({
			position: new google.maps.LatLng(stop.lat, stop.lng),
			map: map_stops,
			icon: new google.maps.MarkerImage(
				'./img/pin.png',
				new google.maps.Size(50, 57),
				new google.maps.Point(0,0),
				pinLocation
			),
			title: stop.name
		});
		markers[i] = marker;
		google.maps.event.addListener(
			marker,
			'click',
			clickOnMarker(stop)
		);
	}
}

function clickOnMarker(
        marker
) {
    return function () {
        showStop(marker);
    };
}

function showStop(
	stop
) {
	$('#stopCard').fadeOut({
		complete: function() {
			$('#stopCard .name').html(stop.name);
			var lines = "";
			if (stop.lines != undefined) {
				stop.lines.forEach(function(line) {
					lines += "<li>" + line + "</li>";
				});
			}
			$('#stopCard .lines').html(lines);
			$('#stopCard').fadeIn();
		}
	});
}

function setUpMapStops(
	stops
) {
	var stylez = [
		{
			featureType: "water",
			elementType: "all",
			stylers: [
				{ hue: '#cdcdc1' },
				{ saturation: -76 },
				{ lightness: 8 },
				{ visibility: 'on' }
			]
		}
	];

	var mapOptions = {
		zoom: 13,
		center: santiago,
		mapTypeControlOptions: {
			mapTypeIds: []
		},
		mapTypeId: MAPTYPE_ID
	};

	map_stops = new google.maps.Map(document.getElementById("map_canvas"), mapOptions);

	var myLatLng = new google.maps.LatLng(43.367776,-8.406222);

	showStops(stops);
      
	var styledMapOptions = { name: "Stop" };

	var jayzMapType = new google.maps.StyledMapType(stylez, styledMapOptions);
  
	map_stops.mapTypes.set(MAPTYPE_ID, jayzMapType);
}
