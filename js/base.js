document.addEventListener('DOMContentLoaded',initialize);

function initialize(){
	
	var bicicletar = new L.layerGroup();
	var bicicletarIcon = L.icon({
		iconUrl: 'js/icons/bicycle.png',
		iconSize: [25,25]
	});
	var bicicletario = new L.layerGroup();
	var bicicletarioIcon = L.icon({
		iconUrl: 'js/icons/bike_park.png',
		iconSize: [25, 25]
	});
	var airPump = new L.layerGroup();
	var airPumpIcon = L.icon({
		iconUrl: 'js/icons/airPump_icon.png',
		iconSize: [25, 25]
	});
	var bicicletaria = new L.layerGroup();
	var bicicletariaIcon = L.icon({
		iconUrl: 'js/icons/bikeshop.png',
		iconSize: [25, 25]
	});
	for( var point in data.elements){
		switch(data.elements[point].tags.amenity){
			case 'bicycle_rental' : L.marker([data.elements[point].lat, data.elements[point].lon], {icon: bicicletarIcon}).bindPopup('Bicicletar '+data.elements[point].tags.name).addTo(bicicletar);
				break;
			case 'bicycle_parking' : L.marker([data.elements[point].lat, data.elements[point].lon], {icon: bicicletarioIcon}).bindPopup(data.elements[point].tags.name).addTo(bicicletario);
				break;
			case 'fuel' : L.marker([data.elements[point].lat, data.elements[point].lon], {icon: airPumpIcon}).bindPopup(data.elements[point].tags.name).addTo(airPump);
				break;
		}	
		if(data.elements[point].tags.shop == "bicycle"){
			L.marker([data.elements[point].lat, data.elements[point].lon], {icon: bicicletariaIcon}).bindPopup('Bicicletaria '+data.elements[point].tags.name).addTo(bicicletaria);
		}
	}	
	var mapboxURL = 'https:\/\/a.tiles.mapbox.com\/v4\/mapbox.streets\/{z}\/{x}\/{y}.png?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpbTgzcHQxMzAxMHp0eWx4bWQ1ZHN2NGcifQ.WVwjmljKYqKciEZIC3NfLA';
	var BING_KEY = 'AuhiCJHlGzhg93IqUH_oCpl_-ZUrIE6SPftlyGYUvr9Amx5nzA-WqGcPquyFZl4L';
	var osmURL = 'http://{s}.tile.osm.org/{z}/{x}/{y}.png';
	var cyclesURL =  'http://tile.lonvia.de/cycling/{z}/{x}/{y}.png';
	
	var mapboLayer = L.tileLayer(mapboxURL,{maxZoom: 18});
	var bingLayer = L.tileLayer.bing(BING_KEY);
	var omsLayer = L.tileLayer(osmURL,{maxZoom: 18});
	var cycle = L.tileLayer(cyclesURL,{maxZoom: 18});
	
	
	var map = L.map('map',{
		center: [-3.7487, -38.5243],
		zoom: 14,
		layers: [mapboLayer, cycle, bicicletar, bicicletario, airPump, bicicletaria]
	});
	var base = {
			"MapBox": mapboLayer,
			"Bing Maps": bingLayer,
			"Open Street Map": omsLayer,
	};
	var layers = {
			"Infra Cicloviária": cycle,
			"Bicicletar": bicicletar,
			"Bicicletário": bicicletario,
			"Posto (Bombas de Ar)": airPump,
			"Bicicletaria": bicicletaria
	};
	L.control.layers(base,layers).addTo(map);
	//https://github.com/domoritz/leaflet-locatecontrol
	var lc = L.control.locate({
		position: 'topleft',  // set the location of the control
		drawCircle: true,  // controls whether a circle is drawn that shows the uncertainty about the location
		follow: false,  // follow the user's location
		setView: true, // automatically sets the map view to the user's location, enabled if `follow` is true
		keepCurrentZoomLevel: true, // keep the current map zoom level when displaying the user's location. (if `false`, use maxZoom)
		stopFollowingOnDrag: false, // stop following when the map is dragged if `follow` is true (deprecated, see below)
		remainActive: false, // if true locate control remains active on click even if the user's location is in view.
		markerClass: L.circleMarker, // L.circleMarker or L.marker
		circleStyle: {},  // change the style of the circle around the user's location
		markerStyle: {},
		followCircleStyle: {},  // set difference for the style of the circle around the user's location while following
		followMarkerStyle: {},
		icon: 'fa fa-map-marker',  // class for icon, fa-location-arrow or fa-map-marker
		iconLoading: 'fa fa-spinner fa-spin',  // class for loading icon
		circlePadding: [0, 0], // padding around accuracy circle, value is passed to setBounds
		metric: true,  // use metric or imperial units
		onLocationError: function(err) {alert(err.message)},  // define an error callback function
		onLocationOutsideMapBounds:  function(context) { // called when outside map boundaries
		alert(context.options.strings.outsideMapBoundsMsg);
    	},
    showPopup: true, // display a popup when the user click on the inner marker
    strings: {
        title: "Show me where I am",  // title of the locate control
        popup: "You are within {distance} {unit} from this point",  // text to appear if user clicks on circle
        outsideMapBoundsMsg: "You seem located outside the boundaries of the map" // default message for onLocationOutsideMapBounds
    },
    locateOptions: {}  // define location options e.g enableHighAccuracy: true or maxZoom: 10
}).addTo(map);	
	// https://github.com/perliedman/leaflet-control-geocoder
   	var geocoder = new L.Control.geocoder({position: "topleft", collapsed: true, showResultIcons: true});
   	map.addControl(geocoder);
   	geocoder.markGeocode = function(result) {
	map.fitBounds(result.bbox);
   	};
	function onLocationFound(e) {
		var radius = e.accuracy / 2;
		var cursor = L.icon({
			iconUrl: 'js/icons/cursor.png',
			iconSize: [15, 15]
		});
		L.marker(e.latlng,{icon: cursor}).addTo(map).bindPopup("Precisão " + radius + " metros deste ponto").openPopup();

		L.circle(e.latlng, radius).addTo(map);
	}

	function onLocationError(e) {
		alert(e.message);
	}
	
	function Locale(){
    	map.locate({setView: true, maxZoom: 17});
    	map.on('locationfound', onLocationFound);
	map.on('locationerror', onLocationError);
	};
}


//bbox: -4.129339914914841,-38.920440673828125,-3.4777819106581633,-37.766876220703125
//http://overpass-api.de/api/interpreter?data=
//[out:json][timeout:60];(node["amenity"="bicycle_rental"]('+ bbox + ');node["amenity"="bicycle_parking"]('+ bbox + ');node["amenity"="fuel"]('+ bbox + '););out;
