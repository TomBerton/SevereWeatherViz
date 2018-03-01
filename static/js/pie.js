var first = "Y";

function getLossPercentage(year){
  
  
    var data = [];
    
    Plotly.d3.json(`/pie/${year}`,function(pie_chart_data){
    values: [19, 26, 55],
    labels: ['Hail', 'Torn', 'Wind'],
    type:     'pie';
  Plotly.newPlot('myDiv', Pie_chart_data);

