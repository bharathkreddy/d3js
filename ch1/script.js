import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";

async function drawLineChart() {
  //some code
}

drawLineChart();

// STEP 1: READ DATA

const dataset = await d3
  .json("http://localhost:3000/api/weather")
  .then()
  .catch((err) => console.error("API fetch error:", err));

console.log(dataset); // Now contains your weather data
console.table(dataset[0]);

// STEP 2: ACCESSOR FUNCTIONS

//Accessor functions convert a single data point into the metric value.
// dataset = table, data point = a record i.e. data for a day, temp is a metric.
const yAccessor = (d) => d.temperatureMax;

const dateParser = d3.timeParse("%Y-%m-%d"); //date is in string.
const xAccessor = (d) => dateParser(d.date);

// STEP 3: DEFINE DIMESIONS (WRAPPER & BOUNDS)

let dimensions = {
  width: window.innerWidth * 0.9,
  height: 400,
  margin: {
    top: 15,
    right: 15,
    bottom: 40,
    left: 60,
  },
};

dimensions.boundedWidth =
  dimensions.width - dimensions.margin.left - dimensions.margin.right;

dimensions.boundedHeight =
  dimensions.height - dimensions.margin.top - dimensions.margin.bottom;

// STEP 4: ADDING SVG
// const wrapper = d3.select("#wrapper");
// console.log(wrapper);
// const svg = wrapper.append("svg");
// console.log(svg);
// svg.attr("width", dimensions.width);
// svg.attr("height", dimensions.height);

const wrapper = d3
  .select("#wrapper")
  .append("svg")
  .attr("width", dimensions.width)
  .attr("height", dimensions.height);

// STEP 5: CREATE A GROUP FOR BOUNDING BOX
// <g> is like a div for svg, not visible on its own and expands to fit its contents

const bounds = wrapper
  .append("g")
  .style(
    "transform",
    `translate(${dimensions.margin.left}px,${dimensions.margin.top}px)`
  );

// STEP 6: CREATING SCALES
// scale is function that converts values between two domains

const yScale = d3
  .scaleLinear()
  .domain(d3.extent(dataset, yAccessor))
  .range([dimensions.boundedHeight, 0]);

const freezingTemperaturePlacement = yScale(32);

const freezingTemperatures = bounds
  .append("rect")
  .attr("x", 0)
  .attr("width", dimensions.boundedWidth)
  .attr("y", freezingTemperaturePlacement)
  .attr("height", dimensions.boundedHeight - freezingTemperaturePlacement)
  .attr("fill", "#e0f3f3");

const xScale = d3
  .scaleTime()
  .domain(d3.extent(dataset, xAccessor))
  .range([0, dimensions.boundedWidth]);

// d attribute will take a few commands that can be capitalized (if giving an absolute value) or lowercased (if giving a relative value)
// M will move to a point (followed by x and y values)
// L will draw a line to a point (followed by x and y values)
// Z will draw a line back to the first point

// bounds.append("path").attr("d", "M 0 0 L 100 0 L 100 100 L 0 50 Z");
// we dont need to do this as we d3 has generators

// line generator takes x,y co-ords, accessor functions give unscaled values
const lineGenerator = d3
  .line()
  .x((d) => xScale(xAccessor(d)))
  .y((d) => yScale(yAccessor(d)));

// add path and 'd' attribute
// add some styling as default is a black fill
const line = bounds
  .append("path")
  .attr("d", lineGenerator(dataset))
  .attr("fill", "none")
  .attr("stroke", "#af9358")
  .attr("stroke-width", 2);

// STEP 7: DRAW AXES

const yAxisGenerator = d3.axisLeft().scale(yScale);
// when axis generator function is called - it generates a lot of elements, group them in a <g>

// const yAxis = bounds.append("g");
// yAxisGenerator(yAxis);

// we can use method chaining instead of saving results in variables
const yAxis = bounds.append("g").call(yAxisGenerator);

const xAxisGenerator = d3.axisBottom().scale(xScale);
const xAxis = bounds
  .append("g")
  .call(xAxisGenerator)
  .attr("transform", `translate(0,${dimensions.boundedHeight})`);
