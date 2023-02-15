// append the svg object to the body of the page
const svgline1 = d3
  .select("#line1")
  .append("svg")
  .attr(
    "viewBox",
    `0 0 ${width + margin.left + margin.right+50} ${
      height + margin.top + margin.bottom
    }`
  )
  .attr("preserveAspectRatio", "xMinYMin meet")
  .attr("width", "100%")
  .append("g")
  .attr("transform", `translate(${margin.left},${margin.top+10})`);
//Read the data
d3.csv("../../data/Total_line.csv").then(function (data) {
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
  var color = d3
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
  svgline1
    .selectAll(".line")
    .data(sumstat)
    .join("path")
    .attr("fill", "none")
    .style("stroke", function (d) {
      return color(d[0]);
    })
    .attr("class", function(d){ 
      return "line"+((d+"").split(",")[0]);
    })
    .style("stroke-width", 1.5)
    .attr("d", function (d) {
      return d3.line()
        .x(function (d) {
          return x(d.YY);
        })
        .y(function (d) {
          return y(+d.LE);
        })(d[1]);
    })
    .on("mouseover", function (event, d) {
      // make all regions' color duller and delete stroke
      svgline1.selectAll("path")
          .style("stroke", "grey")
          .style("fill-opacity", "0.5")

      // make hovered ragion (id corresponding to hovered element) color normal
      svgline1.selectAll(`.line${((d+"").split(",")[0])}`)
          .style("fill-opacity", "1")
          .style("stroke", "black")
          .style("stroke-width", "2px")
    })
    .on("mouseout", function (event, d) {
      // make hovered ragion (id corresponding to hovered element) color normal
      svgline1.selectAll("path")
      .style("stroke", function (d) {
        return color(d[0]);
      })
        .style("fill-opacity", "1")
    });

    
    let continents = ["Africa", "America", "Europe", "Asia", "Australia"]
     // legend
     for (let i = 0; i < continents.length; i++) {
      svgline1.append("circle")
          .attr("cx", (width/5)*(i))
          .attr("cy", -10)
          .attr("r", 6)
          .style("fill", color(i))
          svgline1.append("text")
          .attr("x", (width/5)*(i)+10)
          .attr("y", -10)
          .text(continents[i])
          .style("font-size", "15px")
          .attr("alignment-baseline", "middle")
     }
});

