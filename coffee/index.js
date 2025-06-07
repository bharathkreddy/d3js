import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";

const chartHeight = 400;
const chartWidth = 500;

const MARGIN = { LEFT: 100, TOP: 10, RIGHT: 100, BOTTOM: 100 };
const WIDTH = chartWidth - MARGIN.RIGHT - MARGIN.LEFT;
const HEIGHT = chartHeight - MARGIN.TOP - MARGIN.BOTTOM;

const svg = d3
  .select("#chart")
  .append("svg")
  .attr("height", chartHeight)
  .attr("width", chartWidth);

const g = d3
  .select("svg")
  .append("g")
  .attr("transform", `translate(${MARGIN.LEFT},${MARGIN.TOP})`);

d3.csv("data.csv").then((data) => {
  data.forEach((d) => {
    d.revenue = Number(d.revenue);
    d.profit = Number(d.profit);
  });

  const x = d3
    .scaleBand()
    .domain(d3.map(data, (d) => d.month))
    .range([0, WIDTH])
    .paddingInner(0.25)
    .paddingOuter(0.15);

  const y = d3
    .scaleLinear()
    .domain([0, d3.max(data, (d) => d.revenue)])
    .range([HEIGHT, 0]);

  const yr = d3
    .scaleLinear()
    .domain([0, d3.max(data, (d) => d.profit)])
    .range([HEIGHT, 0]);

  const rectangles = g.selectAll("rect").data(data);
  rectangles
    .enter()
    .append("rect")
    .attr("x", (d) => x(d.month))
    .attr("y", (d) => y(d.revenue))
    .attr("width", x.bandwidth())
    .attr("height", (d) => HEIGHT - y(d.revenue))
    .attr("fill", "green");

  const circles = g.selectAll("circle").data(data);
  circles
    .enter()
    .append("circle")
    .attr("cx", (d) => x(d.month))
    .attr("cy", (d) => y(d.profit))
    .attr("r", 5)
    .attr("fill", "red")
    .attr("transform", `translate(${x.bandwidth() / 2},0)`);

  const xAxisCall = d3.axisBottom(x);
  const gx = g
    .append("g")
    .attr("transform", `translate(0,${HEIGHT})`)
    .call(xAxisCall);

  const yAxisCall = d3.axisLeft(y).tickFormat(d3.format(",.0f"));
  const gy = g.append("g").attr("transform", `translate(0,0)`).call(yAxisCall);

  const yAxisCall2 = d3.axisRight(yr).tickFormat(d3.format(",.0f"));
  const gy2 = g
    .append("g")
    .attr("transform", `translate(${WIDTH},0)`)
    .call(yAxisCall2);

  g.append("text")
    .attr("text-anchor", "middle")
    .attr("x", WIDTH / 2)
    .attr("y", HEIGHT + 45)
    .text("MONTH OF THE YEAR");

  g.append("text")
    .attr("text-anchor", "middle")
    .attr("x", -HEIGHT / 2)
    .attr("y", -50)
    .attr("transform", `rotate(-90)`)
    .text("REVENUES");
  g.append("text")
    .attr("text-anchor", "middle")
    .attr("x", HEIGHT / 2)
    .attr("y", -WIDTH - 50)
    .attr("transform", `rotate(90)`)
    .text("PROFITS");
});
