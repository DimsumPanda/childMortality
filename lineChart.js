// =======================================================================
// 	Setup
// =======================================================================
var margin = {top: 50, right: 10, bottom: 70, left:70};
var width = 800;
var height = 600;
var criticalAreas = ["Sub-Saharan Africa"];
// Format the date
var dateFormat = d3.time.format("%Y");			

//xScale & y Scale
var xScale = d3.time.scale()
				.range([ margin.left, width - margin.right - margin.left]);

var yScale = d3.scale.sqrt()
				.range([ margin.top, height - margin.bottom]);
//Configure axis generators
var xAxis = d3.svg.axis()
				.scale(xScale)
				.orient("bottom")
				.ticks(15)
				.tickFormat(function (d) {
					return dateFormat(d);
					})
				.innerTickSize([0])
                .outerTickSize([0]);

var yAxis = d3.svg.axis()
				.scale(yScale)
				.orient("left")
				.innerTickSize([0]);

// Add a tooltop to the page - not to the svg itself!
var tooltip = d3.select("#lineChart")
                .append("div")
                .attr("class", "tooltip");

// Configure line generator
// each line dataset must have a d.year and a d.rate for this to work.
var line = d3.svg.line()
			.x(function (d) {
				return xScale(dateFormat.parse(d.year));
			})
			.y(function (d) {
				return yScale(+d.rate);
			});
// Create the empty SVG image
var svg2 = d3.select("#lineChart")
			.append("svg")
			.attr("width", width)
			.attr("height", height);

// =======================================================================
// Creating the Multiple Lines from the Data
// =======================================================================

