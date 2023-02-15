// append the svg object to the body of the page
const svgline1 = d3
  .select("#line1")
  .append("svg")
  .attr(
    "viewBox",
    `0 0 ${width + margin.left + margin.right} ${
      height + margin.top + margin.bottom
    }`
  )
  .attr("preserveAspectRatio", "xMinYMin meet")
  .attr("width", "100%")
  .append("g")
  .attr("transform", `translate(${margin.left},${margin.top})`);
//Read the data
d3.csv("data/Total_line.csv").then(function (data) {
  //console.log(data.slice(0,-1))

  // group the data: I want to draw one line per group
  const sumstat = d3.group(data, (d) => d.CC); // nest function allows to group the calculation per level of a factor
  console.log(sumstat);
  // Add X axis --> it is a date format
  const x = d3
    .scaleLinear()
    .domain(
      d3.extent(data, function (d) {
        return d.YY;
      })
    )
    .range([0, width]);
  svgline1
    .append("g")
    .attr("transform", `translate(0, ${height})`)
    .call(d3.axisBottom(x).ticks(5));

  // Add Y axis
  const y = d3
    .scaleLinear()
    .domain([
      40,
      d3.max(data, function (d) {
        return +d.LE;
      }),
    ])
    .range([height, 0]);
  svgline1.append("g").call(d3.axisLeft(y));

  // color palette
  const color = d3
    .scaleOrdinal()
    .range([
      "#e41a1c",
      "#377eb8",
      "#4daf4a",
      "#984ea3",
      "#ff7f00",
      "#ffff33",
      "#a65628",
      "#f781bf",
      "#999999",
    ]);

  // Draw the line
  // add the lines
  const lines = svgline1
    .selectAll(".line")
    .data(sumstat)
    .join("path")
    .attr("fill", "none")
    .attr("stroke", function (d) {
      return color(d[0]);
    })
    .attr("stroke-width", 1.5)
    .attr("d", function (d) {
      return d3
        .line()
        .x(function (d) {
          return x(d.YY);
        })
        .y(function (d) {
          return y(+d.LE);
        })(d[1]);
    })
    .on("mouseover", function (d) {
      d3.select(this).attr("stroke-width", 3).attr("stroke", "black");
    })
    .on("mouseout", function (d) {
      d3.select(this)
        .attr("stroke-width", 1.5)
        .attr("stroke", function (d) {
          return color(d[0]);
        });
    });
});
