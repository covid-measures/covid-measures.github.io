  // global variables used across all charts
  var margin = {top: 30, right: 30, bottom: 60, left: 60};
  var width = Math.min(600,document.getElementsByClassName("container")[0].offsetWidth);
  var height = 300;
  var start_day = new Date("2020-01-15");

  function update_dates(data) {
  	data.map( function(x) {
	    let d = new Date(); 
	    d.setTime(start_day.getTime() + 86400000 * x.day); 
	    x.day = d; return x;
	});
  }

  function drawGraph(data,svg_id,intervention_dates,title) {
  	update_dates(data)

  	const svg = d3.select("#" + svg_id)
  	
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
                          return ['day',""].includes(key) ? 0 : +obj[key]; }));}))
    
    var y = d3.scaleLinear()
      .domain([0, max_value])
      .range([ height - margin.top - margin.bottom , 0 ]);
    
      g.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - margin.left - 2)
      .attr("x",0 - (height / 2) + 60)
      .attr("dy", "1em")
      .style("text-anchor", "middle")
      .text("Hospitalizations");  

      g.append("text")             
      .attr("transform",
            "translate(" + ((width - margin.left - margin.right)/2) + " ," + 
                           (height - margin.top - 20) + ")")
      .style("text-anchor", "middle")
      .text("Date");

      g.append("text")             
      .attr("transform",
            "translate(" + ((width - margin.left - margin.right)/2) + " ," + 
                           -10 + ")")
      .style("text-anchor", "middle")
      .text(title);

    g.append("g")
      .call(d3.axisLeft(y));    
	
	var i = 0
    intervention_dates.map(function(item) {	
	    g.append("rect")
	      .attr("fill", i == 0 ? "#2e8b57" : "#53868b")
	      .attr("width", x(item[1]) - x(item[0]))
	      .attr("height", height - margin.top - margin.bottom)
	      .attr("x", x(item[0]))  
	      .attr("opacity",0.5);
	    i++
	 })

    var runs = [... Array(5).keys()].map(x => x+1);
    runs.push("median");
    
	// var waypoint = new Waypoint({
	// 	element: document.getElementById(svg_id),
	// 	handler: function() {}});

    runs.map(function(run) {
        
        var color = run == "median" ? "black" : "grey";
        var width = run == "median" ?  1.5 : 1.5;
        var alpha = run == "median" ?  1.0 : 0.5;
      
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
	     	.duration(2000)
	     	.attr("stroke-dashoffset", 0);
	  	
  		})
	}
	
  }

  function make_plot(data_file, svg_id, intervention_dates,title) {
    		d3.csv(data_file).then(
  				function(data) {
  					drawGraph(data,svg_id,intervention_dates,title)
  				});   
  	}
	

  
make_plot("d3_data/output/epi.out_2020-03-23_no_intervention.csv","chart_1",[],"No Social Distancing")

make_plot("d3_data/output/epi.out_2020-03-23_social_distancing_full_length_0.5.csv",
	"chart_2",
	[[new Date("2020-02-15"),new Date("2021-09-7")]],
	"Light Distancing (50% of normal social contacts)")

make_plot("d3_data/output/epi.out_2020-03-23_social_distancing_full_length_0.3.csv",
	"chart_3",
	[[new Date("2020-02-15"),new Date("2021-09-7")]],
	"Strong Distancing (30% of normal social contacts)")

make_plot("d3_data/output/epi.out_2020-03-23_social_distancing_full_length_0.2.csv",
	"chart_4",
	[[new Date("2020-02-15"),new Date("2021-09-7")]],
	"Extreme Distancing (20% of normal social contacts)")

make_plot("d3_data/output/epi.out_2020-03-23.0.3.136days.csv",
	"chart_6",
	[[new Date("2020-02-15"),new Date("2020-06-01")]],
	"Strong Distancing (4.5 Months)")

make_plot("d3_data/output/epi.out_2020-03-23.0.3.270days.csv",
	"chart_7",
	[[new Date("2020-02-15"),new Date("2020-11-11")]],
	"Strong Distancing (9 Months)")

make_plot("d3_data/output/epi.out_2020-03-23.0.3.366days.csv",
	"chart_8",
	[[new Date("2020-02-15"),new Date("2021-02-16")]],
	"Strong Distancing (1 Year)")

make_plot("d3_data/output/epi.out_2020-03-23_lightswitch_0.20_high_15_low_2.csv",
	"chart_lightswitch",
	[[new Date("2020-02-15"),new Date("2020-03-16")],
     [new Date("2020-03-16"),new Date("2021-09-7")]],
	"Extreme Distancing (1 Month) + Lightswitch")