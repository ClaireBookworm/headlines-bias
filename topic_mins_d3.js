// Load data from CSV file
d3.csv("datasets/topic_minutes.csv").then(data => {
    // Set dimensions and margins for the graph
    const margin = { top: 20, right: 50, bottom: 30, left: 150 },
          width = 960 - margin.left - margin.right,
          height = 20 * data.length; // Dynamic height based on number of topics

    // Create SVG canvas
    const svg = d3.select("#minutes_chart4").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom + 50)
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

    // Create a scale for your x-axis
    const x = d3.scaleLinear()
        .domain([0, d3.max(data, d => d.Total)])
        .range([0, width]);

    // Create a scale for your y-axis
    const y = d3.scaleBand()
        .domain(data.map(d => d.Topic))
        .range([0, height])
        .padding(0.1);

    // Colors for each news outlet
    const colors = ["#6b486b", "#a05d56", "#d0743c"];
    const outletNames = ["ABC", "CBS", "NBC"];

    // Create a tooltip
    const tooltip = d3.select('body').append('div')
        .attr('class', 'tooltip')
        .style('position', 'absolute')
        .style('background-color', 'white')
        .style('border', 'solid')
        .style('border-width', '1px')
        .style('border-radius', '5px')
        .style('padding', '10px')
        .style('visibility', 'hidden'); // Hidden by default

    // Function to stack bars horizontally
    function stackBars(d) {
        let x0 = 0;
        return outletNames.map((name, index) => {
            return { name, x0: x0, x1: x0 += +d[name], color: colors[index] };
        });
    }

    // Create groups for each row in the dataset
    const groups = svg.selectAll("g.bar-group")
        .data(data)
        .enter().append("g")
        .attr("class", "bar-group")
        .attr("transform", d => `translate(0,${y(d.Topic)})`);

    // Add bars for each data point
    groups.selectAll("rect")
        .data(d => stackBars(d))
        .enter().append("rect")
        .attr("height", y.bandwidth())
        .attr("x", d => x(d.x0))
        .attr("width", d => x(d.x1) - x(d.x0))
        .attr("fill", d => d.color)
        .on('mouseover', function(event, d) {
            d3.select(this).attr('fill', 'black'); // Darken color on hover
            tooltip.style('visibility', 'visible')
                   .html(`${d.name}: ${d.x1 - d.x0}`)
                   .style('left', `${event.pageX + 10}px`)
                   .style('top', `${event.pageY + 10}px`);
        })
        .on('mouseout', function(event, d) {
            d3.select(this).attr('fill', d.color); // Revert to original color
            tooltip.style('visibility', 'hidden');
        });

    // Add x-axis
    svg.append('g')
        .attr('transform', `translate(0,${height})`)
        .call(d3.axisBottom(x));

    // Add y-axis
    svg.append('g')
        .call(d3.axisLeft(y));

    // Add legend
    const legend = svg.append("g")
        .attr("transform", `translate(0,${height + 40})`);

    outletNames.forEach((outlet, index) => {
        legend.append("rect")
            .attr("x", 100 * index)
            .attr("width", 18)
            .attr("height", 18)
            .style("fill", colors[index]);

        legend.append("text")
            .attr("x", 100 * index + 24)
            .attr("y", 9)
            .attr("dy", ".35em")
            .style("text-anchor", "start")
            .text(outlet);
    });
});