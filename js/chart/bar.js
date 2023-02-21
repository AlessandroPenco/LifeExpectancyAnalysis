
function barChart1(yy) {
  d3.select("#bar").selectAll('svg').remove()
  d3.select("#barPar").selectAll('text').remove()
  if(yy < 1961){
    var par = "Year: " + yy + ". Missing data for your selection. Select years from 1961.";
  } else {
    var par = "Year: " + yy;
  }
  d3.select("#barPar").append("text").text(par).style("font-size", "28px");
  
  // append the svg object to the body of the page
  const svgbar = d3
    .select("#bar")
    .append("svg")
    .attr(
      "viewBox",
      `0 0 ${width + margin.left + margin.right+30} ${
        height + margin.top + margin.bottom
      }`
    )
    .attr("preserveAspectRatio", "xMinYMin meet")
    .attr("width", "100%")
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top+5})`);
  
  
  // Parse the Data
  d3.csv("https://raw.githubusercontent.com/AlessandroPenco/LifeExpectancyAnalysis/main/data/Merge_line.csv").then(function (myData) {
    // List of subgroups = header of the csv files = soil condition here
    data = myData.filter((d) => d["YY"]==yy)
    // console.log(data)
    
    // const subgroups = myData.columns.slice(1);
    const subgroups = ["M", "F", "T"]
    // console.log(subgroups)
    // List of groups = species here = value of the first column called group -> I show them on the X axis
    const groups = data.map((d) => d.CC);
    // console.log(groups)
    
    // console.log(groups);
    
    // Add X axis
    const x = d3.scaleBand().domain(groups).range([0, width]).padding([0.2]);
    svgbar
    .append("g")
    .attr("transform", `translate(0, ${height})`)
    .call(d3.axisBottom(x).tickSize(0));
    
    // Add Y axis
    const y = d3.scaleLinear().domain([0, 100]).range([height, 0]);
    svgbar.append("g").attr("class", "yAxis").call(d3.axisLeft(y));

    // Another scale for subgroup position?
    const xSubgroup = d3
      .scaleBand()
      .domain(subgroups)
      .range([0, x.bandwidth()])
      .padding([0.05]);

    // color palette = one color per subgroup
    const color = d3
      .scaleOrdinal()
      .domain([subgroups])
      .range(["#4daf4a", "#377eb8", "#e41a1c"]);

      // add tooltip
    const tooltipB = d3.select("body")
      .append("div")
      .attr("class", "d3-tooltip")
      .style("position", "absolute")
      .style("z-index", "10")
      .style("visibility", "hidden")
      .style("padding", "15px")
      .style("background", "rgba(0,0,0,0.6)")
      .style("border-radius", "5px")
      .style("color", "#fff")
      .text("a simple tooltip");

    // Show the bars
    svgbar
      .append("g")
      .selectAll("g")
      // Enter in data = loop group per group
      .data(data)
      .join("g")
      .attr("transform", (d) => `translate(${x(d.CC)}, 0)`)
      .selectAll("rect")
      .data(function (d) {
        return subgroups.map(function (key) {
          return { key: key, value: d[key] };
        });
      })
      .join("rect")
      .attr("x", (d) => xSubgroup(d.key))
      .attr("y", (d) => y(d.value))
      .attr("width", xSubgroup.bandwidth())
      .attr("height", (d) => height - y(d.value))
      .attr("fill", (d) => color(d.key))
      .attr("class", d => "lowOpacityOnHover "+d.key)
      .on("mouseover", function (d, j) {
        tooltipB.html("Life expectancy: "+Math.round(j.value*100)/100+" years old")
              .style("visibility", "visible");
      })
      // move tooltip on move
      .on("mousemove", function () {
        tooltipB
              .style("top", (event.pageY - 10) + "px")
              .style("left", (event.pageX + 10) + "px");
      })
      // on mouseout: increase opacity and hide tooltip
      .on("mouseout", function (d,j) {
        tooltipB.html(``).style("visibility", "hidden");
      });
    
      svgbar.append("text")
      .attr("class", "y label")
      .attr("text-anchor", "end")
      .attr("y", -36)
      .attr("x", 0)
      .attr("dy", ".75em")
      .attr("transform", "rotate(-90)")
      .style("font-size", "9px")
      .text("Life expectancy at birth (YY)");

    d3.selectAll("g.yAxis g.tick")
      .append("line")
      .attr("class", "gridline")
      .attr("x1", 0)
      .attr("y1", 0)
      .attr("x2", width)
      .attr("y2", 0)
      .attr("stroke", "#9ca5aecf") // line color
      .attr("stroke-dasharray","4") // make it dashed;;

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
    }
    
    var longSubgroups = ["Male", "Female", "Total"]
        // legend
        for (let i = 0; i < subgroups.length; i++) {
          svgbar.append("circle")
              .attr("cx", width+ margin.left + margin.right-70)
              .attr("cy", 100 + i * 18)
              .attr("r", 6)
              .style("fill", color(subgroups[i]))
              .attr("class", "lowOpacityOnHover " + subgroups[i])
              .on("mouseover", onMouseOverLegend)
              .on("mouseout", onMouseOutLegend);
              svgbar.append("text")
              .attr("x", width+ margin.left + margin.right-60)
              .attr("y", 100 + i * 18)
              .text(longSubgroups[i])
              .style("font-size", "9px")
              .attr("alignment-baseline", "middle")
              .attr("class", "lowOpacityOnHover " + subgroups[i])
              .on("mouseover", onMouseOverLegend)
              .on("mouseout", onMouseOutLegend);
          };
  });
  
}
 barChart1("2018");

