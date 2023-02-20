// append the svg object to the body of the page
const svgParallel = d3.select("#parallelChart")
.append("svg")
.attr(
  "viewBox",
  `0 0 ${width + margin.left + margin.right+0} ${
    height + margin.top + margin.bottom
  }`
)
.attr("preserveAspectRatio", "xMinYMin meet")
.attr("width", "100%")
.append("g")
.attr("transform", `translate(${margin.left-10},${margin.top+10})`);

// Parse the Data
d3.csv("https://raw.githubusercontent.com/AlessandroPenco/LifeExpectancyAnalysis/main/data/parallelData.csv").then( function(data) {
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

  // Here I set the list of dimension manually to control the order of axis:
  dimensions = ["1950", "1975", "2000", "2018"]

  // For each dimension, I build a linear scale. I store all in a y object
  const y = {}
  for (i in dimensions) {
    nome = dimensions[i]
    y[nome] = d3.scaleLinear()
      .domain( [20, 100] ) // --> Same axis range for each group
      // --> different axis range for each group --> .domain( [d3.extent(data, function(d) { return +d[name]; })] )
      .range([height, 0])
  }
  console.log(y["1950"](70))
  // Build the X scale -> it find the best position for each Y axis
  x = d3.scalePoint()
    .range([0, width])
    .domain(dimensions);

  // Highlight the specie that is hovered
  const highlight = function(event, d){

    selected_continent = d.continent
    console.log(selected_continent)
    // first every group turns grey
    d3.selectAll(".line")
    .transition().duration(200)
    // .style("stroke", "lightgrey")
    .style("stroke-width", ".2")
    .style("opacity", "0.1")
    if(selected_continent!=""){
      // Second the hovered specie takes its color
      d3.selectAll("." + selected_continent)
        .transition().duration(200)
        // .style("stroke", colors[selected_continent])
        .style("opacity", "1")
        .style("stroke-width", "2")

    }
  }

  // Unhighlight
  const doNotHighlight = function(event, d){
    d3.selectAll(".line")
      .transition().duration(200).delay(1000)
      // .style("stroke", function(d){ return( colors[d.continent])} )
      .style("opacity", "1")
      .style("stroke-width", "1")
  }
  // The path function take a row of the csv as input, and return x and y coordinates of the line to draw for this raw.
  function path(d) {
    return d3.line()(dimensions.map(function(p) { return [x(p), y[p](d[p])]; }));
  }

  // Draw the lines
  svgParallel
    .selectAll("myPath")
    .data(data)
    .join("path")
      .attr("class", function (d) { return "line " + d.continent } ) // 2 class for each line: 'line' and the group name
      .attr("d",  path)
      .style("fill", "none" )
      .style("stroke", function(d){ return( colors[d.continent])} )
      .style("opacity", 0.5)
      .on("mouseover", highlight)
      .on("mouseleave", doNotHighlight)

  // Draw the axis:
  svgParallel.selectAll("myAxis")
    // For each dimension of the dataset I add a 'g' element:
    .data(dimensions).enter()
    .append("g")
    .attr("class", "axis")
    // I translate this element to its right position on the x axis
    .attr("transform", function(d) { return `translate(${x(d)})`})
    // And I build the axis with the call function
    .each(function(d) { d3.select(this).call(d3.axisLeft().ticks(5).scale(y[d])); })
    // Add axis title
    .append("text")
      .style("text-anchor", "middle")
      .style("font-size", "12px")
      .attr("y", -9)
      .text(function(d) { return d; })
      .style("fill", "black")

      let continents = [["AF", "Africa"], ["NA", "North America"], ["SA", "South America"], ["EU", "Europe"], ["AS", "Asia"], ["OC", "Oceania"]];


      function onMouseOverLegend(event) {
        var lineClass = event.target.classList[1];
        d3.selectAll(".line ")
        .style("stroke-width", ".2")
        .style("opacity", "0.1")
        d3.selectAll("." + lineClass)
        .style("opacity", "1")
        .style("stroke-width", "2")
    };
  
    function onMouseOutLegend(event) {
        d3.selectAll(".line ")
        .style("opacity", "1")
        .style("stroke-width", "1")
    };
      // legend
    for (let i = 0; i < continents.length; i++) {
      svgParallel.append("circle")
          .attr("cx", ((width)/5)*i)
          .attr("cy", height + 12)
          .attr("r", 6)
          .style("fill", colors[continents[i][0]])
          .attr("class", "line " + continents[i][0])
          .on("mouseover", onMouseOverLegend)
          .on("mouseout", onMouseOutLegend);
          svgParallel.append("text")
          .attr("x", (((width)/5)*i)+10)
          .attr("y", height + 12)
          .text(continents[i][1])
          .style("font-size", "7px")
          .attr("alignment-baseline", "middle")
          .attr("class", "line " + continents[i][0])
          .on("mouseover", onMouseOverLegend)
          .on("mouseout", onMouseOutLegend);
      };

      svgParallel.append("text")
      .attr("class", "y label")
      .attr("text-anchor", "end")
      .attr("y", -36)
      .attr("x", 0)
      .attr("dy", ".75em")
      .attr("transform", "rotate(-90)")
      .style("font-size", "9px")
      .text("Life expectancy at birth (YY)");
      
})