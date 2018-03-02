var width = 800;
var height = 500;

console.log("We know d3");

var dataset;

var svg = d3.select(".chart")
            .append('svg')
            .attr('height',height)
            .attr('width',width)
            .append('g')
            .attr('transform','translate(0,0)');

/* To add images in the bubbles */
var defs = svg.append("defs");

var titles = {"num_events":"Number of Severe weather incidents(2010 - 2016)",
              "fatalities":"Number of fatalities by Severe weather incidents (2010 - 2016)",
              "tot_loss":"Net Property damage by Severe weather incidents (2010 - 2016) "
            }

var radiusScale = d3.scaleSqrt();



var simulation = d3.forceSimulation()
.force("x",d3.forceX(width/2).strength(0.05))
.force("y",d3.forceY(height/2).strength(0.15))
;


    
var rMin;
var rMax;
// create a function to identify min, max values of a column in data.csv which in turn
// assigns the results to the variables created above

function findMinAndMax(dataColumn) {
    rMin = d3.min(dataset, function (d) { return (d[dataColumn]) });
    rMax = d3.max(dataset, function (d) { return (d[dataColumn]) });
};

var ChartTitle = d3.select(".chart-title");

function populateStatesBubble(feature){
    
    radiusScale.range(getRadiusRange(feature));
    
    ChartTitle
        .append("h3")
        .text(titles[feature]);

    simulation.force("collide",d3.forceCollide(function(d){
        return radiusScale(d[feature])+3;
    }));

    d3.json("/states",function(states_data){

        dataset = states_data;
        console.log(states_data);


    
        findMinAndMax(feature);
    
        radiusScale.domain([rMin,rMax]);
    

    
    
        var patterns = defs.selectAll(".state_pattern")
                        .data(states_data)
                        .enter()
                        .append("pattern")
                        .attr("class","state_pattern")
                        .attr("id",d=>d['state_name'])
                        .attr("height","10")
                        .attr("width","10")
                        .attr("patternContentUnits","objectBoundingBox")
                        .append("image")
                        .attr("height","1")
                        .attr("width","1")
                        .attr("opacity","0.9")
                        .attr("preserveAspectRatio","None")
                        .attr("xmlns:xlink","http://www.w3.org/1999/xlink")
                        .attr("xlink:href",d=>d['seal_location']);
    
    

        var circles = svg.selectAll(".states")
        .data(states_data)
        .enter().append("circle")
        .attr("class","states")
        .attr("r",function(d){
            // console.log(d[feature],radiusScale(d[feature]))
            return radiusScale(d[feature]);
        })
        .attr("fill",d=>`url(#${d['state_name']})`)
        .attr("fillOpacity","0.5")
        .attr("stroke","lightblue")
        .attr("stroke-width","2")
        .on('click',function(d){
            
            var selected_seal = d3.select('.selected_seal');
            var selected_seal_meta = d3.select('.selected_seal_data');
    
            selected_seal.html("");
            selected_seal_meta.html("");
    
            selected_seal.append("img")
            .attr("width",250)
            .attr("height",250)
            .attr("preserveAspectRatio","None")
            .attr("src",d['large_seal_location']);
            // console.log(d);

            var state_label = d['state_name'].charAt(0).toUpperCase() + d['state_name'].slice(1);

            selected_seal_meta.append("div").attr("class","display-4").append("strong").text(state_label.replace('-',' '));
    
            var table = selected_seal_meta.append("table").attr("class","table table-hover").attr("style","width:100%;");
    
            var tbody = table.append("tbody");

            var columns = {'num_events':'Severe Weather Incidents','fatalities':'Number of fatalities','tot_loss':'Property Loss(in million)','tot_closs':'Crop Loss(in million)'};
            
            var keys = Object.keys(columns);

    
            tbody.selectAll("tr")
                .data(keys)
                .enter()
                .append("tr")
                .attr("class","font-weight-bold small")
                .html(function(k){
                    return `<td>${columns[k]}</td><td>${d[k]}</td>`;
                })   
            
            d3.json(`/state/${d['state']}`,function(type_count_data){
                console.log(type_count_data);

                var weather_data = {};

                    weather_data['Hail']=type_count_data[0][1];
                    weather_data['Tornado']=type_count_data[1][1];
                    weather_data['Wind']=type_count_data[2][1];

                    console.log(weather_data);

                    var weather_data_type = d3.select('.weather_type_data');

                    weather_data_type.html('');

                    console.log("Weather data",weather_data_type.html());

                    weather_data_type.attr("class","weather_type_data bg-info text-light");

                    weather_data_type.append("div")
                    .attr("class","display-5")
                    .append("strong")
                    .html('Severe weather events(breakdown by type)');
                    

                    var weather_list = weather_data_type
                                    .append("div")
                                    .attr("class",".list-inline");
                   

                    weather_list.selectAll(".list-inline-item")
                    .data(Object.keys(weather_data))
                    .enter()
                    .append("div")
                    .attr("class","list-inline-item font-weight-bold small")
                    .html(function(k){
                        return `${k} : ${weather_data[k]}`;
                    })                      
            });
            
    
        });
    
        simulation.nodes(states_data)
                  .on('tick',ticked);
    
        function ticked(){
            circles
                .attr("cx", function(d){
                    return d.x;
                })
                .attr("cy", function(d){
                    return d.y;
                })
        }
    });
}

function actOnClick(feature){

    ChartTitle.html('');

    ChartTitle
    .append("h3")
    .text(titles[feature]);
    
    findMinAndMax(feature);
    radiusScale.range(getRadiusRange(feature));
    radiusScale.domain([rMin,rMax]);

    d3.selectAll(".states").attr("r",d=>radiusScale(d[feature]));  
    
    simulation.force("collide",d3.forceCollide(d=>radiusScale(d[feature])+3))
              .alphaTarget(0.05)
              .restart();
}
function getRadiusRange(feature){
    if(feature == 'num_events'){
        return [0,50]
    }else if(feature == 'tot_loss'){
        return [10,100]
    }else if(feature == 'fatalities'){
        return [10,50]
    }
}
populateStatesBubble('num_events');