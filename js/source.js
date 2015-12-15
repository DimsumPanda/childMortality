// ====================================================================
// Choropleth Map: Javascript code for Choropleth map
// ====================================================================

// Set the SVG dimensions as variables: width_choropleth, height_choropleth
var width_choropleth = 650,
    height_choropleth = 350;

// Create variable of the SVG. Select the div with id="vis_choropleth"
var svg_choropleth = d3.select('#vis_choropleth')
    .append('svg')
    .attr('class', 'vis_choropleth')
    .attr('width', width_choropleth)
    .attr('height', height_choropleth)
    // .call(d3.behavior.zoom()
    // .on("zoom", redraw))
    .append("g");
    // .call(tip);

// Set the projection using mercator. Create the scale of the map image
var projection_choropleth = d3.geo.mercator()
    .scale(100) // mess with this if you want
    .translate([width_choropleth / 2, 210]);

// Create path with the projection
var path_choropleth = d3.geo.path()
    .projection(projection_choropleth);
//blue to red
// var colorScale_choropleth = d3.scale.linear().range(["#d1e5f0","#b2182b"]).interpolate(d3.interpolateLab);
//blue to darkorange
var colorScale_choropleth = d3.scale.linear().range(["#d1e5f0","rgb(247, 148, 29)"]).interpolate(d3.interpolateLab);
var countryById_choropleth = d3.map();

// ====================================================================
// Choropleth Map: Load the files in the queue
// ====================================================================

// we use queue because we have 2 data files to load.

queue()
    .defer(d3.json, "countries.json")
    .defer(d3.csv, "data/childMortality_2015.csv", typeAndSet) // process
    .await(loaded);


function typeAndSet(d) {
    d.mortality = +d.mortality;
    countryById_choropleth.set(d.ISO3, d);
    return d;
}

function getColor(d) {
    var dataRow_choropleth = countryById_choropleth.get(d.id);
    if (dataRow_choropleth) {
        // console.log(dataRow_choropleth);
        return colorScale_choropleth(dataRow_choropleth.mortality);
    } else {
        // console.log("no dataRow", d);
        return "#ffffff";
        // return "rgba(0, 0, 0, 0.7)";
    }
}

function getText(d) {
    var dataRow_choropleth = countryById_choropleth.get(d.id);
    if (dataRow_choropleth) {
        return "<strong>" + d.properties.name + "</strong>" + ": " + dataRow_choropleth.mortality;
    } else {
        console.log("no dataRow", d);
        return "<strong>" + d.properties.name + "</strong>" + ": No data.";
    }
}

function loaded(error, countries, mortalityRate) {

// needs to be in the same order as the queue
    console.log(countries);
    console.log(mortalityRate);
    // console.log(malaria);

    colorScale_choropleth.domain(d3.extent(mortalityRate, function(d) {return d.mortality;}));
    

    var countries_choropleth = topojson.feature(countries, countries.objects.units).features;

    svg_choropleth.selectAll('path_choropleth.countries')
        .data(countries_choropleth)
        .enter()
        .append('path')
        .attr('class', 'countries_choropleth')
        .attr('d', path_choropleth)
        // .on('mouseover', tip.show)
        // .on('mouseout', tip.hide)
        .attr('fill', function(d,i) {
            // console.log(d.properties.name);
            return getColor(d);
        })
        .call(d3.helper.tooltip_charts(
            function(d, i){
                return getText(d);
            })); //tooltip based in an example from Roger Veciana: http://bl.ocks.org/rveciana/5181105
        // .append("title")
        // .text(function(d) {
        //     return getText(d);
        // });
    

    var linear = colorScale_choropleth;

    svg_choropleth.append("g")
      .attr("class", "legendLinear_choropleth")
      .attr("transform", "translate(470,300)");

    var legendLinear_choropleth = d3.legend.color()
      .shapeWidth(30)
      .orient('horizontal')
      .scale(linear);

    svg_choropleth.select(".legendLinear_choropleth")
      .call(legendLinear_choropleth);

}


