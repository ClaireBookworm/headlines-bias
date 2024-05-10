// Import D3 library

// Read the data from data.json
d3.json('./word_freq/top_words_dataset2.json').then(data => {
    // Extract words and frequencies from the data
    var words = [];
    var frequencies = [];
    for (var i = 0; i < data.length ; i++) {
        words.push(data[i].word);
        frequencies.push(data[i].frequency);
    }

    // Sort data by frequencies in descending order
    var dataSorted = words.map((word, index) => ({ word, frequency: frequencies[index] }))
    .sort((a, b) => b.frequency - a.frequency);
    words = dataSorted.map(d => d.word);
    frequencies = dataSorted.map(d => d.frequency);

    const margin = { top: 5, right: 20, bottom: 45, left: 50 },
          width = window.innerWidth - margin.left - margin.right,
          height = 300 - margin.top - margin.bottom;

    // Setup SVG container
    const svg = d3.select('#chart1_dataset2').append('svg')
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    // Set up the scales
    const xScale = d3.scaleBand()
        .domain(words)
        .range([0, width])
        .padding(0.1);

    const yScale = d3.scaleLinear()
        .domain([0, d3.max(frequencies)])
        .range([height, 0]);
	
	// Sort the array in descending order
	const sortedValues = frequencies.sort((a, b) => b - a);

	// Get the second maximum value
	const secondMaxValue = sortedValues[1];

    const colorScale = d3.scaleSequential(d3.interpolateGreys)
		.domain([0, secondMaxValue]);
        // .domain([0, d3.max(frequencies)]);


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
		
	svg.selectAll('rect')
		.data(dataSorted)
		.enter()
		.append('rect')
		.attr('x', d => xScale(d.word))
		.attr('y', d => yScale(d.frequency))
		.attr('width', xScale.bandwidth())
		.attr('height', d => height - yScale(d.frequency))
		.attr('fill', d => colorScale(d.frequency)) 
		.on('mouseover', function(event, d) {
			d3.select(this).attr('fill', d3.rgb(colorScale(d.frequency)).darker(0.75)); // Darken color on hover
			tooltip.style('visibility', 'visible')
				.text(`${d.word}: ${d.frequency}`)
				.style('left', `${event.pageX + 10}px`)
				.style('top', `${event.pageY + 10}px`);
		})
		.on('mouseout', function(event, d) {
			d3.select(this).attr('fill', colorScale(d.frequency)); // Revert to original color
			tooltip.style('visibility', 'hidden');
		});

    // Add axes
    svg.append('g')
        .attr('transform', `translate(0, ${height})`)
        .call(d3.axisBottom(xScale))
        .selectAll("text")
        .style("text-anchor", "end")
        .attr("dx", "-.8em")
        .attr("dy", ".15em")
        .attr("transform", "rotate(-35)");

    svg.append('g')
        .call(d3.axisLeft(yScale));
}).catch(error => {
    console.error('Error loading or parsing data:', error);
});
