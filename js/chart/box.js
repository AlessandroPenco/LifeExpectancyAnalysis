

function myBox(YY){
  d3.select("#box").selectAll("svg").remove();
  // append the svg object to the body of the page
  var svgBox = d3.select("#box")
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
    .attr("transform", `translate(${margin.left},${margin.top})`);


  d3.json("https://raw.githubusercontent.com/AlessandroPenco/LifeExpectancyAnalysis/main/data/box2.json").then(function (sumstat) {

      const xMax = 100

      console.log(sumstat[YY])
      sumstat = sumstat[YY]
      console.log(sumstat)
      // Show the Y scale
      const y = d3.scaleBand()
          .range([height, 0])
          .domain(sumstat.map(d => d.key))
          .padding(.1);

          svgBox.append("g")
          .style("font", "14px times")
          .attr("transform", "translate(-30," + (0) + ")")
          .call(d3.axisLeft(y).tickSize(0))
          .select(".domain").remove()

      // Show the X scale
      const x = d3.scaleLinear()
          .domain([0, xMax])
          .range([0, width]).nice();

          svgBox.append("g")
          .attr("transform", "translate(0," + height + ")")
          .call(d3.axisBottom(x).ticks(5))

      // Add X axis label:
      svgBox.append("text")
          .attr("text-anchor", "end")
          .attr("x", width+10)
          .attr("y", height + margin.top -15)
          .style("font-size", "11px")
          .text("Life expectancy (YY)");

      // Show the main vertical line
      svgBox.selectAll("vertLines")
          .data(sumstat)
          .enter()
          .append("line")
          .attr("x1", function (d) { return (x(d.value.min)) })
          .attr("x2", function (d) { return (x(d.value.max)) })
          .attr("y1", function (d) { return (y(d.key) + y.bandwidth() / 2) })
          .attr("y2", function (d) { return (y(d.key) + y.bandwidth() / 2) })
          .attr("stroke", "black")
          .style("width", 40)

      // rectangle for the main box
      svgBox.selectAll("boxes")
          .data(sumstat)
          .enter()
          .append("rect")
          .attr("x", function (d) { return (x(d.value.quartiles1)) })
          .attr("width", function (d) { return (x(d.value.quartiles3) - x(d.value.quartiles1)) })
          .attr("y", function (d) { return y(d.key); })
          .attr("height", y.bandwidth())
          .attr("stroke", "black")
          .style("fill", "#69b3a2")
          .style("opacity", 0.3)

      // Show the median
      svgBox.selectAll("medianLines")
          .data(sumstat)
          .enter()
          .append("line")
          .attr("y1", function (d) { return (y(d.key)) })
          .attr("y2", function (d) { return (y(d.key) + y.bandwidth()) })
          .attr("x1", function (d) { return (x(d.value.median)) })
          .attr("x2", function (d) { return (x(d.value.median)) })
          .attr("stroke", "black")
          .style("width", 80)

      // add small details
      svgBox.selectAll("detailLines")
          .data(sumstat)
          .enter()
          .append("line")
          .attr("y1", function (d) { return (y(d.key)) + 15 })
          .attr("y2", function (d) { return (y(d.key) + y.bandwidth()) - 15 })
          .attr("x1", function (d) { return (x(d.value.max)) })
          .attr("x2", function (d) { return (x(d.value.max)) })
          .attr("stroke", "black")
          .style("width", 80)

          svgBox.selectAll("detailLines")
          .data(sumstat)
          .enter()
          .append("line")
          .attr("y1", function (d) { return (y(d.key)) + 15 })
          .attr("y2", function (d) { return (y(d.key) + y.bandwidth()) - 15 })
          .attr("x1", function (d) { return (x(d.value.min)) })
          .attr("x2", function (d) { return (x(d.value.min)) })
          .attr("stroke", "black")
          .style("width", 80)

      // add individual points (outliers) with jitter: we need non-aggregated data
      // d3.csv("../../assets/data5.csv").then(function (data) {
      //     // keep only the outliers
      //     data = data.filter(d => {
      //         return parseFloat(d.height) > sumstat[sumstat.findIndex(t => t.key == d.name)].value.max ||
      //             parseFloat(d.height) < sumstat[sumstat.findIndex(t => t.key == d.name)].value.min
      //     })
      //     const jitterWidth = 10
      //     svgBox.selectAll("indPoints")
      //         .data(data)
      //         .enter()
      //         .append("circle")
      //         .attr("cx", function (d) { return (x(d.height)) })
      //         .attr("cy", function (d) { return (y(d.name) + (y.bandwidth() / 2) - jitterWidth / 2 + Math.random() * jitterWidth) })
      //         .attr("r", 2)
      //         .style("fill", "white")
      //         .attr("stroke", "black")
      // });
  });
}
myBox("2018")