// ====================================================================
// Top 20 Javascript: Bar Chart Set Up
// ====================================================================

    var width_top20 = 250;
    var height_top20 = 550;

    // var format = d3.format(".1%");
    // Set up the svg

    var vis_top20 = d3.select("#vis_top20").append("svg");
    var svg_top20 = vis_top20
            .attr("width", width_top20+100)
            .attr("height", height_top20+100); // adding some random padding
        
        svg_top20.append("rect")
            .attr("width", "100%")
            .attr("height", "100%")
            .attr("fill", "none");

// ====================================================================
// Top 20 Javascript: Dot Plot Set Up
// ====================================================================

// this is the size of the svg container -- the white part
var fullwidth_dotplot = 500,
    fullheight_dotplot = 700;

// these are the margins around the graph. Axes labels go in margins.
var margin_dotplot = {top: 5, right: 50, bottom: 50, left: 150};


var width_dotplot = fullwidth_dotplot - margin_dotplot.left - margin_dotplot.right,
    height_dotplot = fullheight_dotplot - margin_dotplot.top - margin_dotplot.bottom;

var widthScale_dotplot = d3.scale.linear().range([ 0, width_dotplot]);
var heightScale_dotplot = d3.scale.ordinal().rangeRoundBands([ 0, height_dotplot], 0.2);    
var xAxis_dotplot = d3.svg.axis().scale(widthScale_dotplot).orient("bottom");
var yAxis_dotplot = d3.svg.axis()
                        .scale(heightScale_dotplot)
                        .orient("left")
                        .innerTickSize([0]);

var svg_dotplot = d3.select("#vis_dotplot")
                        .append("svg")
                        .attr("width", fullwidth_dotplot)
                        .attr("height", fullheight_dotplot);

