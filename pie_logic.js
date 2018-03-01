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
  // updatePieChart(data);

  renderPie(year);
  renderBubble(year);
}
// make a function that renders a pie chart based on the given data value
function renderPie(year){
  Plotly.d3.json(`/piechart/${year}`,function(pie_chart_data){
  Plotly.newPlot('pie_chart', Pie_chart_data);
  });
};
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


getBubblePlotData(2010);
renderPie(2010);

