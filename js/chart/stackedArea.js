
function myAreaChart(entity){
d3.select("#stackedArea").selectAll('svg').remove()
// append the svg object to the body of the page
const svgStaked = d3.select("#stackedArea")
  .append("svg")
  .attr(
    "viewBox",
    `0 0 ${width + margin.left + margin.right+100} ${
      height + margin.top + margin.bottom+70
    }`
  )
  .attr("preserveAspectRatio", "xMinYMin meet")
  .attr("width", "100%")
  .append("g")
  .attr("transform", `translate(${margin.left},${margin.top+40})`);

// Parse the Data
d3.csv("../../data/healthy-life-expectancy-and-years-lived-with-disability.csv").then( function(data) {


  //////////
  // GENERAL //
  //////////

  // List of groups = header of the csv files
  const keys = data.columns.slice(1).slice(1).reverse();
  
  // console.log(keys)
  // color palette
  const color = d3.scaleOrdinal()
    .domain(keys)
    .range(d3.schemeSet2);


  var entityData = data.filter((d) => d.Entity==entity)
  // console.log(entityData)
  //stack the data?
  const stackedData = d3.stack().keys(keys)(entityData)

  // console.log(stackedData)


  //////////
  // AXIS //
  //////////

  // Add X axis
  const x = d3.scaleLinear()
    .domain(d3.extent(entityData, function(d) { return d.Year; }))
    .range([ 0, width ]);
  const xAxis = svgStaked.append("g")
    .attr("transform", `translate(0, ${height})`)
    .call(d3.axisBottom(x).ticks(5))

  // Add X axis label:
  svgStaked.append("text")
      .attr("text-anchor", "end")
      .attr("x", width)
      .attr("y", height+40 )
      .text("Time (year)");

  // Add Y axis label:
  svgStaked.append("text")
      .attr("text-anchor", "end")
      .attr("x", 0)
      .attr("y", -20 )
      .text("# of years lived")
      .attr("text-anchor", "start")

  // Add Y axis
  const y = d3.scaleLinear()
    .domain([0, 100])
    .range([ height, 0 ]);
  svgStaked.append("g")
    .call(d3.axisLeft(y).ticks(5))



  //////////
  // BRUSHING AND CHART //
  //////////

  // Add a clipPath: everything out of this area won't be drawn.
  const clip = svgStaked.append("defs").append("svg:clipPath")
      .attr("id", "clip")
      .append("svg:rect")
      .attr("width", width )
      .attr("height", height )
      .attr("x", 0)
      .attr("y", 0);

  // Add brushing
  const brush = d3.brushX()                 // Add the brush feature using the d3.brush function
      .extent( [ [0,0], [width,height] ] ) // initialise the brush area: start at 0,0 and finishes at width,height: it means I select the whole graph area
      .on("end", updateChart) // Each time the brush selection changes, trigger the 'updateChart' function

  // Create the scatter variable: where both the circles and the brush take place
  const areaChart = svgStaked.append('g')
    .attr("clip-path", "url(#clip)")

  // Area generator
  const area = d3.area()
    .x(function(d) { return x(d.data.Year); })
    .y0(function(d) { return y(d[0]); })
    .y1(function(d) { return y(d[1]); })

  // Show the areas
  areaChart
    .selectAll("mylayers")
    .data(stackedData)
    .join("path")
      .attr("class", function(d) { return "myArea " + d.key })
      .style("fill", function(d) { return color(d.key); })
      .attr("d", area)

  // Add the brushing
  areaChart
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
      x.domain(d3.extent(data, function(d) { return d.Year; }))
    }else{
      x.domain([ x.invert(extent[0]), x.invert(extent[1]) ])
      areaChart.select(".brush").call(brush.move, null) // This remove the grey brush area as soon as the selection has been done
    }

    // Update axis and area position
    xAxis.transition().duration(1000).call(d3.axisBottom(x).ticks(5))
    areaChart
      .selectAll("path")
      .transition().duration(1000)
      .attr("d", area)
    }



    //////////
    // HIGHLIGHT GROUP //
    //////////

    // What to do when one group is hovered
    const highlight = function(event,d){
      // reduce opacity of all groups
      d3.selectAll(".myArea").style("opacity", .1)
      // expect the one that is hovered
      d3.select("."+d).style("opacity", 1)
    }

    // And when it is not hovered anymore
    const noHighlight = function(event,d){
      d3.selectAll(".myArea").style("opacity", 1)
    }



    //////////
    // LEGEND //
    //////////

    // Add one dot in the legend for each name.
    const size = 20
    svgStaked.selectAll("myrect")
      .data(keys)
      .join("rect")
        .attr("x", 400)
        .attr("y", function(d,i){ return 10 + i*(size+5)}) // 100 is where the first dot appears. 25 is the distance between dots
        .attr("width", size)
        .attr("height", size)
        .style("fill", function(d){ return color(d)})
        .on("mouseover", highlight)
        .on("mouseleave", noHighlight)

    // Add one dot in the legend for each name.
    svgStaked.selectAll("mylabels")
      .data(keys)
      .join("text")
        .attr("x", 400 + size*1.2)
        .attr("y", function(d,i){ return 10 + i*(size+5) + (size/2)}) // 100 is where the first dot appears. 25 is the distance between dots
        .style("fill", function(d){ return color(d)})
        .text(function(d){ return d})
        .attr("text-anchor", "left")
        .style("alignment-baseline", "middle")
        .on("mouseover", highlight)
        .on("mouseleave", noHighlight)

    svgStaked.append('text').text(entity).attr("x", width/2)

})

}
myAreaChart("Afghanistan")