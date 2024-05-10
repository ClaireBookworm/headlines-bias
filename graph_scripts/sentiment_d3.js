

// const containerWidth = d3.select("#chart2").node().getBoundingClientRect().width;
const margin = { top: 20, right: 50, bottom: 30, left: 30 },
      width = 1750 - margin.left - margin.right,
      height = 500 - margin.top - margin.bottom;

const x = d3.scaleTime().rangeRound([0, window.innerWidth - margin.left - margin.right]);
const y = d3.scaleLinear().rangeRound([height, 0]);


const linePolarity = d3.line()
    .defined(d => d.polarity > 0)
    .x(d => x(new Date(d.date)))
    .y(d => y(d.polarity))
    .curve(d3.curveMonotoneX);

const lineSubjectivity = d3.line()
    .defined(d => d.subjectivity > 0)
    .x(d => x(new Date(d.date)))
    .y(d => y(d.subjectivity))
    .curve(d3.curveMonotoneX);

d3.csv("sentiment/sentiment_dataset2.csv").then(data => {
	data.forEach(d => {
		// console.log(d)
		d.date = new Date(d.date);
		d.headline = d.headline;
		d.polarity = +d.polarity;
		d.subjectivity = +d.subjectivity;
		// d.published_date = new Date(d.published_date);
	});

	const containerWidth = d3.select("#chart2").node().getBoundingClientRect().width;
	const svg = d3.select("#chart2").append("svg")
		.attr("width", containerWidth) // + margin.left + margin.right)
		.attr("height", height + margin.top + margin.bottom)
		.append("g")
		.attr("transform", "translate(" + margin.left + "," + margin.top + ")");
		

	// const x = d3.scaleTime().rangeRound([0, width]);
	// Update the domain of x and y scales
	x.domain(d3.extent(data, d => d.date));
	y.domain([-0.5, 1]);

	svg.append("g")
		.attr("class", "axis axis--x")
		.attr("transform", "translate(0," + y(0) + ")")
		.call(d3.axisBottom(x));

	svg.append("g")
		.attr("class", "axis axis--y")
		.call(d3.axisLeft(y));

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

	svg.append("path")
		.datum(data)
		.attr("class", "line")
		.attr("d", linePolarity)
		.style("stroke", "orange")
		// .attr("transform", "translate(0," + y(0) + ")")
		.on('mouseover', function(event, d) {
			d3.select(this).attr('fill', '#FF5733'); // Change color on mouse over
			tooltip.style('visibility', 'visible')
				.text(`Date: ${d3.timeFormat("%m/%d/%Y")(x.invert(event.pageX - margin.left))}`)
				.style('left', `${event.pageX + 10}px`)
				.style('top', `${event.pageY + 10}px`);
		})
		.on('mouseout', function() {
			d3.select(this).attr('fill', 'orange'); // Revert color on mouse out
			tooltip.style('visibility', 'hidden');
		});
		

	svg.append("path")
		.datum(data)
		.attr("class", "line")
		.attr("d", lineSubjectivity)
		.style("stroke", "steelblue")
		.on('mouseover', function(event, d) {
			d3.select(this).attr('fill', 'steelblue'); // Change color on mouse over
			tooltip.style('visibility', 'visible')
				.text(`Date: ${d3.timeFormat("%m/%d/%Y")(x.invert(event.pageX - margin.left))}`)
				.style('left', `${event.pageX + 10}px`)
				.style('top', `${event.pageY + 10}px`);
		})
		.on('mouseout', function() {
			d3.select(this).attr('fill', 'steelblue'); // Revert color on mouse out
			tooltip.style('visibility', 'hidden');
		});

}).catch(error => {
	console.error('Error loading the CSV file: ', error);
});


// 	// console.log(data)
//     x.domain(d3.extent(data, d => d.published_date));
//     y.domain([0, 1]);

// 	svg.append("g")
// 	.attr("class", "axis axis--x")
// 	.attr("transform", "translate(0," + height + ")")
// 	.call(d3.axisBottom(x));

// 	svg.append("g")
// 	.attr("class", "axis axis--y")
// 	.call(d3.axisLeft(y));

// 	svg.append("path")
// 	.datum(data)
// 	.attr("class", "line")
// 	.attr("d", linePolarity)
// 	.style("stroke", "steelblue");

// 	svg.append("path")
// 	.datum(data)
// 	.attr("class", "line")
// 	.attr("d", lineSubjectivity)
// 	.style("stroke", "orange");

// 	// g = svg.append("g")

// }).catch(error => {
// 	console.error('Error loading the CSV file: ', error);
// });