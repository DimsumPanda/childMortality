
// For use with scroller_template.html and mfreeman_scroller.js.

// function to move a selection to the front/top, from
// https://gist.github.com/trtg/3922684
d3.selection.prototype.moveToFront = function() {
  return this.each(function(){
    this.parentNode.appendChild(this);
  });
};

// Settings object

var settings = {
  // could be used to save settings for styling things.
}

var data = []; // make this global

function focus_country(country) {
  console.log("in focus", country);
  // unfocus all, then focus one if given a name.
    d3.selectAll("path.line").classed("focused", false);
    if (country) {
        var country = country.replace(/\s/g, '_');
        var line = d3.select("g.lines#" + country + " path.line");
        line.classed("focused", true);
        var lineGroup = d3.select("g.lines#" + country);
        lineGroup.moveToFront();
    }
}

// ******* Change the showX and showY function for some cases ********
var update = function(value) {
  var country = null;
  var localdata = data;
  switch(value) {
    case 1:
      console.log("in case", value);
      localdata = data;
      //yScale = d3.scale.linear().range([margin.top, height - margin.bottom]);
      break;
    case 2:
      console.log("in case 2");
      //yScale = d3.scale.sqrt().range([margin.top, height - margin.bottom]);
      localdata = data;
      country = "Luxembourg";
      break;
    case 3:
      console.log("in case 3");
      //yScale = d3.scale.sqrt().range([margin.top, height - margin.bottom]);
      localdata = data;
      country = "Angola";
      break;
    case 4:
      console.log("in case 5");
      country = "Angola";
      localdata = data.filter(function(d) {return d.country == "Angola" || d.country == "Benin" || d.country == "Botswana" || d.country == "Burkina Faso" || d.country == "Burundi" || d.country == "Cabo Verde" || d.country == "Cameroon" || d.country == "Central African Republic" || d.country == "Chad" || d.country == "Comoros" || d.country == "Congo" || d.country == "Cote d'Ivoire" || d.country == "Democratic Republic of the Congo" || d.country == "Equatorial Guinea" || d.country == "Eritrea" || d.country == "Ethiopia" || d.country == "Gabon" || d.country == "Gambia" || d.country == "Ghana" || d.country == "Guinea" || d.country == "Guinea-Bissau" || d.country == "Kenya" || d.country == "Lesotho" || d.country == "Liberia" || d.country == "Madagascar" || d.country == "Malawi" || d.country == "Mali" || d.country == "Mauritania" || d.country == "Mauritius" || d.country == "Mozambique" || d.country == "Namibia" || d.country == "Nauru" || d.country == "Niger" || d.country == "Nigeria" || d.country == "Niue" || d.country == "Rwanda" || d.country == "Saint Kitts and Nevis" || d.country == "Saint Lucia" || d.country == "Saint Vincent and the Grenadines" || d.country == "Senegal" || d.country == "Seychelles" || d.country == "Sierra Leone" || d.country == "Somalia" || d.country == "South Africa" || d.country == "South Sudan" || d.country == "Sudan" || d.country == "Swaziland" || d.country == "Togo" || d.country == "Uganda" || d.country == "United Republic of Tanzania" || d.country == "Zambia" || d.country == "Zimbabwe";});
      break;
      
    case 5:
      console.log("in case 4");
      country = "Sierra Leone";
      localdata = data.filter(function(d) {return d.country == "Angola" || d.country == "Benin" || d.country == "Botswana" || d.country == "Burkina Faso" || d.country == "Burundi" || d.country == "Cabo Verde" || d.country == "Cameroon" || d.country == "Central African Republic" || d.country == "Chad" || d.country == "Comoros" || d.country == "Congo" || d.country == "Cote d'Ivoire" || d.country == "Democratic Republic of the Congo" || d.country == "Equatorial Guinea" || d.country == "Eritrea" || d.country == "Ethiopia" || d.country == "Gabon" || d.country == "Gambia" || d.country == "Ghana" || d.country == "Guinea" || d.country == "Guinea-Bissau" || d.country == "Kenya" || d.country == "Lesotho" || d.country == "Liberia" || d.country == "Madagascar" || d.country == "Malawi" || d.country == "Mali" || d.country == "Mauritania" || d.country == "Mauritius" || d.country == "Mozambique" || d.country == "Namibia" || d.country == "Nauru" || d.country == "Niger" || d.country == "Nigeria" || d.country == "Niue" || d.country == "Rwanda" || d.country == "Saint Kitts and Nevis" || d.country == "Saint Lucia" || d.country == "Saint Vincent and the Grenadines" || d.country == "Senegal" || d.country == "Seychelles" || d.country == "Sierra Leone" || d.country == "Somalia" || d.country == "South Africa" || d.country == "South Sudan" || d.country == "Sudan" || d.country == "Swaziland" || d.country == "Togo" || d.country == "Uganda" || d.country == "United Republic of Tanzania" || d.country == "Zambia" || d.country == "Zimbabwe";});
      break;
    case 6:
      console.log("in case 5");
      country = "Malawi";
      localdata = data.filter(function(d) {return d.country == "Angola" || d.country == "Benin" || d.country == "Botswana" || d.country == "Burkina Faso" || d.country == "Burundi" || d.country == "Cabo Verde" || d.country == "Cameroon" || d.country == "Central African Republic" || d.country == "Chad" || d.country == "Comoros" || d.country == "Congo" || d.country == "Cote d'Ivoire" || d.country == "Democratic Republic of the Congo" || d.country == "Equatorial Guinea" || d.country == "Eritrea" || d.country == "Ethiopia" || d.country == "Gabon" || d.country == "Gambia" || d.country == "Ghana" || d.country == "Guinea" || d.country == "Guinea-Bissau" || d.country == "Kenya" || d.country == "Lesotho" || d.country == "Liberia" || d.country == "Madagascar" || d.country == "Malawi" || d.country == "Mali" || d.country == "Mauritania" || d.country == "Mauritius" || d.country == "Mozambique" || d.country == "Namibia" || d.country == "Nauru" || d.country == "Niger" || d.country == "Nigeria" || d.country == "Niue" || d.country == "Rwanda" || d.country == "Saint Kitts and Nevis" || d.country == "Saint Lucia" || d.country == "Saint Vincent and the Grenadines" || d.country == "Senegal" || d.country == "Seychelles" || d.country == "Sierra Leone" || d.country == "Somalia" || d.country == "South Africa" || d.country == "South Sudan" || d.country == "Sudan" || d.country == "Swaziland" || d.country == "Togo" || d.country == "Uganda" || d.country == "United Republic of Tanzania" || d.country == "Zambia" || d.country == "Zimbabwe";});
      break;      
    default:
      country = null;
      focus_country(country);
      draw_lines(localdata);
      break;
  }
  focus_country(country); // this applies a highlight on a country.
  draw_lines(localdata); // we can update the data if we want in the cases.
}
// setup scroll functionality


function display(error, mydata) {
  if (error) {
    console.log(error);
  } else {
    console.log(data);

    data = make_data(mydata); // assign to global; call func in line_chart_refactor.js

    console.log("after makedata", data);

    var scroll = scroller()
      .container(d3.select('#graphic'));

    // pass in .step selection as the steps
    scroll(d3.selectAll('.step'));

    // Pass the update function to the scroll object
    scroll.update(update)
  }
}

queue()
  .defer(d3.csv, "median-U5MRbyCountry.csv")
  .await(display);

