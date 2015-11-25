
var width = 800,
    height = 600;

var tip = d3.tip()
  .attr('class', 'd3-tip')
  // .offset([-2, 0])
  .html(function(d) {
    var dataRow = countryById.get(d.id);
    if (dataRow) {
        return "<strong>" + d.properties.name + "</strong>" + ": " + dataRow.mortality;
    } else {
        console.log("no dataRow", d);
        return "<strong>" + d.properties.name + "</strong>" + ": No data.";
    }
  })

var svg = d3.select('#vis').append('svg')
    .attr('width', width)
    .attr('height', height)
    // .call(d3.behavior.zoom()
    // .on("zoom", redraw))
    .append("g")
    .call(tip);



function redraw() {
    svg.attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");
}



var projection = d3.geo.mercator()
    .scale(225) // mess with this if you want
    .translate([width / 2, height / 2]);

var path = d3.geo.path()
    .projection(projection);

var colorScale = d3.scale.linear().range(["#d1e5f0","#b2182b"]).interpolate(d3.interpolateLab);
// var colorScale = d3.scale.linear().range(["#fff5f0", "#67000d"]).interpolate(d3.interpolateLab);
// var colorScale = d3.scale.category20();

var countryById = d3.map();

// we use queue because we have 2 data files to load.
queue()
    .defer(d3.json, "countries.json")
    .defer(d3.csv, "childMortality_2015.csv", typeAndSet) // process
    .await(loaded);


function typeAndSet(d) {
    d.mortality = +d.mortality;
    countryById.set(d.ISO3, d);
    return d;
}

function getColor(d) {
    var dataRow = countryById.get(d.id);
    if (dataRow) {
        console.log(dataRow);
        return colorScale(dataRow.mortality);
    } else {
        console.log("no dataRow", d);
        return "rgba(0, 0, 0, 0)";
    }
}

// function getText(d) {
//     var dataRow = countryById.get(d.id);
//     if (dataRow) {
//         return "<strong>" + d.properties.name + "</strong>" + ": " + dataRow.mortality;
//     } else {
//         console.log("no dataRow", d);
//         return "<strong>" + d.properties.name + "</strong>" + ": No data.";
//     }
// }

function loaded(error, countries, mortalityRate) {

    console.log(countries);
    console.log(mortalityRate);
    // console.log(malaria);

    colorScale.domain(d3.extent(mortalityRate, function(d) {return d.mortality;}));
    

    var countries = topojson.feature(countries, countries.objects.units).features;


    // svg.append("rect").attr("width", "100%")
    // .attr("height", "100%")
    // .attr("fill", "rgba(166,206,227,0.2)");

    svg.selectAll('path.countries')
        .data(countries)
        .enter()
        .append('path')
        .attr('class', 'countries')
        .attr('d', path)
        .on('mouseover', tip.show)
        .on('mouseout', tip.hide)
        .attr('fill', function(d,i) {
            console.log(d.properties.name);
            return getColor(d);
        })
        // .call(d3.helper.tooltip(
        //     function(d, i){
        //         return getText(d);
        //     })); 
            //tooltip based in an example from Roger Veciana: http://bl.ocks.org/rveciana/5181105
        // .append("title")
        // .text(function(d) {
        //     return getText(d);
        // });
    

    var linear = colorScale;

    svg.append("g")
      .attr("class", "legendLinear")
      .attr("transform", "translate(200,20)");

    var legendLinear = d3.legend.color()
      .shapeWidth(30)
      .orient('horizontal')
      .scale(linear);

    svg.select(".legendLinear")
      .call(legendLinear);

}