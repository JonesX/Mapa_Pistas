var imagens = [];

var esriWorldImagery = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
	attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
});

var map = L.map('mapid', {center:[-6.717, -56.794], layers:[esriWorldImagery], zoom:5});

var baselayers = {
		"esri":esriWorldImagery
	}

var ctrlLayers = L.control.layers(baselayers).addTo(map);

L.control.scale().addTo(map);
L.control.mousePosition().addTo(map);

var path = window.location.pathname;
var contextoWeb = path.substring(0, path.indexOf('/', 1));
var endPointURL = "ws://" + window.location.host + contextoWeb + "/servidor";

var chatClient = null;
var marcadores = [];

var cont = 0;

function addMarker(lat, long, nomePista, nomeImagem){
	
	var html = '<div class="div_marcador" id="'+nomePista+'">';
	html += '<a href="#" class="marcador" >'+nomePista+'</a>';
	html +=	'</div>';
		
	var m = L.marker([lat, long]);
	m.addTo(map).bindPopup(nomePista+'<br>'+nomeImagem).openPopup();
	m.id = nomePista;
	marcadores.push(m);
	
	$("#marcadores").append(html);
}

function addLayer(nomeImage){

	nomeImage = nomeImage.split(".")[0];

	var contem = false;

	for(var i = 0; i<imagens.length; i++){
		if(imagens[i].wmsParams.nome_imagem === nomeImage){
			console.log("contem");
			contem = true;
			break;
		}
	}

	if(!contem){
		var imgCbers = L.tileLayer.wms("http://192.168.25.101:8080/geoserver/Imagens_Pistas/wms",{
			layers:"Imagens_Pistas:"+nomeImage,
			nome_imagem:nomeImage,
			format: 'image/png',
			transparent: true
			// attribution: "Weather data © 2012 IEM Nexrad"
		}).addTo(map);

		imagens.push(imgCbers);
	}
	
}

function connect() {
    chatClient = new WebSocket(endPointURL);
    chatClient.onmessage = function (event) {
		var coords = JSON.parse(event.data);
		console.log(coords);
		addMarker(coords.longitude, coords.latitude, "Suspeito "+cont, coords.nome_imagem);
		addLayer(coords.nome_imagem)
    	cont = cont + 1;
    };
}

function disconnect() {
    chatClient.close();
}

$(document).on("click", ".marcador", function(){
	var id = $(this).text();
	
	marcadores.forEach(function(m){
		if(m.id === id){
			map.setView(m.getLatLng(), 12);
			m.openPopup();
		}
	});
});

