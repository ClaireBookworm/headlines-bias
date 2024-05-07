const margin = { top: 20, right: 20, bottom: 30, left: 50 },
      width = 1750 - margin.left - margin.right,
      height = 500 - margin.top - margin.bottom;

// const svg = d3.select("#chart2").append("svg")
//       .attr("width", width + margin.left + margin.right)
//       .attr("height", height + margin.top + margin.bottom)
//     .append("g")
//       .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// https://community.openai.com/t/custom-gpt-news-bias-analyzer-with-api-graphing/508337
// hume ai ! 
// https://console.cloud.google.com/vertex-ai/generative/language/gallery?project=ancient-binder-421514

// width=1750
// height=500
const x = d3.scaleTime().rangeRound([0, width]);
const y = d3.scaleLinear().rangeRound([height, 0]);


const linePolarity = d3.line()
.defined(d => d.polarity !== 0)
.x(d => x(new Date(d.published_date)))
.y(d => y(d.polarity));

const lineSubjectivity = d3.line()
.defined(d => d.subjectivity !== 0)
.x(d => x(new Date(d.published_date)))
.y(d => y(d.subjectivity));

d3.csv("sentiment/sentiment_nltk.csv").then(data => {
	data.forEach(d => {
		d.polarity = +d.polarity;
		d.subjectivity = +d.subjectivity;
		d.published_date = new Date(d.published_date);
	});

    const svg = d3.select("#chart2").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
      .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

	console.log(data)
    x.domain(d3.extent(data, d => d.published_date));
    y.domain([0, 1]);

	svg.append("g")
	.attr("class", "axis axis--x")
	.attr("transform", "translate(0," + height + ")")
	.call(d3.axisBottom(x));

	svg.append("g")
	.attr("class", "axis axis--y")
	.call(d3.axisLeft(y));

	svg.append("path")
	.datum(data)
	.attr("class", "line")
	.attr("d", linePolarity)
	.style("stroke", "steelblue");

	svg.append("path")
	.datum(data)
	.attr("class", "line")
	.attr("d", lineSubjectivity)
	.style("stroke", "orange");

	// g = svg.append("g")

}).catch(error => {
	console.error('Error loading the CSV file: ', error);
});