//Load data
d3.csv("underFiveMortalityRegion.csv", function (data) {

	var years = ["1960", "1961", "1962", "1963", "1964", "1965", "1966", "1967", "1968", "1969", "1970", "1971", "1972", "1973", "1974", "1975", "1976", "1977", "1978", "1979", "1980", "1981", "1982", "1983", "1984", "1985", "1986", "1987", "1988", "1989", "1990", "1991", "1992", "1993", "1994", "1995", "1996", "1997", "1998", "1999", "2000", "2001", "2002", "2003", "2004", "2005", "2006", "2007", "2008", "2009", "2010", "2011", "2012", "2013", "2014", "2015"];
	console.log(years);
// var years = d3.keys(data[0]).slice(1,55);
//what exactly is slice?
	// or you could get this by doing:

	// var years = d3.keys(data[0]).slice(0, 54-4); //

	//Create a new, empty array to hold our restructured dataset

	var dataset = [];

	//Loop once for each row in data
	data.forEach(function (d, i) {
		
		var childmortality = [];

	//Loop through all the years - and get the mortalityRate for this data element
		years.forEach(function (y) { //Loop through all the years - and get the rates for this data element


            if (d[y]) { /// What we are checking is if the "y" value - the year string from our array, which would translate to a column in our csv file - is empty or not.

                childmortality.push({ //Add a new object to the new rates data array - for year, rate. These are OBJECTS that we are pushing onto the array
                    year: y,
                    rate: d[y], // this is the value for, for example, d["2004"]
                    region: d.region
				});
			}
		});

	dataset.push({ // At this point we are accessing one index of data from our original csv "data", above and we have created an array of year and rate data from this index. We then create a new object with the region value from this index and the array that we have made from this index.
            region: d.region,
            rates: childmortality // we just built this from the current index.
			});

	});

	//Uncomment to log the original data to the console
	// console.log(data);

	//Uncomment to log the newly restructured dataset to the console
	console.log(data);
	console.log(dataset);


	//Set scale domains - max and mine of the years
	xScale.domain(
        d3.extent(years, function (d) {
            return dateFormat.parse(d);
        }));

	// max of mortalityRate to 0 (reversed, remember)
	yScale.domain([
    	d3.max(dataset, function (d) {
            return d3.max(d.rates, function (d) {
                return +d.rate;
            });
        }),
        0
    ]);



	//Make a group for each region
	var groups = svg2.selectAll("g.lines")
					.data(dataset)
					.enter()
					.append("g")
					.attr("class", "lines");
	groups.selectAll("path")
        .data(function (d) { // because there's a group with data already...
            return [d.rates]; // it has to be an array for the line function
        })
        .enter()
        .append("path")
        .attr("class", "line")
        .classed("criticalAreas", function (d, i) {
            console.log(d[i].region);
            if ($.inArray(d[i].region, criticalAreas) != -1) {
                console.log("true");
                return true;
            } else {
                console.log("false");
                return false;
            }
        })
        .classed("world", function (d, i) {
        	console.log(d[i].region);
        	if (d[i].region === "World") {
        		console.log("true");
        		return true;
        	} else {
        		console.log("false");
        		return false;
        	}
        })
        .attr("d", line);

	groups.selectAll("path")
			.data(function (d) {
				return [d.rates];
			})
			.enter()
			.append("path")
			.attr("class", "line")
			.classed("criticalAreas", function (d, i) {
				console.log(d[i].region);
				if ($.inArray(d[i].region, criticalAreas) != -1) {
					console.log("true");
					return true;
				} else {
					console.log("false");
					return false;
				}
			})
			.attr("d", line);
// =======================================================================
// Tooltip dots
// =======================================================================
    var circles = groups.selectAll("circle") //Circles haven't been created yet
                        .data(function(d) {
                            return d.rates;
                        })
                        .enter()
                        .append("circle");
        circles.attr("cx", function(d) {
                        return xScale(dateFormat.parse(d.year));
                    })
                .attr("cy", function(d) {
                    return yScale(d.rate);
                })
                .attr("r", 3)
                .style("opacity", 0);  // this is optional - if you want visible dots or not!
        // Adding a subtle animation to increase the dot size when over it!

        circles.on("mouseover", mouseoverFunc)
                .on("mousemove", mousemoveFunc)
                .on("mouseout", mouseoutFunc);

        // We're putting the text label at the group level, where the country name was originally.
        groups.append("text")
                .datum(function(d) {
                    console.log("Here", {name: d.region, value: d.rates[d.rates.length - 1]});
                    return {name: d.region, value: d.rates[d.rates.length - 1]};
                })
                .attr("transform", function(d) {
                    console.log("in transform", d);
                    if (d.value) {
                        return "translate(" + xScale(dateFormat.parse(d.value.year)) + "," + yScale(+d.value.rate) + ")";
                    }
                    else {
                        return null;
                    }
                })
                .attr("x", 10)
                .attr("dy", ".35em")
                .text(function(d) {
                    if (d.region == "World") {
                        return d.name;
                    }
                })
                .attr("class", "linelabel");

// =======================================================================
// Adding Axes
// =======================================================================

    svg2.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + (height - margin.bottom) + ")")
        .call(xAxis)
        .append("text")
        .attr("x", width - margin.left - margin.right)
        .attr("y", margin.bottom / 3)
        .attr("dy", "1em")
        .style("text-anchor", "end")
        .attr("class", "label")
        .text("Year");

    svg2.append("g")
        .attr("class", "y axis")
        .attr("transform", "translate(" + margin.left + ",0)")
        .call(yAxis)
        .append("text")
        .attr("transform", "rotate(-90)")
        .attr("x", -margin.top -5)
        .attr("y", -margin.left)
        .attr("dy", "1em")
        .style("text-anchor", "end")
        .attr("class", "label")
        .text("Under 5 Mortality Rate");

// =======================================================================
// Mouse Functions
// =======================================================================
    function mouseoverFunc(d) {
        d3.select(this)
            .transition()
            .duration(50)
            .style("opacity", 1)
            .attr("r", 7);
        tooltip
            .style("display", null)
            .html("<p>Region: " + d.region +
                "<br>Year: " + d.year +
                "<br>Rate: " + d.rate + "</p>");
    }

    function mousemoveFunc(d) {
        tooltip
            .style("top", (d3.event.pageY - 10) + "px")
            .style("left", (d3.event.pageX + 10) + "px");
    }

    function mouseoutFunc(d) {
        d3.select(this)
            .transition()
            .style("opacity", 0)
            .attr("r", 3);
        tooltip.style("display", "none");
    }
});

    // d3.selectAll("g.lines")
    //     .on("mouseover", mouseoverFunc)
    //     .on("mouseout", mouseoutFunc)
    //     .on("mousemove", mousemoveFunc);

//     function mouseoutFunc() {

//         d3.selectAll("path.line").classed("unfocused", false).classed("focused", false);
//         tooltip.style("display", "none"); // this sets it to invisible!
//     }

//     function mouseoverFunc(d) {

//         d3.selectAll("path.line").classed("unfocused", true);
//         // below code sets the sub saharan africa countries out even more - they only go "unfocused" if a sub saharan region is selected. Otherwise, they remain at the regular opacity. I experiemented with this because I do want to focus on the ssAfrica countries rather than any others (so they are only "unfocused" against each other, not to other countries... This way all other countries are always compared to the ssAfrica ones... but not sure if this method is effective).
//         //         if(!d3.select(this).select("path.line").classed("ssAfrica")) {
//         //             d3.selectAll("path.ssAfrica").classed("unfocused", false);
//         //         }

//         d3.select(this).select("path.line").classed("unfocused", false).classed("focused", true);
//         tooltip
//             .style("display", null) // this removes the display none setting from it
//             .html("<p><span>" + d.region + "</span></p>");
//     }

//     function mousemoveFunc(d) {
//         console.log("events", window.event, d3.event);
//         tooltip
//             .style("top", (d3.event.pageY - 45) + "px")
//             .style("left", (d3.event.pageX + 5) + "px");
//     }

// }); //end of data csv
