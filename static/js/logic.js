var first = "Y";
// Mapbox API
var $mapContainer = document.getElementById("map-container");
var streets = L.tileLayer("https://api.mapbox.com/v4/mapbox.streets/{z}/{x}/{y}.png?access_token=" +
    "pk.eyJ1IjoidGJlcnRvbiIsImEiOiJjamRoanlkZXIwenp6MnFuOWVsbGo2cWhtIn0.zX40X0x50dpaN96rKQKarw");

var light = L.tileLayer("http://api.mapbox.com/v4/mapbox.light/{z}/{x}/{y}.png?access_token="+
    "pk.eyJ1IjoidGJlcnRvbiIsImEiOiJjamRoanlkZXIwenp6MnFuOWVsbGo2cWhtIn0.zX40X0x50dpaN96rKQKarw");

//  query URL
var tornadoURL = "https://raw.githubusercontent.com/TomBerton/SevereWeatherViz/master/json_data/tornado.json";
var hailURL = "https://raw.githubusercontent.com/TomBerton/SevereWeatherViz/master/json_data/hail.json";
var windURL = "https://raw.githubusercontent.com/TomBerton/SevereWeatherViz/master/json_data/wind.json";


function getBubblePlotData(year){
  
    var data = [];
    
    Plotly.d3.json(`/bubble/${year}`,function(bubble_chart_data){
    var tornado_data = {
            x: ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'],
            y: bubble_chart_data['torn']['y'],
            text: bubble_chart_data['torn']['text'],
            mode: 'markers',
            marker: {
                color:'orange',
            size: bubble_chart_data['torn']['s'],
            sizeref: 2,
            sizemode: 'area'
            },
            name: 'tornado'
        };
        
        var hail_data = {
            x: ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'],
            y: bubble_chart_data['hail']['y'],
            text: bubble_chart_data['hail']['text'],
            mode: 'markers',
            marker: {
                color:'skyblue',
            size: bubble_chart_data['hail']['s'],
            //setting 'sizeref' to lower than 1 decreases the rendered size
            sizeref: 2,
            sizemode: 'area'
            },
            name: 'hail'
        };
        
        var wind_data = {
            x: ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'],
            y: bubble_chart_data['wind']['y'],
            text: bubble_chart_data['wind']['text'],
            mode: 'markers',
            marker: {
            color:'red',
            size: bubble_chart_data['wind']['s'],
            sizeref: 2,
            // colorscale: 'Electric',
            sizemode: 'area'
            },
            name: 'Wind'
        };
        
        data.push(tornado_data, hail_data, wind_data);
        // console.log(data);
     
        // Plotly.restyle("bubble-chart", data, layout);
    });
  
       
    var layout = {
      title: 'Severe weather incidents around months',
      titlefont: {
      family: "Calibri Heading",
      size: 18},
      showlegend: true,
      height: 400,
      width: 600,
      xaxis: {
      title: "Months of the year",
      titlefont: {
          family: "Calibri Heading",
          size: 14}},
      yaxis: {
      title: "Scaled Magnitude",
      titlefont: {
          family: "Calibri Heading",
          size: 14}}            
  };
     
  
  bubble_plot_data =  {
  'data':data,
  'layout':layout
  }
    return bubble_plot_data;
  }
 

function getMap(year) {
  d3.json(tornadoURL, function(tornadoData) {
    //   console.log("tornado_url", tornadoData);
    
      d3.json(hailURL, function(hailData) {
        // console.log("hail_url", tornadoData);
    
        d3.json(windURL, function(windData) {
            // console.log("wind_url", tornadoData);
    
          buildMap(year, tornadoData, hailData, windData);
        });
      });
    });
}


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
        zoomSnap: .25,
        zoomDelta: .25,
        zoom: 4.75,
        scrollWheelZoom: false,
        layers: [streets, tornadoMarkers]
    });
  
    
    L.control.layers(baseMaps, overlayMaps).addTo(myMap);

    // createMap(tornadoMarkers);

}

