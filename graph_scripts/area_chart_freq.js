// import * as d3 from 'd3';

// area_chart_freq.js


// export async function createAreaChart() {
const csvFilePath = 'word_freq/top_words_dataset2.csv';

// Function to fetch and parse the CSV file
async function fetchAndParseCSV(path) {
	const response = await fetch(path);
	const csv = await response.text();
	const lines = csv.split('\n');
	const data = [];

	for (let i = 1; i < lines.length; i++) {
		const line = lines[i].trim();
		if (line !== '') {
			const [word, frequency] = line.split(',');
			data.push({ word, frequency: parseInt(frequency) });
		}
	}

	return data;
}

// const data = await fetchAndParseCSV(csvFilePath);
d3.csv(csvFilePath).then(data => {
	data.forEach(d => {
		d.word = +d.word;
		d.frequency = +d.frequency;
	});

	const svg = d3.select('#chart3').append("svg")
		.attr("width", 500)
		.attr("height", 300);
	
	const x = d3.scaleBand()
		.domain(data.map(d => d.word))
		.range([0, 500])
		.padding(0.1);

	x.domain(data.map(d => d.word));
	const y = d3.scaleLinear()
		.domain([0, d3.max(data, d => d.frequency)])
		.range([300, 0]);
	
	svg.append("g")
		.attr("transform", "translate(0," + 300 + ")")
		.call(d3.axisBottom(x));
	
	svg.append("g")
		.call(d3.axisLeft(y));

	svg.selectAll("rect")
		.data(data)
		.enter().append("rect")
		.attr("x", d => x(d.word))
		.attr("y", d => y(d.frequency))
		.attr("width", x.bandwidth())
		.attr("height", d => 300 - y(d.frequency))
		.attr("fill", "steelblue")
		.on('mouseover', function(event, d) {
			d3.select(this).attr('fill', 'orange'); // Change color on mouse over
			tooltip.style('visibility', 'visible')
				.text(`${d.word}: ${d.frequency}`)
				.style('left', `${event.pageX + 10}px`)
				.style('top', `${event.pageY + 10}px`);
		})
		.on('mouseout', function() {
			d3.select(this).attr('fill', 'steelblue'); // Revert color on mouse out
			tooltip.style('visibility', 'hidden');
		});

	// createChart(data);
}).catch(error => {
	console.error('Error loading the CSV file: ', error);
});



// // Function to create the rectangular area chart
// function createChart(data) {
// 	const labels = data.map(item => item.word);
// 	const values = data.map(item => item.frequency);

// 	const svg = d3.select('#chart')
// 		.append('svg')
// 		.attr('width', 500)
// 		.attr('height', 300);

// 	const xScale = d3.scaleBand()
// 		.domain(labels)
// 		.range([0, 500])
// 		.padding(0.1);

// 	const yScale = d3.scaleLinear()
// 		.domain([0, d3.max(values)])
// 		.range([300, 0]);

// 	svg.selectAll('rect')
// 		.data(data)
// 		.enter()
// 		.append('rect')
// 		.attr('x', (d, i) => xScale(labels[i]))
// 		.attr('y', d => yScale(d.frequency))
// 		.attr('width', xScale.bandwidth())
// 		.attr('height', d => 300 - yScale(d.frequency))
// 		.attr('fill', 'rgba(75, 192, 192, 0.2)')
// 		.attr('stroke', 'rgba(75, 192, 192, 1)')
// 		.attr('stroke-width', 1);

// 	svg.append('g')
// 		.attr('transform', 'translate(0, 300)')
// 		.call(d3.axisBottom(xScale));

// 	svg.append('g')
// 		.call(d3.axisLeft(yScale));
// }

// const data = await fetchAndParseCSV(csvFilePath);
// createChart(data);
// // }