var tooltip_scatter = d3.select("body")
                        .append("div")
                        .attr("class", "tooltip_scatter");


    d3.csv("data/barchart_calculate.csv", function(error, data_top20) {
        
        //Always do this first --> put into column and dataset. same
        var column_top20 = d3.select("#menu_top20 select").property("value");
        var dataset_top20 = top20_by_column(data_top20, column_top20);

        console.log(column_top20, dataset_top20);



        redrawDots(dataset_top20);
        redrawBar(dataset_top20, column_top20);


        //setup our UI -- requires access to data variable, so inside csv

        d3.select("#menu_top20 select")
            .on("change", function() {
                column_top20 = d3.select("#menu_top20 select").property("value");//TODO: How do you get the current value of the select menu?
                dataset_top20 = top20_by_column(data_top20, column_top20);
                //TODO: How do you get the current filter/storted data?
                console.log(column_top20, dataset_top20);
                redrawDots(dataset_top20);
                redrawBar(dataset_top20, column_top20);

        });

    }) // end csv

    //make the bars for the first data set.  They will be red at first  
    
    function top20_by_column(data, column) {

            return data.sort(function(a, b) {
            // return b[column] - a[column]; //descending order, biggest at the top!
            // return b.value - a.value;
            return b[column] - a[column];
        }).slice(0, 20);
        // TODO: fill in this function.  The answer direction is in the wiki page for week8.
        // You want to sort the data by the column, descending order, and then slice.

        }  
    // This function is used to draw and update the data. It takes different data each time.

    function redrawBar(data, column) {

        var max_top20 = d3.max(data, function(d) {return +d[column];});
        // always reset the domains when you call data
        // right up above. Find max.
        xScale_top20 = d3.scale.linear()
            .domain([0, max_top20])
            // .domain([0, d3.max(data, function(d) {return +d[column];});])//TODO: what goes here?
            .range([0, width_top20]);

        // console.log("domain: ", xScale_top20.domain());

        yScale_top20 = d3.scale.ordinal()
            .domain(d3.range(data.length))
            .rangeBands([0, height_top20], .2);

    // key would be country (dont forget it's captialized) return d.Country
        var bars_top20 = vis_top20.selectAll("rect.bars_top20")
            .data(data, function (d) { return d.Country;});//TODO: what is your key value? // key function!

    //update -- existing bars get turned into darker orange when we "redraw". We don't change labels. 
        bars_top20
            .attr("fill", function (d) {
                // if (d.Country == "Malawi" || d.Country == "Niger")
                if (d.Country == "Malawi")
                    return "rgba(0,153,255, 1)"; //cyan
                else
                    return "rgba(247,148,29,1)"}); //orange
            

        //enter - NEW bars get set to darkorange when we "redraw."
        bars_top20.enter()
            .append("rect")
            .attr("class", "bars_top20")
            .attr("fill", function (d) {
                // if (d.Country == "Malawi" || d.Country == "Niger")
                if (d.Country == "Malawi")
                    return "rgba(0,153,255, 1)"; //cyan
                else
                    return "rgba(247,148,29,0.5)"}); // lighter orange           





        // transition -- move the bars to proper widths and location
        // grow bar to size. of Xscale
        // height -- look back at how the barchart is built using scale. ordinal bar height.
        bars_top20
            .transition()
            .duration(300)
            .ease("quad")
            .attr("width", function(d) {
                return xScale_top20(+d[column]);
                //TODO: what goes here?);
            })
            .attr("height", yScale_top20.rangeBand())//TODO: In an ordinal scale bar chart, what goes here?)
            .attr("transform", function(d,i) {
                return "translate(" + [0, yScale_top20(i)] + ")"
            });


        //exit -- remove ones that aren't in the index set; not in the new dataset
        bars_top20.exit()
            .transition()
            .duration(300)
            .ease("exp")
            .attr("width", 0)
            .remove();
        //  We are attaching the labels separately, not in a group with the bars...


        // label is country return d.Country
        var labels_top20 = svg_top20.selectAll("text.labels_top20")
            .data(data, function (d) { return d.Country; });//TODO: what is your key here? same as above. // key function!            

        // everything gets a class and a text field.  But we assign attributes in the transition.
        labels_top20.enter()
            .append("text")
            .attr("class", "labels_top20");

        labels_top20.exit()
            .remove();

    // Figure out what we're formatting. Format is at the top, a percentage
        labels_top20.transition()
            .duration(500)//TODO: How long do you want this to last?)
            .text(function(d) {

                // if (d.Country == "Malawi" && column == "PercentChange") {
                //     return "************ " + "MALAWI" + " " +(+d[column]) + "%";
                // }
                // else if (d.Country == "Malawi") {
                //     return "************ " + "MALAWI" + " " +(+d[column]);
                // }

                // else if (d.Country == "Niger" && column == "PercentChange") {
                //     return "************ " + "NIGER" + " " +(+d[column]) + "%";
                // }
                // else if (d.Country == "Niger") {
                //     return "************ " + "NIGER" + " " +(+d[column]);
                // }

                if (column == "PercentChange"){
                    return d.Country + " " + (+d[column]) + "%";
                }

                else return d.Country + " " + (+d[column]);
                //TODO: what goes here?
            })
            .attr("transform", function(d,i) {
                    return "translate(" + xScale_top20(+d[column]) + "," + yScale_top20(i) + ")"
            })
            .attr("dy", "1.2em")
            .attr("dx", "-3px")
            .attr("text-anchor", "end");


        } // end of draw function            

