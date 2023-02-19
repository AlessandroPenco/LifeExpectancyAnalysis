// // append the svg object to the body of the page
// const svgParallel = d3.select("#parallelChart")
// .append("svg")
// .attr(
//   "viewBox",
//   `0 0 ${width + margin.left + margin.right+0} ${
//     height + margin.top + margin.bottom+0
//   }`
// )
// .attr("preserveAspectRatio", "xMinYMin meet")
// .attr("width", "100%")
// .append("g")
// .attr("transform", `translate(${margin.left+0},${margin.top+10})`);

// // Parse the Data
// d3.csv("https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/iris.csv").then( function(data) {
//   console.log(data)

//   // Color scale: give me a specie name, I return a color
//   const color = d3.scaleOrdinal()
//     .domain(["setosa", "versicolor", "virginica" ])
//     .range([ "#440154ff", "#21908dff", "#fde725ff"])

//   // Here I set the list of dimension manually to control the order of axis:
//   dimensions = ["Petal_Length", "Petal_Width", "Sepal_Length", "Sepal_Width"]

//   // For each dimension, I build a linear scale. I store all in a y object
//   const y = {}
//   for (i in dimensions) {
//     name = dimensions[i]
//     y[name] = d3.scaleLinear()
//       .domain( [0,8] ) // --> Same axis range for each group
//       // --> different axis range for each group --> .domain( [d3.extent(data, function(d) { return +d[name]; })] )
//       .range([height, 0])
//   }

//   // Build the X scale -> it find the best position for each Y axis
//   x = d3.scalePoint()
//     .range([0, width])
//     .domain(dimensions);

//   // Highlight the specie that is hovered
//   const highlight = function(event, d){

//     selected_specie = d.Species
//     console.log(selected_specie)
//     // first every group turns grey
//     d3.selectAll(".line")
//       .transition().duration(200)
//       .style("stroke", "lightgrey")
//       .style("opacity", "0.2")
//     // Second the hovered specie takes its color
//     d3.selectAll("." + selected_specie)
//       .transition().duration(200)
//       .style("stroke", color(selected_specie))
//       .style("opacity", "1")
//   }

//   // Unhighlight
//   const doNotHighlight = function(event, d){
//     d3.selectAll(".line")
//       .transition().duration(200).delay(1000)
//       .style("stroke", function(d){ return( color(d.Species))} )
//       .style("opacity", "1")
//   }

//   // The path function take a row of the csv as input, and return x and y coordinates of the line to draw for this raw.
//   function path(d) {
//       return d3.line()(dimensions.map(function(p) { return [x(p), y[p](d[p])]; }));
//   }

//   // Draw the lines
//   svgParallel
//     .selectAll("myPath")
//     .data(data)
//     .join("path")
//       .attr("class", function (d) { return "line " + d.Species } ) // 2 class for each line: 'line' and the group name
//       .attr("d",  path)
//       .style("fill", "none" )
//       .style("stroke", function(d){ return( color(d.Species))} )
//       .style("opacity", 0.5)
//       .on("mouseover", highlight)
//       .on("mouseleave", doNotHighlight )

//   // Draw the axis:
//   svgParallel.selectAll("myAxis")
//     // For each dimension of the dataset I add a 'g' element:
//     .data(dimensions).enter()
//     .append("g")
//     .attr("class", "axis")
//     // I translate this element to its right position on the x axis
//     .attr("transform", function(d) { return `translate(${x(d)})`})
//     // And I build the axis with the call function
//     .each(function(d) { d3.select(this).call(d3.axisLeft().ticks(5).scale(y[d])); })
//     // Add axis title
//     .append("text")
//       .style("text-anchor", "middle")
//       .attr("y", -9)
//       .text(function(d) { return d; })
//       .style("fill", "black")

// })

// append the svg object to the body of the page
const svgParallel = d3.select("#parallelChart")
.append("svg")
.attr(
  "viewBox",
  `0 0 ${width + margin.left + margin.right+0} ${
    height + margin.top + margin.bottom+0
  }`
)
.attr("preserveAspectRatio", "xMinYMin meet")
.attr("width", "100%")
.append("g")
.attr("transform", `translate(${margin.left+0},${margin.top+10})`);

// Parse the Data
d3.csv("../../data/parallelData.csv").then( function(data) {
  console.log(data)
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
      .domain( [40, 100] ) // --> Same axis range for each group
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

    // first every group turns grey
    d3.selectAll(".line")
      .transition().duration(200)
      .style("stroke", "lightgrey")
      .style("opacity", "0.2")
    // Second the hovered specie takes its color
    d3.selectAll("." + selected_continent)
      .transition().duration(200)
      .style("stroke", color(selected_continent))
      .style("opacity", "1")
  }

  // Unhighlight
  const doNotHighlight = function(event, d){
    d3.selectAll(".line")
      .transition().duration(200).delay(1000)
      .style("stroke", function(d){ return( color(d.continent))} )
      .style("opacity", "1")
  }
  console.log(y[60])
  console.log(d3.line()(dimensions.map(function(p) { return [x(p), y[p](data[0][p])]; })))
  // The path function take a row of the csv as input, and return x and y coordinates of the line to draw for this raw.
  function path(d) {
    if (d.Year=="2010") {
      var x2010 = +d.LE
    }
    if (d.Year=="2000") {
      var x2000 = +d.LE
    }
    d3.line().x(x2010).y()
    d3.line()(dimensions.map(function(p) { return [x(p), y[p](d[p])]; }));
  }

  // Draw the lines
  svgParallel
    .selectAll("myPath")
    .data(data)
    .join("path")
      .attr("class", function (d) { return "line " + d.Entity } ) // 2 class for each line: 'line' and the group name
      .attr("d",  path)
      .style("fill", "none" )
      .style("stroke", function(d){ return( colors[d.continent])} )
      .style("opacity", 0.5)
      .on("mouseover", highlight)
      .on("mouseleave", doNotHighlight )

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
      .attr("y", -9)
      .text(function(d) { return d; })
      .style("fill", "black")

})