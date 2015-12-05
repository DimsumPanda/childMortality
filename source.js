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