// ====================================================================
// Top 20 Javascript: Dot Plot
// ====================================================================
function redrawDots(data){
// d3.csv("data/barchart_calculate.csv", function(error, data) {
        // if (error) {
        //         console.log("error reading file");
        //     }

        // data.sort(function(a, b) {
        //         return d3.descending(+a.Year2015, +b.Year2015);
        //     });
        //     // in this case, i know it's out of 100 because it's percents.
            // widthScale_dotplot.domain([ 0, d3.max(data, function(d) {
            //             return +d.Year1990;
            //         }) ]);
            // js map: will make a new array out of all the d.name fields
            // heightScale_dotplot.domain(data.map(function(d) { return d.Country; } ));

            // Make the faint lines from y labels to highest dot


    heightScale_dotplot.domain(data.map(function(d) { return d.Country; } ));


    widthScale_dotplot.domain([ 0, d3.max(data, function(d) {
                    return +d.Year1990;
                }) ]);

    var linesGrid_dotplot = svg_dotplot.selectAll("lines.grid_dotplot")
                                .data(data, function (d) {return d.Country;});
        


    linesGrid_dotplot.enter()
            .append("line")
            .attr("class", "grid_dotplot")
            .attr("x1", margin_dotplot.left)                        
            .attr("y1", function(d) {
                return heightScale_dotplot(d.Country) + heightScale_dotplot.rangeBand();
            })
            .attr("x2", function(d) {
                return margin_dotplot.left + widthScale_dotplot(+d.Year2015);

            })
            .attr("y2", function(d) {
                return heightScale_dotplot(d.Country) + heightScale_dotplot.rangeBand();
            });

    //move the lines to proper widths and location
    // grow lines to size


    linesGrid_dotplot
        .transition()
        .duration(300)
        .ease("quad")
        .attr("x1", margin_dotplot.left)                        
        .attr("y1", function(d) {
            return heightScale_dotplot(d.Country) + heightScale_dotplot.rangeBand();
        })
        .attr("x2", function(d) {
            return margin_dotplot.left + widthScale_dotplot(+d.Year2015);

        })
        .attr("y2", function(d) {
            return heightScale_dotplot(d.Country) + heightScale_dotplot.rangeBand();
        });



        linesGrid_dotplot.exit()
            .transition()
            .duration(300)
            .ease("exp")
            .style("opacity", 0)
            .style("stroke-width", 0)
            .remove();


        // Make the dotted lines between the dots

        var linesBetween_dotplot = svg_dotplot.selectAll("line.between_dotplot")
                                .data(data, function(d) {
                                    return d.Country;
                                });
        linesBetween_dotplot
            .enter()
            .append("line")
            .attr("class", "between_dotplot");
            // .attr("x1", function(d) {
            //     return margin_dotplot.left + widthScale_dotplot(+d.Year1990);
            // })
            // .attr("y1", function(d) {
            //     return heightScale_dotplot(d.Country) + heightScale_dotplot.rangeBand()/2;
            // })
            // .attr("x2", function(d) {
            //     return margin_dotplot.left + widthScale_dotplot(d.Year2015);
            // })
            // .attr("y2", function(d) {
            //     return heightScale_dotplot(d.Country) + heightScale_dotplot.rangeBand()/2;
            // })
            // .attr("stroke-dasharray", "5,5")
            // .attr("stroke-width", function(d, i) {
            //     if (d.Country == "Malawi") {
            //         return "1";
            //     } else {
            //         return "0.5";
            //     }
            // });

        linesBetween_dotplot
            .exit()
            // .transition()
            // .duration(500)
            // .style("opacity", 0)
            // .attr("stroke-width", 0)
            .remove();

        linesBetween_dotplot
            // .transition()
            // .duration(500)
            // .attr("class", "between_dotplot")
            .attr("x1", function(d) {
                return margin_dotplot.left + widthScale_dotplot(+d.Year1990);
            })
            .attr("y1", function(d) {
                return heightScale_dotplot(d.Country) + heightScale_dotplot.rangeBand()/2;
            })
            .attr("x2", function(d) {
                return margin_dotplot.left + widthScale_dotplot(d.Year2015);
            })
            .attr("y2", function(d) {
                return heightScale_dotplot(d.Country) + heightScale_dotplot.rangeBand()/2;
            })
            .attr("stroke-dasharray", "5,5")
            .attr("stroke-width", function(d, i) {
                if (d.Country == "Malawi") {
                    return "1";
                } else {
                    return "0.5";
                }
            });




                        // Make the dots for 1990

        var dots1990 = svg_dotplot.selectAll("circle.y1990")
                            .data(data, function(d){
                                return d.Country;
                            });


        dots1990
            .enter()
            .append("circle")
            .attr("class", "y1990")
            .attr("cx", function(d) {
                return margin_dotplot.left + widthScale_dotplot(+d.Year1990);
            })
            .attr("r", heightScale_dotplot.rangeBand()/4)
            .attr("cy", function(d) {
                return heightScale_dotplot(d.Country) + heightScale_dotplot.rangeBand()/2;
            })
            .style("stroke", function(d){
                if (d.Country === "Malawi") {
                    return "#030C22";
                }
            })
            .style("stroke-width", "0.75")
            .style("fill", function(d){
                if (d.Country === "Malawi") {
                    return "darkorange";
                }
            });

        dots1990
            .transition()
            .duration(300)
            .attr("cx", function(d) {
                return margin_dotplot.left + widthScale_dotplot(+d.Year1990);
            })
            .attr("r", heightScale_dotplot.rangeBand()/4)
            .attr("cy", function(d) {
                return heightScale_dotplot(d.Country) + heightScale_dotplot.rangeBand()/2;
            })
            .style("stroke", function(d){
                if (d.Country === "Malawi") {
                    return "#030C22";
                }
            })
            .style("stroke-width", "0.75")
            .style("fill", function(d){
                if (d.Country === "Malawi") {
                    return "darkorange";
                }
            });

        dots1990
            .exit()
            .transition()
            .duration(500)
            .style("opacity", 0)
            .remove();

            // Make the dots for 2013

        var dots2015 = svg_dotplot.selectAll("circle.y2015")
                            .data(data, function(d) {return d.Country;});
                            

        dots2015
            .enter()
            .append("circle")
            .attr("class", "y2015")
            .attr("cx", function(d) {
                return margin_dotplot.left + widthScale_dotplot(+d.Year2015);
            })
            .attr("r", heightScale_dotplot.rangeBand()/4)
            .attr("cy", function(d) {
                return heightScale_dotplot(d.Country) + heightScale_dotplot.rangeBand()/2;
            })
            .style("stroke", function(d){
                if (d.Country === "Malawi") {
                    return "#030C22";
                }
            })
            .style("stroke-width", "0.75")
            .style("fill", function(d){
                if (d.Country === "Malawi") {
                    return "#476BB2";
                }
            });

        dots2015
            .transition()
            .duration(500)
            .attr("class", "y2015")
            .attr("cx", function(d) {
                return margin_dotplot.left + widthScale_dotplot(+d.Year2015);
            })
            .attr("r", heightScale_dotplot.rangeBand()/4)
            .attr("cy", function(d) {
                return heightScale_dotplot(d.Country) + heightScale_dotplot.rangeBand()/2;
            })
            .style("stroke", function(d){
                if (d.Country === "Malawi") {
                    return "#030C22";
                }
            })
            .style("stroke-width", "0.75")
            .style("fill", function(d){
                if (d.Country === "Malawi") {
                    return "#476BB2";
                }
            });

            dots2015
                .exit()
                .transition()
                .duration(500)
                .style("opacity", 0)
                .remove();

            // add the axes

            svg_dotplot.append("g")
                        .attr("class", "x_dotplot axis_dotplot")
                        .attr("transform", "translate(" + margin_dotplot.left + "," + height_dotplot + ")")
                        .call(xAxis_dotplot);


            // var labels_dotplot = svg_dotplot.selectAll("text.labels_dotplot")
            //     .data(data, function (d) {
            //         return d.Country;
            //     });

            // labels_dotplot.enter()
            //     .append("text")
            //     .attr("class", "labels_dotplot");

            // labels_dotplot.exit()
            //     .remove();

            // labels_dotplot.transition()
            //     .duration(500)
                // .text(function(d) {
                //     return d.Country
                // })
                // .attr("class", "y_dotplot axis_dotplot")
                // .attr("transform", function(d,i) {
                //     "translate(" + margin_dotplot.left + "," + yScale_top20(i) + ")"})
                // .attr("dy", "1.2em")
                // .attr("dx", "-3px")
                // .attr("text-anchor", "end");


            var labels_dotplot = svg_dotplot.selectAll("g.labels_dotplot")
                .data(data, function (d) {
                    return d.Country;
                });

            labels_dotplot.enter()
                .append("g")
                .attr("class", "labels_dotplot y_dotplot axis_dotplot")
                .attr("transform", "translate(" + margin_dotplot.left + ",0)")
                .call(yAxis_dotplot);
            



            labels_dotplot.transition()
                .duration(500)             
                .attr("transform", "translate(" + margin_dotplot.left + ",0)")
                .call(yAxis_dotplot);

            labels_dotplot.exit()
                .remove();



            // labels
            // var labels_dotplot = svg_dotplot.selectAll("g.labels_dotplot")
            //     .data(data, function (d) {
            //         return d.Country;
            //     })

            // labels_dotplot.enter()
            //     .append("g")
            //     .attr("class", "labels_dotplot");

            // labels_dotplot
            //     .transition()
            //     .duration(500)
            //     .attr("class", "y_dotplot axis_dotplot")
            //     .attr("transform", "translate(" + margin_dotplot.left + ",0)")
            //     .call(yAxis_dotplot);

            labels_dotplot.exit()
                .attr("fill", "#ffffff")
                .remove();

            // svg_dotplot.append("g")
            // .attr("class", "y_dotplot axis_dotplot")
            // .attr("transform", "translate(" + margin_dotplot.left + ",0)")
            // .call(yAxis_dotplot);
            // svg_dotplot.append("text")
            // .attr("class", "xlabel_dotplot")
            // .attr("transform", "translate(" + (margin_dotplot.left + width_dotplot / 2) + " ," +
            //     (height_dotplot + margin_dotplot.bottom) + ")")
            // .style("text-anchor", "middle")
            // .text("Child Mortality Rate per 1,000 live births");
            
            // svg_dotplot.append("text")
            //     .attr("class", "ylabel_dotplot")
            //     .attr("transform", "rotate(-90)")
            //     .attr("y", 100)
            //     .attr("x", 0 - (height_dotplot / 2))
            //     .style("text-anchor", "end")
            //     .text("Country");

    // });
}

