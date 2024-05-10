// import * as d3 from 'd3';

// Import D3 library

// Read the data from data.json
d3.json('./word_freq/top_words_cnn.json').then(data => {
	// Extract words and frequencies from the data
	var words = []
	var frequencies = []
	for (var i = 0; i < data.length ; i++) {
		words.push(data[i].word)
		frequencies.push(data[i].frequency)
	}
	// const words = Object.keys(data);
	// const frequencies = Object.values(data);

	// console.log(words);
	// console.log(frequencies);

	// Sort data by frequencies in descending order
	var dataSorted = words.map((word, index) => ({ word, frequency: frequencies[index] }))
	.sort((a, b) => b.frequency - a.frequency);
	words = dataSorted.map(d => d.word);
	frequencies = dataSorted.map(d => d.frequency);

	const margin = { top: 20, right: 20, bottom: 30, left: 50 },
      width = window.innerWidth - margin.left - margin.right,
      height = 500 - margin.top - margin.bottom;
	// Setup SVG container
	const svg = d3.select('#chart1').append('svg')
		// .attr('width', window.innerWidth - 200)
		// .attr('height', 500);
		.attr("width", width + margin.left + margin.right)
		.attr("height", height + margin.top + margin.bottom)
		.append("g")
		.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

	// Set up the scales
	const xScale = d3.scaleBand()
	.domain(words)
	.range([0, width - margin.left - margin.right]) // Slightly less than full width to fit axis
	.padding(0.1);

	const yScale = d3.scaleLinear()
	.domain([0, d3.max(frequencies)])
	.range([450, 0]); // Slightly less than full height to fit axis

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

	// Create the bars
	svg.selectAll('rect')
	.data(dataSorted)
	.enter()
	.append('rect')
	.attr('x', d => xScale(d.word))
	.attr('y', d => yScale(d.frequency))
	.attr('width', xScale.bandwidth())
	.attr('height', d => 450 - yScale(d.frequency))// Compute the height of each bar
	.attr('fill', 'steelblue')
	.on('mouseover', function(event, d) {
		d3.select(this).attr('fill', 'orange'); // Change color on hover
		tooltip.style('visibility', 'visible')
			   .text(`${d.word}: ${d.frequency}`)
			   .style('left', `${event.pageX + 10}px`)
			   .style('top', `${event.pageY + 10}px`);
	  })
	  .on('mouseout', function() {
		d3.select(this).attr('fill', 'steelblue'); // Revert color on mouse out
		tooltip.style('visibility', 'hidden');
	  });

	// // Add x-axis
	// svg.append('g')
	// .attr('transform', 'translate(0, 450)') // Position at the bottom of the svg
	// .call(d3.axisBottom(xScale));

	// Add x-axis
	const xAxisGroup = svg.append('g')
	.attr('transform', `translate(0, ${height})`) // Position at the bottom of the svg
	.call(d3.axisBottom(xScale));

	// Rotate x-axis labels to avoid overlap
	xAxisGroup.selectAll("text")
	.style("text-anchor", "end") // Anchor text at the end to align properly when rotated
	.attr("dx", "-.8em")
	.attr("dy", ".15em")
	.attr("transform", "rotate(-35)"); // Rotate labels by -45 degrees

	// Add y-axis
	svg.append('g')
	.call(d3.axisLeft(yScale));

	}).catch(error => {
	console.error('Error loading or parsing data:', error);
	});
// Path: sentiment_d3.js	