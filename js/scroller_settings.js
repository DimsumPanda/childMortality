
// For use with scroller_template2.html and mfreeman_scroller.js.

// function to move a selection to the front/top, from
// https://gist.github.com/trtg/3922684
d3.selection.prototype.moveToFront = function() {
  return this.each(function(){
    this.parentNode.appendChild(this);
  });
};

// Settings object

var settings_scrolly = {
  // could be used to save settings for styling things.
};

var data_scrolly = []; // make this global

var vis_scrolly = d3.select("#vis_scrolly");

// var label_country_scrolly = d3.select("body")
//                               .append("div")
//                               .attr("class", "label_country_scrolly");

function focus_country(country) {
  console.log("in focus", country);
  // unfocus all, then focus one if given a name.
    d3.selectAll("path.line_scrolly").classed("focused_scrolly", false);
    if (country) {
        var country = country.replace(/\s/g, '_');
        var line = d3.select("g.lines_scrolly#" + country + " path.line_scrolly");
        line.classed("focused_scrolly", true);
        var lineGroup = d3.select("g.lines_scrolly#" + country);
        lineGroup.moveToFront();

    }
}

var update = function(value) {
  var country = null;
  var localdata_scrolly = data_scrolly;
  var show_vis = true;
  switch(value) {
    case 0:
      // console.log("in case", value);
      // localdata_scrolly = data_scrolly;
      show_vis = false;
      break;
    case 1:
      // console.log("in case", value);
      localdata_scrolly = data_scrolly;
      break;
    case 2:
      // console.log("in case", value);
      localdata_scrolly = data_scrolly;
      country = "Luxembourg";
      break;
    case 3:
      // console.log("in case", value);
      //yScale = d3.scale.sqrt().range([margin.top, height - margin.bottom]);
      localdata_scrolly = data_scrolly.filter(function(d) {return d.country == "Angola" || d.country == "Benin" || d.country == "Botswana" || d.country == "Burkina Faso" || d.country == "Burundi" || d.country == "Cabo Verde" || d.country == "Cameroon" || d.country == "Central African Republic" || d.country == "Chad" || d.country == "Comoros" || d.country == "Congo" || d.country == "Cote d'Ivoire" || d.country == "Democratic Republic of the Congo" || d.country == "Equatorial Guinea" || d.country == "Eritrea" || d.country == "Ethiopia" || d.country == "Gabon" || d.country == "Gambia" || d.country == "Ghana" || d.country == "Guinea" || d.country == "Guinea-Bissau" || d.country == "Kenya" || d.country == "Lesotho" || d.country == "Liberia" || d.country == "Madagascar" || d.country == "Malawi" || d.country == "Mali" || d.country == "Mauritania" || d.country == "Mauritius" || d.country == "Mozambique" || d.country == "Namibia" || d.country == "Nauru" || d.country == "Niger" || d.country == "Nigeria" || d.country == "Niue" || d.country == "Rwanda" || d.country == "Saint Kitts and Nevis" || d.country == "Saint Lucia" || d.country == "Saint Vincent and the Grenadines" || d.country == "Senegal" || d.country == "Seychelles" || d.country == "Sierra Leone" || d.country == "Somalia" || d.country == "South Africa" || d.country == "South Sudan" || d.country == "Sudan" || d.country == "Swaziland" || d.country == "Togo" || d.country == "Uganda" || d.country == "United Republic of Tanzania" || d.country == "Zambia" || d.country == "Zimbabwe";});
      // localdata_scrolly = data_scrolly.filter(function(d) {return d.country == "Sierra Leone" || d.country == "Niger" || d.country == "Mali" || d.country == "Angola" || d.country == "Rwanda" || d.country == "Liberia" || d.country == "Chad" || d.country == "Nigeria" || d.country == "South Sudan" || d.country == "Burkina Faso" || d.country == "Malawi" || d.country == "Guinea-Bissau" || d.country == "Mozambique" || d.country == "Guinea" || d.country == "Central African Republic" || d.country == "Somalia" || d.country == "Zambia" || d.country == "Democratic Republic of the Congo" || d.country == "Burundi" || d.country == "Equatorial Guinea";})
      // country = "Angola";
      break;
    case 4:
      // console.log("in case", value);
      country = "Angola";
      localdata_scrolly = data_scrolly.filter(function(d) {return d.country == "Angola" || d.country == "Benin" || d.country == "Botswana" || d.country == "Burkina Faso" || d.country == "Burundi" || d.country == "Cabo Verde" || d.country == "Cameroon" || d.country == "Central African Republic" || d.country == "Chad" || d.country == "Comoros" || d.country == "Congo" || d.country == "Cote d'Ivoire" || d.country == "Democratic Republic of the Congo" || d.country == "Equatorial Guinea" || d.country == "Eritrea" || d.country == "Ethiopia" || d.country == "Gabon" || d.country == "Gambia" || d.country == "Ghana" || d.country == "Guinea" || d.country == "Guinea-Bissau" || d.country == "Kenya" || d.country == "Lesotho" || d.country == "Liberia" || d.country == "Madagascar" || d.country == "Malawi" || d.country == "Mali" || d.country == "Mauritania" || d.country == "Mauritius" || d.country == "Mozambique" || d.country == "Namibia" || d.country == "Nauru" || d.country == "Niger" || d.country == "Nigeria" || d.country == "Niue" || d.country == "Rwanda" || d.country == "Saint Kitts and Nevis" || d.country == "Saint Lucia" || d.country == "Saint Vincent and the Grenadines" || d.country == "Senegal" || d.country == "Seychelles" || d.country == "Sierra Leone" || d.country == "Somalia" || d.country == "South Africa" || d.country == "South Sudan" || d.country == "Sudan" || d.country == "Swaziland" || d.country == "Togo" || d.country == "Uganda" || d.country == "United Republic of Tanzania" || d.country == "Zambia" || d.country == "Zimbabwe";});
      // localdata_scrolly = data_scrolly.filter(function(d) {return d.country == "Sierra Leone" || d.country == "Niger" || d.country == "Mali" || d.country == "Angola" || d.country == "Rwanda" || d.country == "Liberia" || d.country == "Chad" || d.country == "Nigeria" || d.country == "South Sudan" || d.country == "Burkina Faso" || d.country == "Malawi" || d.country == "Guinea-Bissau" || d.country == "Mozambique" || d.country == "Guinea" || d.country == "Central African Republic" || d.country == "Somalia" || d.country == "Zambia" || d.country == "Democratic Republic of the Congo" || d.country == "Burundi" || d.country == "Equatorial Guinea";})
      break;
    case 5:
      // console.log("in case", value);
      // show_vis = false;
      country = "Sierra Leone";
      localdata_scrolly = data_scrolly.filter(function(d) {return d.country == "Angola" || d.country == "Benin" || d.country == "Botswana" || d.country == "Burkina Faso" || d.country == "Burundi" || d.country == "Cabo Verde" || d.country == "Cameroon" || d.country == "Central African Republic" || d.country == "Chad" || d.country == "Comoros" || d.country == "Congo" || d.country == "Cote d'Ivoire" || d.country == "Democratic Republic of the Congo" || d.country == "Equatorial Guinea" || d.country == "Eritrea" || d.country == "Ethiopia" || d.country == "Gabon" || d.country == "Gambia" || d.country == "Ghana" || d.country == "Guinea" || d.country == "Guinea-Bissau" || d.country == "Kenya" || d.country == "Lesotho" || d.country == "Liberia" || d.country == "Madagascar" || d.country == "Malawi" || d.country == "Mali" || d.country == "Mauritania" || d.country == "Mauritius" || d.country == "Mozambique" || d.country == "Namibia" || d.country == "Nauru" || d.country == "Niger" || d.country == "Nigeria" || d.country == "Niue" || d.country == "Rwanda" || d.country == "Saint Kitts and Nevis" || d.country == "Saint Lucia" || d.country == "Saint Vincent and the Grenadines" || d.country == "Senegal" || d.country == "Seychelles" || d.country == "Sierra Leone" || d.country == "Somalia" || d.country == "South Africa" || d.country == "South Sudan" || d.country == "Sudan" || d.country == "Swaziland" || d.country == "Togo" || d.country == "Uganda" || d.country == "United Republic of Tanzania" || d.country == "Zambia" || d.country == "Zimbabwe";});
      // localdata_scrolly = data_scrolly.filter(function(d) {return d.country == "Sierra Leone" || d.country == "Niger" || d.country == "Mali" || d.country == "Angola" || d.country == "Rwanda" || d.country == "Liberia" || d.country == "Chad" || d.country == "Nigeria" || d.country == "South Sudan" || d.country == "Burkina Faso" || d.country == "Malawi" || d.country == "Guinea-Bissau" || d.country == "Mozambique" || d.country == "Guinea" || d.country == "Central African Republic" || d.country == "Somalia" || d.country == "Zambia" || d.country == "Democratic Republic of the Congo" || d.country == "Burundi" || d.country == "Equatorial Guinea";})
      break;
    case 6:
      // console.log("in case", value);
      // show_vis = false;
      country = "Malawi";
      localdata_scrolly = data_scrolly.filter(function(d) {return d.country == "Angola" || d.country == "Benin" || d.country == "Botswana" || d.country == "Burkina Faso" || d.country == "Burundi" || d.country == "Cabo Verde" || d.country == "Cameroon" || d.country == "Central African Republic" || d.country == "Chad" || d.country == "Comoros" || d.country == "Congo" || d.country == "Cote d'Ivoire" || d.country == "Democratic Republic of the Congo" || d.country == "Equatorial Guinea" || d.country == "Eritrea" || d.country == "Ethiopia" || d.country == "Gabon" || d.country == "Gambia" || d.country == "Ghana" || d.country == "Guinea" || d.country == "Guinea-Bissau" || d.country == "Kenya" || d.country == "Lesotho" || d.country == "Liberia" || d.country == "Madagascar" || d.country == "Malawi" || d.country == "Mali" || d.country == "Mauritania" || d.country == "Mauritius" || d.country == "Mozambique" || d.country == "Namibia" || d.country == "Nauru" || d.country == "Niger" || d.country == "Nigeria" || d.country == "Niue" || d.country == "Rwanda" || d.country == "Saint Kitts and Nevis" || d.country == "Saint Lucia" || d.country == "Saint Vincent and the Grenadines" || d.country == "Senegal" || d.country == "Seychelles" || d.country == "Sierra Leone" || d.country == "Somalia" || d.country == "South Africa" || d.country == "South Sudan" || d.country == "Sudan" || d.country == "Swaziland" || d.country == "Togo" || d.country == "Uganda" || d.country == "United Republic of Tanzania" || d.country == "Zambia" || d.country == "Zimbabwe";});
      // localdata_scrolly = data_scrolly.filter(function(d) {return d.country == "Sierra Leone" || d.country == "Niger" || d.country == "Mali" || d.country == "Angola" || d.country == "Rwanda" || d.country == "Liberia" || d.country == "Chad" || d.country == "Nigeria" || d.country == "South Sudan" || d.country == "Burkina Faso" || d.country == "Malawi" || d.country == "Guinea-Bissau" || d.country == "Mozambique" || d.country == "Guinea" || d.country == "Central African Republic" || d.country == "Somalia" || d.country == "Zambia" || d.country == "Democratic Republic of the Congo" || d.country == "Burundi" || d.country == "Equatorial Guinea";})
      // show_vis = false;
      break;
    case 7:
      show_vis = false;
      break;
    default:
      country = null;
      show_vis = true;
      focus_country(country);
      draw_lines_scrolly(localdata_scrolly);
      break;
  }
  console.log("show viz", show_vis);
  if (show_vis) {
    vis_scrolly.style("display", "inline-block");
  } else {
    vis_scrolly.style("display", "none");
  }
  draw_lines_scrolly(localdata_scrolly); // we can update the data_scrolly if we want in the cases. Draw before focus!
  focus_country(country); // this applies a highlight on a country.
};
// setup scroll functionality

