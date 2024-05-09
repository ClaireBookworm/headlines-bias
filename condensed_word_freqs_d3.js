
// Define the words of interest
const words = ["analysis", "clinton", "democrats", "impeachment", "investigation", "mueller", "russia", "trump", "justice", "opinion", "perspective", "power", "republicans"];

// Load data for each word, parse dates, and sort
const promises = words.map(word => {
    const file = `word_counts/word_counts_${word}.csv`;
    return d3.csv(file, d => {
        return { date: new Date(d.Date), frequency: +d.Frequency, phrase: word };
    }).then(data => {
        return data.sort((a, b) => a.date - b.date);
    });
});

// Handle data after all promises resolve
Promise.all(promises).then(datasets => {
    drawCharts(datasets);
});

function drawCharts(datasets) {
    const margin = {top: 0, right: 0, bottom: 0, left: 100};
    const width = window.innerWidth;  // Updated for correct width calculation
    const height = 25; // Height of each individual chart
    const gap = 5; // Vertical gap between charts

    const overallHeight = (height + gap) * datasets.length;

    const tooltip = d3.select("#tooltip");

    const svgContainer = d3.select("#freq_chart3").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", overallHeight);

    const x = d3.scaleTime()
        .domain([
            d3.min(datasets, data => d3.min(data, d => d.date)),
            d3.max(datasets, data => d3.max(data, d => d.date))
        ])
        .range([0, width]);

    // Create a chart for each dataset
    datasets.forEach((data, index) => {
        const y = d3.scaleLinear()
            .domain([0, d3.max(data, d => d.frequency)])
            .range([height, 0]);

        const area = d3.area()
            .x(d => x(d.date))
            .y0(height)
            .y1(d => y(d.frequency))
            .curve(d3.curveMonotoneX);

        const chartGroup = svgContainer.append("g")
            .attr("transform", `translate(${margin.left},${index * (height + gap)})`);

        chartGroup.append("path")
            .datum(data)
            .attr("fill", "#69b3a2")
            .attr("d", area)
            .on("mousemove", function(event, d) {
                tooltip.style("display", "block")
                    .style("left", (event.pageX + 10) + "px")
                    .style("top", (event.pageY - 20) + "px")
                    .html(`Date: ${d3.timeFormat("%m/%d/%Y")(x.invert(event.pageX - margin.left))}<br>Frequency: ${Math.floor(y.invert(height - event.offsetY))}`);
            })
            .on("mouseout", function() {
                tooltip.style("display", "none");
            });

        // Add the Y-axis with word label
        chartGroup.append("text")
            .attr("transform", "translate(-10,0)")
            .attr("y", 20)
            .attr("dy", ".35em")
            .style("text-anchor", "end")
            .text(data[0].phrase);
		
		// Add the X-axis (only for the last chart)
		if (index === datasets.length - 1) {
			const chartGroup = svgContainer.append("g")
				.attr("transform", `translate(${margin.left},${index * (height + gap + gap)})`);

			// Draw the area or bars for your chart here...

			// Adding X-axis with transformation for readability
			const xAxis = d3.axisBottom(x)
				.tickFormat(d3.timeFormat("%Y"))  // Format as full year
				.ticks(d3.timeYear.every(1));    // Ensure one tick per year

			const xAxisGroup = chartGroup.append("g")
				.attr("transform", `translate(0,${height})`)
				.call(xAxis);

			// Rotate labels for better visibility
			xAxisGroup.selectAll("text")
				.attr("transform", "rotate(-45)")
				.attr("dx", "-.8em")
				.attr("dy", ".15em")
				.style("text-anchor", "end");

			// Optional: Label for the x-axis
			xAxisGroup.append("text")
				.attr("x", width / 2)
				.attr("y", 40) // Adjust this to move the 'Year' label further down if needed
				.attr("fill", "#000")
				.style("font-size", "16px")
				.style("text-anchor", "middle")
				.text("Year");
			svgContainer.append("g")
				// .attr("transform", `translate(${margin.left},${index * (height + gap + 2)})`)
				.call(xAxis);
		}
	});
}
