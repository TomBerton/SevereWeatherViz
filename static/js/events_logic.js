// Mapbox API

var streets = L.tileLayer("https://api.mapbox.com/v4/mapbox.streets/{z}/{x}/{y}.png?access_token=" +
    "pk.eyJ1IjoidGJlcnRvbiIsImEiOiJjamRoanlkZXIwenp6MnFuOWVsbGo2cWhtIn0.zX40X0x50dpaN96rKQKarw");

var light = L.tileLayer("http://api.mapbox.com/v4/mapbox.light/{z}/{x}/{y}.png?access_token="+
    "pk.eyJ1IjoidGJlcnRvbiIsImEiOiJjamRoanlkZXIwenp6MnFuOWVsbGo2cWhtIn0.zX40X0x50dpaN96rKQKarw");

//  query URL
var tornadoURL = "https://raw.githubusercontent.com/TomBerton/SevereWeatherViz/master/json_data/tornado.json";
var hailURL = "https://raw.githubusercontent.com/TomBerton/SevereWeatherViz/master/json_data/hail.json";
var windURL = "https://raw.githubusercontent.com/TomBerton/SevereWeatherViz/master/json_data/wind.json";



// 1. d3.json to get tornado data
  // 2. d3.json to get hail data
    // 3. d3.json to get wind data
      // 4. build map

// hard code the year      
var year = 2010;

function getMap(year) {
    d3.json(tornadoURL, function(tornadoData) {
        console.log("tornado_url", tornadoData);
      
        d3.json(hailURL, function(hailData) {
          console.log("hail_url", tornadoData);
      
          d3.json(windURL, function(windData) {
              console.log("wind_url", tornadoData);
      
            buildMap(year, tornadoData, hailData, windData);
          });
        });
      });
}

getMap(year)

function buildMap(year, tornadoData, hailData, windData) {

  // build tornado layer

  var tornadoMarkers = buildLayer(year, tornadoData, "F-scale: ");

  // build hail layer
  var hailMarkers = buildLayer(year, hailData, "Hail size: ");

  // build windlayer
  var windMarkers = buildLayer(year, windData, "KPH: ");

  // add control


    
    var baseMaps = {
        "Streets": streets,
        "Light": light
    };
    
    var overlayMaps = {
        "Tornados": tornadoMarkers,
        "Hail": hailMarkers,
        "Wind": windMarkers
    };

    // add map
    var myMap = L.map("map", {
        center: [
            37.09, -95.71
        ],
        zoom: 4.25,
        layers: [streets, tornadoMarkers]
    });
  
    
    L.control.layers(baseMaps, overlayMaps).addTo(myMap);

}

function buildLayer(year, geoJson, title) {
  var markers = L.markerClusterGroup();
    var features = geoJson.features;
    // Loop through our data...
    for (var i = 0; i < features.length; i++) {
      console.log("feature", features);
      var coords = features[i].geometry;
      var description = features[i].properties
      var event = features[i].properties;
      // If the data has lat an lon add them to the map. 
      // get the year 
      if (event.yr === year) {
        if (coords) {

            // Add a new marker to the cluster group and bind a pop-up
            markers.addLayer(L.marker([coords.coordinates[1], coords.coordinates[0]])
              .bindPopup("<h4>"+ title +": " + description.mag + "<br/>Location: " 
                  + description.st + "</h4><hr><p>Date : Time: " + description.date_time + "</p>"));
          }
      }
      

    }

    // Add our marker cluster layer to the map
    // myMap.addLayer(markers);
    return markers;
}
