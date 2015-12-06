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

var colorScale_choropleth = d3.scale.linear().range(["#d1e5f0","#b2182b"]).interpolate(d3.interpolateLab);

var countryById_choropleth = d3.map();

// ====================================================================
// Choropleth Map: Load the files in the queue
// ====================================================================

// we use queue because we have 2 data files to load.

queue()
    .defer(d3.json, "countries.json")
    .defer(d3.csv, "childMortality_2015.csv", typeAndSet) // process
    .await(loaded);


function typeAndSet(d) {
    d.mortality = +d.mortality;
    countryById_choropleth.set(d.ISO3, d);
    return d;
}

function getColor(d) {
    var dataRow_choropleth = countryById_choropleth.get(d.id);
    if (dataRow_choropleth) {
        console.log(dataRow_choropleth);
        return colorScale_choropleth(dataRow_choropleth.mortality);
    } else {
        console.log("no dataRow", d);
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
            console.log(d.properties.name);
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
// Line Graph
// ====================================================================

var margin_stepper = {
    top: 50,
    right: 10,
    bottom: 70,
    left: 70
};

var width_stepper = 650;
var height_stepper = $(window).height() * .85;

//Set up date formatting and years
var dateFormat = d3.time.format("%Y");

//Set up scales
var xScale_stepper = d3.time.scale()
    .range([margin_stepper.left, width_stepper - margin_stepper.right - margin_stepper.left]);

var yScale_stepper = d3.scale.sqrt()
    .range([margin_stepper.top, height_stepper - margin_stepper.bottom]);

//Configure axis generators
var xAxis_stepper = d3.svg.axis()
    .scale(xScale_stepper)
    .orient("bottom")
    .ticks(15)
    .tickFormat(function (d) {
        return dateFormat(d);
    })
    .innerTickSize([0]);

var yAxis_stepper = d3.svg.axis()
    .scale(yScale_stepper)
    .orient("left")
    .innerTickSize([0]);
       
// add a tooltip to the page - not to the svg itself!
var tooltip_stepper = d3.select("body")
    .append("div")
    .attr("class", "tooltip_stepper");

//Configure line generator
// each line dataset must have a d.year and a d.rate for this to work.
var line_stepper = d3.svg.line()
    .x(function (d) {
        return xScale_stepper(dateFormat.parse(d.year));
    })
    .y(function (d) {
        return yScale_stepper(+d.rate);
    });
//Create the empty SVG image
var svg_stepper = d3.select("#vis_stepper")
    .append("svg")
    .attr("width", width_stepper)
    .attr("height", height_stepper);

/*======================================================================
   Creating the Multiple Lines from the Data
 ======================================================================*/

 d3.csv("U5MRwithWorld.csv", function (data) {

    var years_stepper = d3.keys(data[0]).slice(0, 26); //
    console.log(years_stepper);

    //Create a new, empty array to hold our restructured dataset
    var dataset_stepper = [];

    //Loop once for each row in data
    data.forEach(function (d, i) {

        var IMRs = [];

        years_stepper.forEach(function (y) { //Loop through all the years - and get the rates for this data element


            if (d[y]) { /// What we are checking is if the "y" value - the year string from our array, which would translate to a column in our csv file - is empty or not.

                IMRs.push({ //Add a new object to the new rates data array - for year, rate. These are OBJECTS that we are pushing onto the array
                    year: y,
                    rate: d[y], // this is the value for, for example, d["2004"]
                    Country: d.Country
                });
            }

        });

        dataset_stepper.push({ // At this point we are accessing one index of data from our original csv "data", above and we have created an array of year and rate data from this index. We then create a new object with the Country value from this index and the array that we have made from this index.
            country: d.Country,
            rates: IMRs // we just built this from the current index.
        });

    });

    console.log("data", data);

    console.log("restructured data", dataset_stepper);

    //Set scale domains - max and min of the years
    xScale_stepper.domain(
        d3.extent(years_stepper, function (d) {
            return dateFormat.parse(d);
        }));

    // max of rates to 0 (reversed, remember)
    yScale_stepper.domain([
        d3.max(dataset_stepper, function (d) {
            return d3.max(d.rates, function (d) {
                return +d.rate;
            });
        }),
        0
    ]);

    //Make a group for each country
    var groups_stepper = svg_stepper.selectAll("g.lines_stepper")
        .data(dataset_stepper)
        .enter()
        .append("g")
        .attr("class", "lines_stepper");

    //Within each group, create a new line/path,
    //binding just the rates data to each one

    groups_stepper.selectAll("path.line_stepper")
        .data(function (d) { // because there's a group with data already...
            return [d.rates]; // it has to be an array for the line function
        })
        .enter()
        .append("path")
        .attr("class", "line_stepper")
        .attr("d", line_stepper);

/*======================================================================
  Adding the Axes
======================================================================*/
    svg_stepper.append("g")
        .attr("class", "x axis_stepper")
        .attr("transform", "translate(0," + (height_stepper - margin_stepper.bottom) + ")")
        .call(xAxis_stepper)
        .append("text")
        .attr("x", width_stepper - margin_stepper.left - margin_stepper.right)
        .attr("y", margin_stepper.bottom / 3)
        .attr("dy", "1em")
        .style("text-anchor", "end")
        .attr("class", "label_stepper")
        .text("Year");

    svg_stepper.append("g")
        .attr("class", "y axis_stepper")
        .attr("transform", "translate(" + margin_stepper.left + ",0)")
        .call(yAxis_stepper)
        .append("text")
        .attr("transform", "rotate(-90)")
        .attr("x", -margin_stepper.top)
        .attr("y", -2*margin_stepper.left / 3)
        .attr("dy", "1em")
        .style("text-anchor", "end")
        .attr("class", "ylabel_stepper")
        .text("Under 5 Mortality Rate");

    /*======================================================================
      Mouse Functions
    ======================================================================*/
    d3.selectAll("g.lines_stepper")
        .on("mouseover", mouseoverFunc_stepper)
        .on("mouseout", mouseoutFunc_stepper)
        .on("mousemove", mousemoveFunc_stepper);

    function mouseoutFunc_stepper() {

        d3.selectAll("path.line_stepper").classed("unfocused", false).classed("focused", false);
        tooltip_stepper.style("display", "none"); // this sets it to invisible!
    }

    function mouseoverFunc_stepper(d) {

        d3.selectAll("path.line_stepper").classed("unfocused", true);
        // below code sets the sub saharan africa countries out even more - they only go "unfocused" if a sub saharan country is selected. Otherwise, they remain at the regular opacity. I experiemented with this because I do want to focus on the ssAfrica countries rather than any others (so they are only "unfocused" against each other, not to other countries... This way all other countries are always compared to the ssAfrica ones... but not sure if this method is effective).
        //         if(!d3.select(this).select("path.line").classed("ssAfrica")) {
        //             d3.selectAll("path.ssAfrica").classed("unfocused", false);
        //         }

        d3.select(this).select("path.line_stepper").classed("unfocused", false).classed("focused", true);
        tooltip_stepper
            .style("display", null) // this removes the display none setting from it
            .html("<p><span class='tooltipHeader sans'>" + d.country + "</span></p>");
    }

    function mousemoveFunc_stepper(d) {
        console.log("events", window.event, d3.event);
        tooltip_stepper
            .style("top", (d3.event.pageY - 45) + "px")
            .style("left", (d3.event.pageX + 5) + "px");
    }



}); // end of data csv

// ====================================================================
// Top 20 Javascript
// ====================================================================

    var width_top20 = 400;
    var height_top20 = 500;

    var format = d3.format(".1%");
    // Set up the svg

    var vis_top20 = d3.select("#vis_top20").append("svg");
    var svg_top20 = vis_top20
            .attr("width", width_top20+100)
            .attr("height", height_top20+100); // adding some random padding
        svg_top20.append("rect")
            .attr("width", "100%")
            .attr("height", "100%")
            .attr("fill", "none");

    d3.csv("barchart_calculate.csv", function(error, data_top20) {
        //Always do this first --> put into column and dataset. same
        var column_top20 = d3.select("#menu_top20 select").property("value");
        var dataset_top20 = top20_by_column(data_top20, column_top20);

        console.log(column_top20, dataset_top20);

        redraw(dataset_top20, column_top20);

        //setup our UI -- requires access to data variable, so inside csv

        d3.select("#menu_top20 select")
            .on("change", function() {
                column_top20 = d3.select("#menu_top20 select").property("value");//TODO: How do you get the current value of the select menu?
                dataset_top20 = top20_by_column(data_top20, column_top20);
                //TODO: How do you get the current filter/storted data?
                console.log(column_top20, dataset_top20);
                redraw(dataset_top20, column_top20);
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

    function redraw(data, column) {

        var max_top20 = d3.max(data, function(d) {return +d[column];});
        // always reset the domains when you call data
        // right up above. Find max.
        xScale_top20 = d3.scale.linear()
            .domain([0, max_top20])
            // .domain([0, d3.max(data, function(d) {return +d[column];});])//TODO: what goes here?
            .range([0, width_top20]);

        yScale_top20 = d3.scale.ordinal()
            .domain(d3.range(data.length))
            .rangeBands([0, height_top20], .2);
    // key would be country (dont forget it's captialized) return d.Country
        var bars_top20 = vis_top20.selectAll("rect.bars_top20")
            .data(data, function (d) { return d.Country;});//TODO: what is your key value? // key function!

    //update -- existing bars get blue when we "redraw". We don't change labels. 
        bars_top20
            .attr("fill", "steelblue");

        //enter - NEW bars get set to darkorange when we "redraw."
        bars_top20.enter()
            .append("rect")
            .attr("class", "bars_top20")
            .attr("fill", "darkorange");

        //exit -- remove ones that aren't in the index set; not in the new dataset
        bars_top20.exit()
            .transition()
            .duration(300)
            .ease("exp")
            .attr("width", 0)
            .remove();        

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

                if (d.Country == "Malawi") {
                    return "************ " + "MALAWI" + " " +(+d[column]) + " ************";
                }
                if (d.Country == "Malawi" && column == "PercentChange") {
                    return "************ " + "MALAWI" + " " +(+d[column]) + "% ************";
                }
                if (d.Country == "Niger") {
                    return "************ " + "NIGER" + " " +(+d[column]) + " ************";
                }
                if (d.Country == "Niger" && column == "PercentChange") {
                    return "************ " + "NIGER" + " " +(+d[column]) + "% ************";
                }
                else if (column == "PercentChange"){
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