function buildLayer(year, geoJson, title) {
  var markers = L.markerClusterGroup();
    var features = geoJson.features;
    // Loop through our data...
    for (var i = 0; i < features.length; i++) {
    //   console.log("feature", features);
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

//place holder pie chart 
var data = [{
  values: [1,2,3,4,5],
  labels: ['1','2','3','4','5'],
  type: 'pie'
}];

Plotly.newPlot('pie-chart', data);

//function to render charts based on year
function getYearCharts(year){

  
    // updatePieChart(data);

    renderBubble(year);
    getBubblePlotData(year);
    renderStackedBar(year);
    // code to destroy and replace the map
    rerenderMapDiv();
    getMap(year);
}

function rerenderMapDiv(){
    map.remove();
    var newMapDiv = document.createElement("div");
    newMapDiv.id = "map";
    var firstChild = document.body.firstChild;
    document.body.insertBefore(newMapDiv, firstChild);
}
// make a function that renders a bubble chart based on the given data value
function renderBubble(year){
  getBubblePlotData(year);
}

function updatePieChart(newdata){
  Plotly.restyle("pie-chart", "values", [newdata]);
};

function getBubblePlotData(year){
  
    var data = [];
    
    Plotly.d3.json(`/bubble/${year}`,function(bubble_chart_data){
    var tornado_data = {
            x: ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'],
            y: bubble_chart_data['torn']['y'],
            text: bubble_chart_data['torn']['text'],
            mode: 'markers',
            marker: {
                color:'orange',
            size: bubble_chart_data['torn']['s'],
            sizeref: 2,
            sizemode: 'area'
            },
            name: 'tornado'
        };
        
        var hail_data = {
            x: ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'],
            y: bubble_chart_data['hail']['y'],
            text: bubble_chart_data['hail']['text'],
            mode: 'markers',
            marker: {
                color:'skyblue',
            size: bubble_chart_data['hail']['s'],
            //setting 'sizeref' to lower than 1 decreases the rendered size
            sizeref: 2,
            sizemode: 'area'
            },
            name: 'hail'
        };
        
        var wind_data = {
            x: ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'],
            y: bubble_chart_data['wind']['y'],
            text: bubble_chart_data['wind']['text'],
            mode: 'markers',
            marker: {
            color:'red',
            size: bubble_chart_data['wind']['s'],
            sizeref: 2,
            // colorscale: 'Electric',
            sizemode: 'area'
            },
            name: 'Wind'
        };
        // console.log("Whatever");
        data.push(tornado_data);
        data.push(hail_data);
        data.push(wind_data);
        // console.log(data);

        var layout = {
            title: 'Severe weather incidents around months',
            titlefont: {
            family: "Calibri Heading",
            size: 18},
            showlegend: true,
            height: 400,
            width: 600,
            xaxis: {
            title: "Months of the year",
            titlefont: {
                family: "Calibri Heading",
                size: 14}},
            yaxis: {
            title: "Scaled Magnitude",
            titlefont: {
                family: "Calibri Heading",
                size: 14}}   
                
                
        };
      
      if(first == "Y"){
        Plotly.newPlot("bubble-chart", data, layout);
      }else{
        update_data = [data];
        Plotly.newPlot("bubble-chart",data,layout);
      }

       first = "N";
    });
  
}   

function renderStackedBar(year){
  var url = "/events/" + year
  d3.json(url, function(error, response){
    if(error) console.warn(error);
    var listOfStates = []
    var listOfTorn = []
    var listOfHail = []
    var listOfWind = []
    for (var i = 0; i <response.length;i++){
      var currentState = response[i]
      var state = currentState["ST"];
      var tornEvents = currentState["Tornados"];
      var hailEvents = currentState["Hail"];
      var windEvents = currentState["Wind"];
      listOfStates.push(state)
      listOfTorn.push(tornEvents)
      listOfHail.push(hailEvents)
      listOfWind.push(windEvents)
    }
    var trace1 = {
      x: listOfStates,
      y: listOfTorn,
      name: "Tornados",
      type: "bar",
      marker: {
      color: "orange"
      }
    };
    var trace2 = {
      x: listOfStates,
      y: listOfHail,
      name: "Hail",
      type: "bar",
      marker:{
      color : "skyblue"
      }
    };

    var trace3 = {
      x: listOfStates,
      y: listOfWind,
      name: "Wind",
      type: "bar",
      marker: {
      color : "red"
      }
    };
    var data = [trace1, trace2, trace3];
    var layout = {
      title: `Events for year ${year}`,
      barmode: "stack",
      titlefont: {
        family: "Calibri Heading",
        size: 18},
        xaxis: {
          title: "State",
          titlefont: {
              family: "Calibri Heading",
              size: 14}},
          yaxis: {
          title: "Event Count",
          titlefont: {
              family: "Calibri Heading",
              size: 14}} 
    };
    Plotly.newPlot("stacked-bar-chart", data, layout)
  })
}
function init(){
getBubblePlotData(2010);
renderStackedBar(2010);
getMap(2010);
}

init();