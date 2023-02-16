

// append the svg object to the body of the page
const svgline2 = d3
  .select("#line2")
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
  .attr("transform", `translate(${margin.left-20},${margin.top})`);

//Read the data
d3.csv("https://raw.githubusercontent.com/AlessandroPenco/LifeExpectancyAnalysis/main/data/myLE-UN-Projections.csv").then(function (data) {
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
    const xAxis = svgline2
    .append("g")
    .attr("transform", `translate(0, ${height})`)
    .call(d3.axisBottom(x).ticks(5));

  // Add Y axis
  const y = d3
    .scaleLinear()
    .domain([
      40,
      d3.max(data, function (d) {
        return +d.LEPred;
      }),
    ])
    .range([height, 0]);
  svgline2.append("g").call(d3.axisLeft(y));

  // color palette
  const colors = {
    'AF': '#fc7979',
    'Africa': '#fc7979',

    'AS': '#fae078',
    'Asia': '#fae078',

    'EU': '#80fc79',
    'Europe': '#80fc79',

    'NA': '#77f7ea',
    'NNorth AmericaA': '#77f7ea',

    'OC': '#6380f2',
    'Oceania': '#6380f2',

    'SA': '#955ffa',
    'South America': '#955ffa',

    'AllWorld': '#fc5be2',
    'World': '#fc5be2'
};

const lineChart = svgline2.append('g')
.attr("clip-path", "url(#clip)")


  // Draw the line
  // add the lines
  lineChart
    .selectAll(".line")
    .data(sumstat)
    .join("path")
    .attr("fill", "none")
    .style("stroke", function (d) { return colors[d[0]] })
    .attr("class", d => "lowOpacityOnHover "+d[0])
    .style("stroke-width", 1.5)
    .attr("d", function (d) {
      return d3.line()
        .x(d => x(d.YY))
        .y(d => (d.LE!="" ? y(+d.LE) :  y(+d.LEPred)))
        .curve(d3.curveBasis)
        (d[1]);
    })

    .on("mouseover", function (event, d) {
      // make all regions' color duller and delete stroke
      svgline2.selectAll(`.lowOpacityOnHover`)
          // .style("stroke", "grey")
          .style("fill-opacity", "0.5")
          .style("stroke-width", ".7px")


      // make hovered ragion (id corresponding to hovered element) color normal
      svgline2.selectAll(`.lowOpacityOnHover.${d[0]}`)
          .style("fill-opacity", "1")
          .style("stroke-width", "5px")
    })
    .on("mouseout", function (event, d) {
      // make hovered ragion (id corresponding to hovered element) color normal
      svgline2.selectAll(`.lowOpacityOnHover`)
      .style("fill-opacity", "1")
      .style("stroke-width", "1px")
    });

    lineChart.append('line') 
    .style("stroke", "gray")
    .style("stroke-dasharray", "5")
    .style("stroke-width", 1)
    .attr("x1", x(2021))
    .attr("y1", 0)
    .attr("x2", x(2021))
    .attr("y2", height);
   

    let continents = [["AF", "Africa"], ["NA", "North America"], ["SA", "South America"], ["EU", "Europe"], ["AS", "Asia"], ["OC", "Oceania"], ["AllWorld", "World"]];

    function onMouseOverLegend(event) {
      var lineClass = event.target.classList[1];
      d3.selectAll(".lowOpacityOnHover")
          .style("opacity", "0.1")
      d3.selectAll("." + lineClass)
          .style("opacity", "1")
  };

  function onMouseOutLegend(event) {
      d3.selectAll(".lowOpacityOnHover")
          .style("opacity", "1")
  };
    // legend
    for (let i = 0; i < continents.length; i++) {
    svgline2.append("circle")
        .attr("cx", width+ margin.left + margin.right-60)
        .attr("cy", 100 + i * 18)
        .attr("r", 6)
        .style("fill", colors[continents[i][0]])
        .attr("class", "lowOpacityOnHover " + continents[i][0])
        .on("mouseover", onMouseOverLegend)
        .on("mouseout", onMouseOutLegend);
        svgline2.append("text")
        .attr("x", width+ margin.left + margin.right-50)
        .attr("y", 100 + i * 18)
        .text(continents[i][1])
        .style("font-size", "9px")
        .attr("alignment-baseline", "middle")
        .attr("class", "lowOpacityOnHover " + continents[i][0])
        .on("mouseover", onMouseOverLegend)
        .on("mouseout", onMouseOutLegend);
    };

    svgline2.append("text")
    .attr("class", "x label")
    .attr("text-anchor", "end")
    .style("font-size", "9px")
    .attr("y", height-5)
    .text("Time (YY)");

    svgline2.append("text")
    .attr("class", "y label")
    .attr("text-anchor", "end")
    .attr("y", -36)
    .attr("x", width)
    .attr("dy", ".75em")
    .attr("transform", "rotate(-90)")
    .style("font-size", "9px")
    .text("Life expectancy at birth (YY)");

    const clip = svgline2.append("defs").append("svg:clipPath")
  .attr("id", "clip")
  .append("svg:rect")
  .attr("width", width )
  .attr("height", height )
  .attr("x", 0)
  .attr("y", 0);

    // Add brushing
    const brush = d3.brushX()                 // Add the brush feature using the d3.brush function
      .extent( [ [0,0], [width,height] ] ) // initialise the brush area: start at 0,0 and finishes at width,height: it means I select the whole graph area
      .on("end", updateChart)

    // Add the brushing
    lineChart
      .append("g")
        .attr("class", "brush")
        .call(brush);
        
        
    let idleTimeout
    function idled() { idleTimeout = null; }
    
          // A function that update the chart for given boundaries
  function updateChart(event,d) {

    extent = event.selection

    // If no selection, back to initial coordinate. Otherwise, update X axis domain
    if(!extent){
      if (!idleTimeout) return idleTimeout = setTimeout(idled, 350); // This allows to wait a little bit
      x.domain(d3.extent(data, function(d) { return d.YY; }))
    }else{
      x.domain([ x.invert(extent[0]), x.invert(extent[1]) ])
      lineChart.select(".brush").call(brush.move, null) // This remove the grey brush area as soon as the selection has been done
    }

    // Update axis and area position
    xAxis.transition().duration(1000).call(d3.axisBottom(x).ticks(5))
    lineChart
      .selectAll("path")
      .transition().duration(1000)
      .attr("d", function (d) {
        return d3.line()
          .x(function (d) {
            return x(d.YY);
          })
          .y(function (d) {
            return (d.LE!="" ? y(+d.LE) :  y(+d.LEPred));
          })(d[1]);
      })
    }

});

