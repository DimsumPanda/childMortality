

var margin_scrolly = {
top: 50,
right: 10,
bottom: 70,
left: 70
};

var width_scrolly = 600;
var height_scrolly = 500;

//Set up date formatting and years
var dateFormat_scrolly = d3.time.format("%Y");

//Set up scales
var xScale_scrolly = d3.time.scale()
.range([margin_scrolly.left, width_scrolly - margin_scrolly.right - margin_scrolly.left]);

var yScale_scrolly = d3.scale.sqrt()
.range([margin_scrolly.top, height_scrolly - margin_scrolly.bottom]);

//Configure axis generators
var xAxis_scrolly = d3.svg.axis()
.scale(xScale_scrolly)
.orient("bottom")
.ticks(15)
.tickFormat(function (d) {
    return dateFormat_scrolly(d);
})
.innerTickSize(0);

var yAxis_scrolly = d3.svg.axis()
.scale(yScale_scrolly)
.orient("left")
.innerTickSize(0);

//Configure line generator
// each line dataset must have a d.year and a d.rate for this to work.
var line_scrolly = d3.svg.line()
.x(function (d) {
    return xScale_scrolly(dateFormat_scrolly.parse(d.year));
})
.y(function (d) {
    return yScale_scrolly(+d.rate);
});


//Create the empty SVG image
var svg_scrolly = d3.select("#vis_scrolly")
.append("svg")
.attr("width", width_scrolly)
.attr("height", height_scrolly);

// Add axes

svg_scrolly.append("g")
    .attr("class", "x_scrolly axis_scrolly")
    .attr("transform", "translate(0," + (height_scrolly - margin_scrolly.bottom) + ")")
    .call(xAxis_scrolly)
    .append("text")
    .attr("x", width_scrolly - margin_scrolly.left - margin_scrolly.right)
    .attr("y", margin_scrolly.bottom / 3)
    .attr("dy", "1em")
    .style("text-anchor", "end")
    .attr("class", "label_scrolly")
    .text("Year");

svg_scrolly.append("g")
    .attr("class", "y_scrolly axis_scrolly")
    .attr("transform", "translate(" + margin_scrolly.left + ",0)")
    .call(yAxis_scrolly)
    .append("text")
    .attr("transform", "rotate(-90)")
    .attr("x", -margin_scrolly.top)
    .attr("y", -2*margin_scrolly.left / 3)
    .attr("dy", "1em")
    .style("text-anchor", "end")
    .attr("class", "label_scrolly")
    .text("Under 5 Mortality Rate");

var years_scrolly = [];

function make_data_scrolly(rawdata) {

    years_scrolly = d3.keys(rawdata[0]).slice(1, 65);
    console.log(years_scrolly);

    //Create a new, empty array to hold our restructured dataset
    var dataset = [];

    //Loop once for each row in data
    rawdata.forEach(function (d, i) {

        var IMRs = [];

        years_scrolly.forEach(function (y) { //Loop through all the years - and get the rates for this data element

            if (d[y]) { /// What we are checking is if the "y" value - the year string from our array, which would translate to a column in our csv file - is empty or not.

                IMRs.push({ //Add a new object to the new rates data array - for year, rate. These are OBJECTS that we are pushing onto the array
                    year: y,
                    rate: d[y], // this is the value for, for example, d["2004"]
                    Country: d.Country
                });
            }

        });
        dataset.push({ // At this point we are accessing one index of data from our original csv "data", above and we have created an array of year and rate data from this index. We then create a new object with the Country value from this index and the array that we have made from this index.
            country: d.Country,
            rates: IMRs // we just built this from the current index.
        });

    });

    return dataset;
}

