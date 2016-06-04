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
	for( var point in data.elements){
		switch(data.elements[point].tags.amenity){
			case 'bicycle_rental' : L.marker([data.elements[point].lat, data.elements[point].lon], {icon: bicicletarIcon}).bindPopup('Bicicletar '+data.elements[point].tags.name).addTo(bicicletar);
				break;
			case 'bicycle_parking' : L.marker([data.elements[point].lat, data.elements[point].lon], {icon: bicicletarioIcon}).bindPopup('Bicicletario '+data.elements[point].tags.name).addTo(bicicletario);
				break;
			case 'fuel' : L.marker([data.elements[point].lat, data.elements[point].lon], {icon: airPumpIcon}).bindPopup('Posto '+data.elements[point].tags.name).addTo(airPump);
				break;
		}
			
	}	
	
	
	var streetsURL = 'http://{s}.tile.osm.org/{z}/{x}/{y}.png';
	var cyclesURL =  'https://{s}.tile.thunderforest.com/cycle/{z}/{x}/{y}.png';

	var streets = L.tileLayer(streetsURL,{maxZoom: 18});
	var cycle = L.tileLayer(cyclesURL,{maxZoom: 18});
	
	var map = L.map('map',{
		center: [-3.7304512, -38.5217989],
		zoom: 15,
		layers: [streets, bicicletar, bicicletario, airPump]
	});
	var base = {
			"Ruas": streets,
			"Ciclofaixas": cycle
	};
	var layers = {
			"Bicicletar": bicicletar,
			"Bicicletario": bicicletario,
			"Posto(Bombas de Ar)": airPump
	};
	L.control.layers(base,layers).addTo(map);	
	map.locate({setView:true});
}
//bbox: -4.129339914914841,-38.920440673828125,-3.4777819106581633,-37.766876220703125
//http://overpass-api.de/api/interpreter?data=
//[out:json][timeout:60];(node["amenity"="bicycle_rental"]('+ bbox + ');node["amenity"="bicycle_parking"]('+ bbox + ');node["amenity"="fuel"]('+ bbox + '););out;