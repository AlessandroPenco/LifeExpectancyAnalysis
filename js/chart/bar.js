
function barChart1(yy) {
  d3.select("#bar").selectAll('svg').remove()
  
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
    
  var par = "Year: " + yy;
  svgbar.append("text").text(par);
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
    svgbar.append("g").call(d3.axisLeft(y));

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
      .range(["#e41a1c", "#377eb8", "#4daf4a"]);

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
      .attr("class", d => "lowOpacityOnHover "+d.key);

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