// ====================================================================
// Scatterplot
// ====================================================================

    var width_scatter = 600;
    var height_scatter = 500;

    var margin_scatter = { top: 20, right: 10, bottom: 20, left: 100 };

    var dotRadius_scatter = 4; 
        //setup the svg
    var xScale_scatter = d3.scale.linear()
                        .range([ margin_scatter.left, width_scatter])
                        .domain([-1, 100]);

    var xAxis_scatter = d3.svg.axis()
                    .scale(xScale_scatter)
                    .orient("bottom")
                    .ticks(10);

    var yScale_scatter = d3.scale.linear()
                    .range([ height_scatter - margin_scatter.bottom, margin_scatter.top ])
                    .domain([-1, 100]);

    var yAxis_scatter = d3.svg.axis()
                    .scale(yScale_scatter)
                    .orient("left");

    var vis_scatter = d3.select("#vis_scatter").append("svg").attr("class", "vis_scatter"); 
// Add svg to the div#chart already in the html.
// Create dimensions of svg
    var svg_scatter = vis_scatter
            .attr("width", width_scatter+200)
            .attr("height", height_scatter+100); // adding some random padding
// ===================================================================
// Adding the Axes
// ===================================================================
        svg_scatter.append("g")
                    .attr("class", "x_scatter axis_scatter")
                    .attr("transform", "translate(0," + (height_scatter - margin_scatter.bottom) + ")")
                    .call(xAxis_scatter);

        svg_scatter.append("g")
                    .attr("class", "y_scatter axis_scatter")
                    .attr("transform", "translate(" + (margin_scatter.left) + ",0)")
                    .call(yAxis_scatter);

        //Add the axes labels:
        svg_scatter.append("text")
            .attr("class", "xlabel_scatter")
            .attr("transform", "translate(" + (margin_scatter.left + width_scatter / 2) + " ," +
                (height_scatter + margin_scatter.bottom) + ")")
            .style("text-anchor", "middle")
            .text("Improved water source, rural (% of rural population with access)");
        
        svg_scatter.append("text")
                .attr("class", "ylabel_scatter")
                .attr("transform", "rotate(-90)")
                .attr("y", 50)
                .attr("x", 0 - (height_scatter / 2))
                .style("text-anchor", "end")
                .text("Under-Five Mortality Rate");
        //setup our ui buttons:

        
