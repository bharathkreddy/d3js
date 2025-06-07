import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";

const wChart = 500;
const hChart = 300;

const MARGIN = { LEFT: 100, RIGHT: 10, TOP: 10, BOTTOM: 100 };
const WIDTH = wChart - MARGIN.LEFT - MARGIN.RIGHT;
const HEIGHT = hChart - MARGIN.TOP - MARGIN.BOTTOM;

const svg = d3
  .select("#vis")
  .append("svg")
  .attr("width", WIDTH + MARGIN.LEFT + MARGIN.RIGHT)
  .attr("height", HEIGHT + MARGIN.TOP + MARGIN.BOTTOM);

const g = svg
  .append("g")
  .attr("transform", `translate(${MARGIN.LEFT}, ${MARGIN.TOP})`);

d3.json("buildings.json")
  .then((data) => {
    data.forEach((d) => (d.height = Number(d.height)));

    const x = d3
      .scaleBand()
      .domain(data.map((d) => d.name))
      .range([0, WIDTH])
      .paddingInner(0.25)
      .paddingOuter(0.1);

    const y = d3
      .scaleLinear()
      .domain([0, d3.max(data, (d) => d.height)])
      .range([HEIGHT, 0]);

    const xAxisCall = d3.axisBottom(x);
    g.append("g")
      .attr("class", "x axis")
      .attr("transform", `translate(0,${HEIGHT})`)
      .call(xAxisCall)
      .selectAll("text")
      .attr("text-anchor", "end")
      .attr("y", 10)
      .attr("x", -5)
      .attr("transform", "rotate(-40)");

    const yAxisCall = d3
      .axisLeft(y)
      .ticks(5)
      .tickFormat((d) => d + " m");
    g.append("g").attr("class", "y axis").call(yAxisCall);

    const bars = g.selectAll("rect").data(data);

    bars
      .enter()
      .append("rect")
      .attr("x", (d, i) => x(d.name))
      .attr("y", (d) => y(d.height))
      .attr("width", x.bandwidth)
      .attr("height", (d) => HEIGHT - y(d.height))
      .attr("fill", "red");

    g.append("text")
      .attr("x", WIDTH / 2)
      .attr("y", HEIGHT + 110)
      .text("REVENUE & PROFITS");
  })
  .catch((e) => console.log(e));
