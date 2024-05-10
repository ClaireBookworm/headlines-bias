// Load the data from the CSV file
d3.csv("datasets/merged_dataset.csv").then(function(data) {

    // Parse the data and convert strings to appropriate types
    data.forEach(function(d) {
        d.date = d3.timeParse("%Y-%m-%d")(d.date);
        d.approve_estimate = +d.approve_estimate;
        d.frequency = +d.frequency;
    });

    const containerWidth = d3.select("#approval_chart5").node().getBoundingClientRect().width;

    // Set up the SVG and scales
    const margin = {top: 20, right: 50, bottom: 30, left: 50},
          width = containerWidth - margin.left - margin.right,
          height = 500 - margin.top - margin.bottom;

    const x = d3.scaleTime()
        .range([0, width])
        .domain(d3.extent(data, d => d.date));

    const y0 = d3.scaleLinear()
        .range([height, 0])
        .domain([0, d3.max(data, d => d.approve_estimate)]);

    const y1 = d3.scaleLinear()
        .range([height, 0])
        .domain([d3.min(data, d => d.frequency), d3.max(data, d => d.frequency)]);

    const svg = d3.select("#approval_chart5").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    // Add a title to the graph
    // svg.append("text")
    // .attr("x", width/2)  // x-coordinate of the text
    // .attr("y", margin.top+50)   // y-coordinate of the text
    // .attr("text-anchor", "middle")  // center the text horizontally
    // .text("Timeseries Comparison of Trump Frequency (red) vs. Voter Popularity (blue)");

    // Define the line for approval estimate
    const line1 = d3.line()
        .x(d => x(d.date))
        .y(d => y0(d.approve_estimate));

    // Define the line for frequency
    const line2 = d3.line()
        .defined(function(d) { return d.value !== null; })
        .x(d => x(d.date))
        .y(d => y1(d.frequency))
        .curve(d3.curveMonotoneX);;

	// Create a tooltip
	const tooltip = d3.select('body').append('div')
        .attr('class', 'tooltip')
        .style('position', 'absolute')
        .style('background-color', 'white')
        .style('border', 'solid')
        .style('border-width', '1px')
        .style('border-radius', '5px')
        .style('font-size', '12px')
        .style('padding', '5px')
        .style('visibility', 'hidden'); // Hidden by default

    // Draw the lines
    svg.append("path")
      .datum(data)
      .attr("class", "line")
      .attr("d", line1)
      .attr("stroke", "#6b486b")
      .attr("fill", "none")
      .on('mouseover', function(event, d) {
        tooltip.style('visibility', 'visible')
            .html(`${d3.timeFormat("%m/%d/%Y")(x.invert(event.pageX - margin.left))}`)
            .style('left', `${event.pageX + 10}px`)
            .style('top', `${event.pageY + 10}px`);
        })
        .on('mouseout', function(event, d) {
            tooltip.style('visibility', 'hidden');
        });

    svg.append("path")
      .datum(data)
      .attr("class", "line")
      .attr("d", line2)
      .attr("stroke", "#d0743c")
      .attr("fill", "none")

      .on('mouseover', function(event, d) {
        tooltip.style('visibility', 'visible')
            .html(`${d3.timeFormat("%m/%d/%Y")(x.invert(event.pageX - margin.left))}`)
            .style('left', `${event.pageX + 10}px`)
            .style('top', `${event.pageY + 10}px`);
        })
        .on('mouseout', function(event, d) {
            tooltip.style('visibility', 'hidden');
        });

    // Add the X Axis
    svg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x));

    // Add the Y0 Axis
    svg.append("g")
        .call(d3.axisLeft(y0));

    // Add the Y1 Axis
    svg.append("g")
        .attr("transform", "translate(" + width + " ,0)")   
        .call(d3.axisRight(y1));
    
    // Add legend
    const legend = svg.append("g")
        .attr("transform", `translate(0,${margin.top})`);

    // outletNames.forEach((outlet, index) => {
        legend.append("rect")
            .attr("x", 100)
            .attr("width", 18)
            .attr("height", 18)
            .style("fill", "#6b486b");

        legend.append("text")
            .attr("x", 100 + 24)
            .attr("y", 9)
            .attr("dy", ".35em")
            .style("text-anchor", "start")
            .text("Approval Estimate");
        legend.append("rect")
            .attr("x", 400)
            .attr("width", 18)
            .attr("height", 18)
            .style("fill", "#d0743c");

        legend.append("text")
            .attr("x", 400 + 24)
            .attr("y", 9)
            .attr("dy", ".35em")
            .style("text-anchor", "start")
            .text("Frequency");
    // });
});