function draw_lines_scrolly(dataset) {

    // console.log(dataset);

    //Set scale domains - max and min of the years
    xScale_scrolly.domain(
        d3.extent(years_scrolly, function (d) {
            return dateFormat_scrolly.parse(d);
        }));

    // max of rates to 0 (reversed, remember)
    yScale_scrolly.domain([
        d3.max(dataset, function (d) {
            return d3.max(d.rates, function (d) {
                return +d.rate;
            });
        }),
        0
    ]);

    //Make a group for each country
    var groups = svg_scrolly.selectAll("g.lines_scrolly")
        .data(dataset, function(d) {return d.country;}); // key value!

    groups
        .enter()
        .append("g")
        .attr("class", "lines_scrolly")
        .attr("id", function (d) {
            return d.country.replace(/\s/g, '_');
        });

    groups.exit().transition().duration(1000).attr("opacity", 0).remove();

    //Within each group, create a new line/path,
    //binding just the rates data to each one
    var lines = groups.selectAll("path")
        .data(function (d) { // because there's a group with data already...
            return [d.rates]; // it has to be an array for the line function
        });

    lines
        .enter()
        .append("path")
        .attr("class", "line_scrolly")
        .attr("d", line_scrolly)
        .classed("normal_scrolly", true)
        .classed("focused_scrolly", false); // gives gray color

    lines.exit().transition().duration(1000).attr("opacity", 0).remove();

    svg_scrolly.select('.x_scrolly.axis_scrolly').transition().duration(300).call(xAxis_scrolly);

    // same for yAxis but with more transform and a title
    svg_scrolly.select(".y_scrolly.axis_scrolly").transition().duration(300).call(yAxis_scrolly);

/*======================================================================
      Multiple Lines: Mouse Functions
    ======================================================================*/
        var circles_scrolly = groups.selectAll("circle") //Circles haven't been created yet
                        .data(function(d) {
                            return d.rates;
                        })
                        .enter()
                        .append("circle");
        circles_scrolly.attr("cx", function(d) {
                        return xScale_scrolly(dateFormat_scrolly.parse(d.year));
                    })
                .attr("cy", function(d) {
                    return yScale_scrolly(d.rate);
                })
                .attr("r", 1)
                .style("opacity", 0);  // this is optional - if you want visible dots or not!
        // Adding a subtle animation to increase the dot size when over it!

        circles_scrolly.on("mouseover", mouseoverFunc_scrolly)
                .on("mousemove", mousemoveFunc_scrolly)
                .on("mouseout", mouseoutFunc_scrolly);


    // d3.selectAll("g.lines_scrolly")
    //     .on("mouseover", mouseoverFunc_scrolly)
    //     .on("mouseout", mouseoutFunc_scrolly)
    //     .on("mousemove", mousemoveFunc_scrolly);



    console.log("dataset", dataset);



    function mouseoutFunc_scrolly() {
        d3.select(this)
            .transition()
            .style("opacity", 0)
            .attr("r", 1);
        // d3.selectAll("path.line_scrolly").classed("unhighlight_scrolly", true).classed("highlight_scrolly", false);
        tooltip_scrolly.style("display", "none"); // this sets it to invisible!
    }

    function mouseoverFunc_scrolly(d) {

        // d3.selectAll("path.line_scrolly").classed("unhighlight_scrolly", true);
        // below code sets the sub saharan africa countries out even more - they only go "unfocused" if a sub saharan country is selected. Otherwise, they remain at the regular opacity. I experiemented with this because I do want to focus on the ssAfrica countries rather than any others (so they are only "unfocused" against each other, not to other countries... This way all other countries are always compared to the ssAfrica ones... but not sure if this method is effective).
        //         if(!d3.select(this).select("path.line").classed("ssAfrica")) {
        //             d3.selectAll("path.ssAfrica").classed("unfocused", false);
        //         }

        // d3.select(this).select("path.line_scrolly").classed("unhighlight_scrolly", false).classed("highlight_scrolly", true);
        d3.select(this)
            .transition()
            .duration(50)
            .style("opacity", 1)
            .attr("r", 4)
            .style("fill", "#FF9900");


        tooltip_scrolly
            .style("display", null) // this removes the display none setting from it
            .html("<p><span class='tooltipHeader_scrolly'>" + 
                "Country: " + d.Country + 
                "<br>Year: " + d.year +
                "<br>Rate: " + d.rate +
                "</span></p>");
    }

    function mousemoveFunc_scrolly(d) {
        // console.log("events", window.event, d3.event);
        tooltip_scrolly
            .style("top", (d3.event.pageY - 45) + "px")
            .style("left", (d3.event.pageX + 5) + "px");
    }
}






