  // global variables used across all charts
  var margin = {top: 30, right: 30, bottom: 60, left: 60};
  
  var start_day = new Date("2020-01-15");

  async function load_csv(csv_name) {
	return await d3.csv('sim_data.csv').then(function (data) {
		data.map( function(x) {
	    let d = new Date(); 
	    d.setTime(start_day.getTime() + 86400000 * x.day); 
	    x.day = d; return x;
	  });
		return data;
	});
	
  }

  function drawGraph(data,svg_id) {
  	
  	const svg = d3.select("#" + svg_id)
  	var width = d3.select("svg").style("height").slice(0,3);
  	var height = d3.select("svg").style("height").slice(0,3);
  	var g =  svg.append("g")
              .attr("transform",
                    "translate(" + margin.left + "," + margin.top + ")")

    var x = d3.scaleTime()
      .domain(d3.extent(data, function(d) { return d.day; }))
      .range([ 0, width - margin.left - margin.right]);
    
    g.append("g")
      .attr("transform", "translate(0," + (height - margin.top - margin.bottom) + ")")
      .call(d3.axisBottom(x));

    var max_value = d3.max(data.map(function(obj) {return d3.max(
                        Object.keys(obj).map(function (key) {
                          return key == 'day'? 0 : obj[key]; }));}))
    
    var y = d3.scaleLinear()
      .domain([0, max_value])
      .range([ height - margin.top - margin.bottom , 0 ]);
    
    g.append("g")
      .call(d3.axisLeft(y));
    
    g.append("rect")
      .attr("fill","#94FFB9")
      .attr("width", x(new Date("2020-04-7")) - x(new Date("2020-03-17")))
      .attr("height", height - margin.top - margin.bottom)
      .attr("x", x(new Date("2020-03-17")))  
      .attr("opacity",0.5);

    var runs = [... Array(5).keys()].map(x => x+1);
    runs.push("median");
    
    runs.map(function(run) {
        
        var color = run == "median" ? "black" : "grey";
        var width = run == "median" ?  1.5 : 1.5;
        var alpha = run == "median" ?  1.0 : 0.2;
      
        var path = g.append("path")
            .datum(data)
            .attr("fill", "none")
            .attr("stroke", color)
            .attr("stroke-width", width)
            .attr("stroke-opacity", alpha)
            .attr("d", d3.line()
              .x(function(d) { return x(d.day) })
              .y(function(d) { return y(d[run]) })
            )

        // path animation adapted from http://bl.ocks.org/methodofaction/4063326
        var totalLength = path.node().getTotalLength();

        path
           .attr("stroke-dasharray", totalLength + " " + totalLength)
           .attr("stroke-dashoffset", totalLength)
           .transition()
             .duration(4000)
             .attr("stroke-dashoffset", 0);
    });

    load_csv().then(function(data) {drawGraph(data,"chart_1")});
  }
