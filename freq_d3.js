// import * as d3 from 'd3';

// Import D3 library

// Read the data from data.json
d3.json('./data.json').then(data => {
	// Extract words and frequencies from the data
	const words = Object.keys(data);
	const frequencies = Object.values(data);

	// Set up the SVG container
	const svg = d3.select('body')
		.append('svg')
		.attr('width', 500)
		.attr('height', 500);

	// Set up the scales
	const xScale = d3.scaleBand()
		.domain(words)
		.range([0, 400])
		.padding(0.1);

	const yScale = d3.scaleLinear()
		.domain([0, d3.max(frequencies)])
		.range([400, 0]);

	// Create the bars
	svg.selectAll('rect')
		.data(words)
		.enter()
		.append('rect')
		.attr('x', d => xScale(d))
		.attr('y', d => yScale(data[d]))
		.attr('width', xScale.bandwidth())
		.attr('height', d => 400 - yScale(data[d]))
		.attr('fill', 'steelblue');

	// Add x-axis
	svg.append('g')
		.attr('transform', 'translate(0, 400)')
		.call(d3.axisBottom(xScale));

	// Add y-axis
	svg.append('g')
		.call(d3.axisLeft(yScale));
});