var map;
var mapOfRectangles = {};
var dataMap = {};
var outdated = false;

var littleSquareSize = 0.005
var boundaries = {"NO":{'latitude': 45.840, 'longitude': 4.790}, "SE":{'latitude': 45.690, 'longitude': 4.950}}
var nbColumnLatitudeLittle = Math.floor((boundaries["NO"]['latitude'] - boundaries["SE"]['latitude']) / littleSquareSize)  // floor, round, ceil ?
var nbColumnLongitudeLittle = Math.floor((boundaries["SE"]['longitude'] - boundaries["NO"]['longitude']) / littleSquareSize) // floor, round, ceil ?


function initMap() {
	map = new google.maps.Map(document.getElementById('map'), {
	  zoom: 11,
	  center: {lat: 45.765, lng: 4.78},
	  mapTypeId: 'terrain'
	});

	var lat = boundaries["NO"]['latitude']
	var long = boundaries["NO"]['longitude']
	for (var i = 0; i < parseInt(nbColumnLatitudeLittle * nbColumnLongitudeLittle); i++) {
	 	console.log("i", i);

		if (long > boundaries["SE"]['longitude'] - littleSquareSize){
			long = boundaries["NO"]['longitude']
			lat  =  Math.round(lat*1000 - littleSquareSize*1000)/1000; 
		}

	    zone =  i + 1;
	    console.log(zone, lat, long);
	    if (zone in mapOfRectangles){zone = zone +1}
	   	if(zone <= i + 1){
		    mapOfRectangles[parseInt(zone)] = new google.maps.Rectangle({
		      strokeColor:"#00ff00",
		      strokeOpacity: 0.35,
		      strokeWeight: 0,
		      fillColor: "#00ff00",
		      fillOpacity: 0.35,
		      map: map,
		      bounds: {
		        north: Math.round(lat*1000)/1000 ,
		        south: Math.round(lat*1000 - littleSquareSize*1000)/1000,
		        east: Math.round(long*1000 + littleSquareSize*1000)/1000,
		        west: Math.round(long*1000)/1000
		      }
		    });
		    // mapOfRectangles
			mapOfRectangles[zone].addListener('mouseover', mouseoverrectangle);
			mapOfRectangles[zone].addListener('mouseout', mouseoutrectangle);
	    }
	  long = Math.round(long*1000 + littleSquareSize*1000)/1000
	}

	var socket = io();

	socket.on('newGeo', function(geo){
		for (var i = 0; i < geo.length; i++) {

			if (geo[i][0] in mapOfRectangles){
				mapOfRectangles[geo[i][0]].setOptions({fillColor:getColorStringFromData(geo[i][1]),  
				strokeColor:getColorStringFromData(geo[i][1])
				});
				dataMap[geo[i][0]] = geo[i][1];

			}
		}
      // console.log(geo[i][0]);
      

	    // if (document.getElementById('info-box').textContent != "?" &&  outdated){
	    // 	document.getElementById('info-box').textContent = document.getElementById('info-box').textContent + " (outdated)"
	    	// outdated = false;
	    // }

	});

}

function mouseoverrectangle(event){

	var lat =  Math.round(event.latLng.lat()*1000)/1000;
	var long = Math.round(event.latLng.lng()*1000)/1000;

	zone = Math.floor(Math.floor(Math.abs(Math.round(boundaries["NO"]['latitude']*1000 - lat*1000)/1000)/littleSquareSize)* nbColumnLongitudeLittle + Math.floor(Math.abs(Math.round(boundaries["NO"]['longitude']*1000 - long*1000)/1000)/littleSquareSize)) + 1
    zone = parseInt(zone);
	console.log("enter", zone)

	if (zone in dataMap) {
	    document.getElementById('info-box').textContent = dataMap[zone];
	}
	for (i in mapOfRectangles) {
		mapOfRectangles[i].setOptions({strokeWeight: 0})
	}

	if (zone in mapOfRectangles) {
			console.log(zone)
		    mapOfRectangles[zone].setOptions({strokeWeight: 5})
	}
}


function mouseoutrectangle(event){

	var lat =  Math.round(event.latLng.lat()*1000)/1000;
	var long = Math.round(event.latLng.lng()*1000)/1000;

	zone = Math.floor(Math.floor(Math.abs(Math.round(boundaries["NO"]['latitude']*1000 - lat*1000)/1000)/littleSquareSize)* nbColumnLongitudeLittle + Math.floor(Math.abs(Math.round(boundaries["NO"]['longitude']*1000 - long*1000)/1000)/littleSquareSize)) + 1
    zone = parseInt(zone);
	console.log("exit", zone)
	if (zone in dataMap) {
	    document.getElementById('info-box').textContent = "?";
	}
	if (zone in mapOfRectangles) {
	    mapOfRectangles[zone].setOptions({strokeWeight: 0})
	}
}

function getColorStringFromData(data) {

	MAX_COUNT = 450
	r = 0
	g = 255
	b = 0
	if (typeof data == 'undefined'){
		return "#ffffff"
	}

	if (data > 0 && data < MAX_COUNT/2) {

		r += (255/(MAX_COUNT/2)) * data

	} else if (data == MAX_COUNT/2){

		r = 255
		g = 255

	} else if (data > 0 && data > MAX_COUNT/2 && data < MAX_COUNT){


		r = 255
		g = 255
		g = g - (255/(MAX_COUNT/2)) * data

	}else if (data == MAX_COUNT){

		r = 255
		g = 0
	}

	r = Math.min(Math.ceil(r),255)
	g = Math.max(Math.ceil(g), 0)


	return rgbToHex(r, g, b) 
}

// http://stackoverflow.com/a/5624139
function componentToHex(c) {
    var hex = c.toString(16);
    return hex.length == 1 ? "0" + hex : hex;
}

function rgbToHex(r, g, b) {
    return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
}

