d3.csv("maternalMortalityRegion.csv", function(error, myData) {

		        if (error) {
		          console.log("Had an error loading file.");
		        }

		        // Default: Sorted by Region
		        myData.sort(function(a, b){
				return d3.descending(a.year2015, b.year2015);
				});

				// We'll be using simpler data as values, not objects.
				var myArray = [];
				var allDifferences = [];

				myData.forEach(function(d, i){

					d.difference = d.year2013 - d.year1990;


				 // Add a new array with the values of each:
			 	 myArray.push([d.Country, d.year2015, d.rateChange, d.waterDeaths]);
			 	 allDifferences.push(d.difference);

				});

				console.log("sorted", myData);

				console.log(allDifferences);
				// console.log(myArray);
				

				// console.log("sorted", myData);



				var table = d3.select("#table").append("table");

				var header = table.append("thead").append("tr");

				// Made some objects to construct the header in code:
				// The sort_type is for the Jquery sorting function.
				var headerObjs = [
					{ label: "Country \t", sort_type: "string" },
					{ label: "\t 2015 \t", sort_type: "int" },
					{ label: "\t Rate Change \t", sort_type: "int" },
					{ label: "\t \t Water, Sanitation, and Hygeine", sort_type: "int" },
				];

				header
					.selectAll("th")
					.data(headerObjs)
					.enter()
					.append("th")
					.attr("data-sort", function (d) { return d.sort_type;})
          .text(function(d) { return d.label; });

        var tablebody = table.append("tbody");

        rows = tablebody
        	.selectAll("tr")
        	.data(myArray)
        	.enter()
        	.append("tr");

        // We built the rows using the nested array - now each row has its own array.

        // Scale
        // console.log('Extent is ', d3.extent(allDifferences));

        var colorScale = d3.scale.linear()
        	// .domain(d3.extent(allDifferences))
        	.range(["#FFF", "#FF9900"]);


        cells = rows.selectAll("td")
        	// each row has data associated; we get it and enter it for the cells.
        	.data(function(d) {
        		return d;
        	})
        	.enter()
        	.append("td")
        	.style("background-color", function(d,i){
        		// for the last element in the row, we color the background:
        		if (i === 2) {
        			return colorScale(d);
        		}
        	})
        	.style("color", function(d,i){
        		if (i === 2) {
        			return "black";
        		}
        	})
        	.text(function(d) {
        		return "\t" + d + "\t";
        	});

        //jquery sorting applied to it - could be done with d3 and events.
        $("table").stupidtable();

    		});
		
