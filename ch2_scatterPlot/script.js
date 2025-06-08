import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";

// STEP 1: ACCESS DATA

const dataset = await d3
  .json("http://localhost:3000/api/weather")
  .then()
  .catch((e) => console.log(e));

const xAccessor = (d) => d.dewPoint;
const yAccessor = (d) => d.humidity;
const colorAcessor = (d) => d.cloudCover;

// STEP 2: CREATE CHART DIMENSIONS

const width = d3.min([window.innerWidth * 0.9, window.innerHeight * 0.9]);

const dimensions = {
  width: width,
  height: width,
  margin: {
    top: 10,
    right: 10,
    bottom: 50,
    left: 50,
  },
};

dimensions.boundedWidth =
  dimensions.width - dimensions.margin.left - dimensions.margin.right;

dimensions.boundedHeight =
  dimensions.height - dimensions.margin.top - dimensions.margin.bottom;

// STEP 3: DRAW CANVAS

const wrapper = d3
  .select("#wrapper")
  .append("svg")
  .attr("height", dimensions.height)
  .attr("width", dimensions.width);

const bounds = wrapper
  .append("g")
  .attr(
    "transform",
    `translate(${dimensions.margin.left},${dimensions.margin.top})`
  );

// STEP 4: CREATE SCALES
const xScale = d3
  .scaleLinear()
  .domain(d3.extent(dataset, xAccessor))
  .range([0, dimensions.boundedWidth])
  .nice(); //see below what nice does.

const yScale = d3
  .scaleLinear()
  .domain(d3.extent(dataset, yAccessor))
  .range([dimensions.boundedHeight, 0])
  .nice();

const colorScale = d3
  .scaleLinear()
  .domain(d3.extent(dataset, colorAcessor))
  .range(["skyblue", "darkslategrey"]);

// console.log(xScale.domain());
// xScale.nice();
// console.log(xScale.domain());

// STEP 5: DRAW DATA

// (below is loopy - there are better D3ish ways to do this)
// dataset.forEach((day) => {
//   bounds
//     .append("circle")
//     .attr("cx", xScale(xAccessor(day)))
//     .attr("cy", yScale(yAccessor(day)))
//     .attr("r", 5);
// });

// see below to understand what this does

// let dots = bounds.selectAll("circle");
// console.log(dots);
// dots = dots.data(dataset);
// console.log(dots);

const dots = bounds
  .selectAll("circle")
  .data(dataset)
  .enter()
  .append("circle")
  .attr("cx", (d) => xScale(xAccessor(d)))
  .attr("cy", (d) => yScale(yAccessor(d)))
  .attr("r", 5)
  .attr("fill", (d) => colorScale(colorAcessor(d)));

// STEP 6: DRAW PERIPHERSALS

const xAxisGenerator = d3.axisBottom().scale(xScale);

const xAxis = bounds
  .append("g")
  .call(xAxisGenerator)
  .attr("transform", `translate(0,${dimensions.boundedHeight})`);

const xAxisLabel = xAxis
  .append("text")
  .attr("x", dimensions.boundedWidth / 2)
  .attr("y", dimensions.margin.bottom)
  .attr("fill", "black")
  .attr("font-size", "1.4em") //We need to explicitly set the text fill to black because it inherits a fill value of none that d3 sets on the axis <g> element.
  .html("Dew Point (&deg;F)");

const yAxisGenerator = d3.axisLeft().scale(yScale);
const yAxis = bounds.append("g").call(yAxisGenerator);
const yAxisLabel = yAxis
  .append("text")
  .attr("x", -dimensions.boundedHeight / 2)
  .attr("y", -dimensions.margin.left + 10)
  .attr("fill", "black")
  .attr("text-anchor", "middle")
  .attr("transform", "rotate(-90)")
  .attr("font-size", "1.4em")
  .html("Relative humidity");
