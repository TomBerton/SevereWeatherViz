var first = "Y";

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
        console.log(data);
     
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

//function to render charts based on year
function getYearCharts(year){

  
  // updatePieChart(data);

  renderBubble(year);
  getBubblePlotData(year);
  renderStackedBar(year);
}
// make a function that renders a pie chart based on the given data value
function renderPie(data){

}
// make a function that renders a bubble chart based on the given data value
function renderBubble(year){
  getBubblePlotData(year);
}
// make a function that renders the US Map based on the given data value
function renderUsMap(data){

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
        console.log("Whatever");
        data.push(tornado_data);
        data.push(hail_data);
        data.push(wind_data);
        console.log(data);

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
}

init();