queue()
    .defer(d3.csv, "data/scatter1990.csv")
    .defer(d3.csv, "data/scatter2015.csv") // process
    .await(loaded_scatter);

// var curSelection_scatter = button.attr('id');
var curSelection_scatter = $("button").click(function() {
                                this.id; // or alert($(this).attr('id'));
                            });

    function loaded_scatter(error, data1990, data2015) {

        console.log("data1990", data1990);
        console.log("data2015", data2015);

        

        d3.select("#data1990")
            .on("click", function(d,i) {
                d3.select("button#data2015").classed("selected", false);
                d3.select("button#data1990").classed("selected", true);
                curSelection_scatter = "data1990";
                redrawScatter(data1990, curSelection_scatter); 
            });

        d3.select("#data2015")
            .on("click", function(d,i) {
                
                d3.select("button#data1990").classed("selected", false);
                d3.select("button#data2015").classed("selected", true);
                vcurSelection_scatter = "data2015";
                redrawScatter(data2015, curSelection_scatter);
            });
        d3.select("button#data1990").classed("selected", true);
        redrawScatter(data1990, curSelection_scatter);

        
    
    } // end of d3.csv


        
        //make the dots

        //TODO: make the button for data1 look selected when the page loads.



    // This function is used to draw and update the data. It takes different data each time.

   
    // function filter() {
    // // Handle the menu change -- filter the data set if needed, rerender:


    // }
