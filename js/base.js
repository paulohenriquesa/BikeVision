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
	var osmURL = 'https:\/\/a.tiles.mapbox.com\/v4\/mapbox.streets\/{z}\/{x}\/{y}.png?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpbTgzcHQxMzAxMHp0eWx4bWQ1ZHN2NGcifQ.WVwjmljKYqKciEZIC3NfLA';
	var cyclesURL =  'http://tile.lonvia.de/cycling/{z}/{x}/{y}.png';

	var streets = L.tileLayer(osmURL,{maxZoom: 14});
	var cycle = L.tileLayer(cyclesURL,{maxZoom: 14});
	
	var map = L.map('map',{
		center: [-3.7426, -38.5097],
		zoom: 14,
		layers: [streets, cycle, bicicletar, bicicletario, airPump, bicicletaria]
	});
	var base = {
			"Open Street Map": streets,
			
	};
	var layers = {
			"Cicloviária": cycle,
			"Bicicletar": bicicletar,
			"Bicicletário": bicicletario,
			"Bicicletária": bicicletaria,
			"Posto (Bombas de Ar)": airPump
	};
	L.control.layers(base,layers).addTo(map);	
	
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

	map.on('locationfound', onLocationFound);
	map.on('locationerror', onLocationError);
	
	map.locate({setView:true});
}


//bbox: -4.129339914914841,-38.920440673828125,-3.4777819106581633,-37.766876220703125
//http://overpass-api.de/api/interpreter?data=
//[out:json][timeout:60];(node["amenity"="bicycle_rental"]('+ bbox + ');node["amenity"="bicycle_parking"]('+ bbox + ');node["amenity"="fuel"]('+ bbox + '););out;
