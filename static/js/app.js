// Creating our initial map object
// We set the longitude, latitude, and the starting zoom level
// This gets inserted into the div with an id of 'map'
var myMap = L.map("map", {
  center: [38, -95],
  zoomSnap: .25,
  zoomDelta: .25,
  zoom: 4.75,
  scrollWheelZoom: false
});

// Adding a tile layer (the background map image) to our map
// We use the addTo method to add objects to our map
L.tileLayer(
  "https://api.mapbox.com/styles/v1/mapbox/navigation-guidance-day-v2/tiles/256/{z}/{x}/{y}?" +
    "access_token=pk.eyJ1Ijoia2pnMzEwIiwiYSI6ImNpdGRjbWhxdjAwNG0yb3A5b21jOXluZTUifQ." +
    "T6YbdDixkOBWH_k9GbS8JQ"
).addTo(myMap);

//place holder pie chart 
var data = [{
  values: [1,2,3,4,5],
  labels: ['1','2','3','4','5'],
  type: 'pie'
}];

Plotly.newPlot('pie-chart', data);

//place holder bubble-chart
var trace1 = {
  x: [1,2,3,4,5,6],
  y: [2,3,5,7,10,22],
  mode: "markers"
};
//set the data object
var data = [trace1];
//plot the chart
Plotly.newPlot("bubble-chart", data);

//function to render charts based on year
function getYearCharts(year){
  var data = [];
  switch(year){
    case "2010":
      data = [1,2,3,4,5];
      break;
    
    case "2011":
      data = [2,3,4,5,6];
      break;
    
    case "2012":
      data = [3,6,11,51,2];
      break;
    
    case "2013":
      data = [4,77,54,3,2];
      break;
    
    case "2014":
      data = [49,55,1010,30,4];
      break;

    case "2015":
      data = [123,44,5,78,45];
      break;

    case "2016":
      data = [90,53,81,3,37];
      break;
  }
  updatePieChart(data);
}
// make a function that renders a pie chart based on the given data value
function renderPie(data){

}
// make a function that renders a bubble chart based on the given data value
function renderBubble(data){

}
// make a function that renders the US Map based on the given data value
function renderUsMap(data){

}

function updatePieChart(newdata){
  Plotly.restyle("pie-chart", "values", [newdata]);
};