var tooltip_scrolly = d3.select("body")
                        .append("div")
                        .attr("class", "tooltip_scrolly");

function display_scrolly(error, mydata_scrolly) {
  if (error) {
    console.log(error);
  } else {
    console.log(data_scrolly);

    var vis_scrolly = d3.select("#vis_scrolly");

    data_scrolly = make_data_scrolly(mydata_scrolly); // assign to global; call func in line_chart_refactor.js

    //console.log("after makedata_scrolly", data_scrolly);

    var scroll = scroller()
      .container_scrolly(d3.select('#graphic_scrolly'));

    var unicef_children = d3.select('#unicef_children');

    // pass in .step selection as the steps
    scroll(d3.selectAll('.step_scrolly'));

    // Pass the update function to the scroll object
    scroll.update(update);

    // This code hides the vis when you get past it.
    // You need to check what scroll value is a good cutoff.

    var oldScroll = 0;
    $(window).scroll(function (event) {
      var scroll = $(window).scrollTop();
      console.log("scroll", scroll);
      if (scroll >= 980 && scroll > oldScroll)
      {
        unicef_children.style("display", "none");
      }
      else if (scroll < 1100 && scroll > oldScroll){
        unicef_children.style("display", "inline-block");
      }
      if (scroll >= 3000 && scroll > oldScroll) {
          // unicef_children.style("display", "inline-block");
          vis_scrolly.style("display", "none");
      } else if (scroll >= 2500 && scroll < 2800 && scroll < oldScroll) {
       // } else if (scroll >= 2500 && scroll < 2800 && scroll < oldScroll) {
        vis_scrolly.style("display", "inline-block"); // going backwards, turn it on.
       }
      oldScroll = scroll;
    });

 
  }
} // end display

queue()
  .defer(d3.csv, "data/median-U5MRbyCountry.csv")
  .await(display_scrolly);