var tooltip_scatter = d3.select("body")
                        .append("div")
                        .attr("class", "tooltip_scatter");

    function redrawScatter(data, curSelection_scatter) {

        //TODO: Fill this in with scatter plot enter/update/exit stuff including transitions.
        // Include axes that transition.
        xScale_scatter.domain([
                d3.min(data, function(d) {
                return +d.water;
            }) - 2,
            d3.max(data, function (d) {
                return +d.water;
            }) + 2
        ]);

            yScale_scatter.domain([
                d3.min(data, function(d) {
                return +d.childMortality;
            }) - 2,
            d3.max(data, function (d) {
                return +d.childMortality;
            }) + 2
        ]);


        var circles_scatter = svg_scatter.selectAll("circle")
                            .data(data, function(d) {return d.Country;}); // key function!
                    // enter and create new ones if needed
        circles_scatter
                .enter()
                .append("circle")
                 // this section is to fix some of the animation direction problems
                .attr("cx", function (d) {
                    if (curSelection_scatter == "data1990") {
                        // return width_scatter - margin_scatter.right;
                        return margin_scatter.left;
                    }
                    else if (curSelection_scatter == "data2015") {
                        return margin_scatter.left;
                    }
                })
                .attr("cy", function (d) {
                    if (curSelection_scatter == "data1990") {
                        return height_scatter - margin_scatter.bottom;
                    }
                    else if (curSelection_scatter == "data2015") {
                        return height_scatter - margin_scatter.bottom;
                        // return height_scatter;
                    }
                })  // 
                .attr("class", "dots_scatter")
                .attr("fill", function (d) {
                    // if (d.Country == "Malawi" || d.Country == "Niger"){
                    if (d.Country == "Malawi"){
                        return "rgb(0,153,255)";
                    }
                    else return "darkorange";
                });

                        // transition of them
        circles_scatter
            .transition()
            .duration(2000)
            .attr("cx", function(d) {
                return xScale_scatter(+d.water);
                // return the value to use for your x scale here
            })
            .attr("cy", function(d) {
                return yScale_scatter(+d.childMortality);
            })
            .attr("r", function() {
                return dotRadius_scatter;
            });
            // fade out the ones that aren't in the current data set
        
        circles_scatter
            .exit()
            .transition()
            .duration(1000)
            .style("opacity", 0)
            .remove();


            // Update the axes - also animated. this is really easy.
        svg_scatter.select(".x_scatter.axis_scatter")
              .transition()
              .duration(1000)
              .call(xAxis_scatter);

        // Update Y Axis
        svg_scatter.select(".y_scatter.axis_scatter")
            .transition()
            .duration(1000)
            .call(yAxis_scatter);

            //filter out the data for only Niger and Malawi
        data = data.filter(function(d) {
            // if (d.Country == "Malawi" || d.Country == "Niger"){
            if (d.Country == "Malawi"){
                return d.Country;
            }
        });
// join --- not a filter
        var labels_scatter = svg_scatter.selectAll("text.dotlabels_scatter")
            .data(data, function(d) {
                return d.Country;
        });







// label the dots if you're only showing 10.
// if (curSelection !== "all") {

    // data join with a key



                    // enter and create any news ones we need. Put minimal stuff here.
                    // Creates all of them
                    labels_scatter

                            .enter()
                            .append("text")
                            .attr("class", "dotlabels_scatter")
                            .style("opacity", 0)
                            .text(function(d) {return d.Country});

                            // transition them.
                    labels_scatter.exit().remove();


                    labels_scatter.transition()
                        .duration(2000)
                        .style("opacity", 1)
                            .attr("transform", function(d) {
                             return "translate(" + xScale_scatter(+d.water) + "," + yScale_scatter(+d.childMortality) + ")";
                            })
                            .attr({
                                "dx": "4px",
                                "dy": "-5px"
                            })
                            .attr("class", "dotlabels_scatter");

                        // remove ones that we don't have now
                     // these could have a transition too...

            // } else {
            //     // if we're showing "all countries" - fade out any labels.

            //     svg.selectAll("text.dotlabels")
            //     .transition()
            //     .duration(1000)
            //     .style("opacity", 0)
            //     .remove();

            // }

            circles_scatter.on("mouseover", mouseoverFunc_scatter)
                .on("mousemove", mousemoveFunc_scatter)
                .on("mouseout", mouseoutFunc_scatter);


            function mouseoutFunc_scatter() {
                // d3.select(this)
                //     .transition()
                //     .style("opacity", 0)
                //     .attr("r", 1);
                // d3.selectAll("path.line_scrolly").classed("unhighlight_scrolly", true).classed("highlight_scrolly", false);
                tooltip_scatter.style("display", "none"); // this sets it to invisible!
            }

            function mouseoverFunc_scatter(d) {

                // d3.selectAll("path.line_scrolly").classed("unhighlight_scrolly", true);
                // below code sets the sub saharan africa countries out even more - they only go "unfocused" if a sub saharan country is selected. Otherwise, they remain at the regular opacity. I experiemented with this because I do want to focus on the ssAfrica countries rather than any others (so they are only "unfocused" against each other, not to other countries... This way all other countries are always compared to the ssAfrica ones... but not sure if this method is effective).
                //         if(!d3.select(this).select("path.line").classed("ssAfrica")) {
                //             d3.selectAll("path.ssAfrica").classed("unfocused", false);
                //         }

                // d3.select(this).select("path.line_scrolly").classed("unhighlight_scrolly", false).classed("highlight_scrolly", true);
                // d3.select(this)
                //     .transition()
                //     .duration(50)
                //     .style("opacity", 1)
                //     .attr("r", 4);


                tooltip_scatter
                    .style("display", null) // this removes the display none setting from it
                    .html("<p><span class='tooltipHeader_scatter'>" + 
                        "<span class='cyan-bold'>" + "Country: " + "</span>" + d.Country + 
                        "<span class='cyan-bold'>" +"<br>Under-Five Mortality Rate: " 
                        + "</span>" + d.childMortality +
                        "<span class='cyan-bold'>" + "<br>Improved Water: " + "</span>" 
                        + d.water +
                        "%</span></p>");
            }

            function mousemoveFunc_scatter(d) {
                // console.log("events", window.event, d3.event);
                tooltip_scatter
                    .style("top", (d3.event.pageY - 45) + "px")
                    .style("left", (d3.event.pageX + 5) + "px");
            }

        } // end of draw function