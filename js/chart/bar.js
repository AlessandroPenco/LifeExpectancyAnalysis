
function barChart1(yy) {
  d3.select("#bar").selectAll('svg').remove()
  
  // append the svg object to the body of the page
  const svgbar = d3
    .select("#bar")
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
    .attr("transform", `translate(${margin.left},${margin.top+5})`);
    
  var par = "Year: " + yy;
  svgbar.append("text").text(par);
  // Parse the Data
  d3.csv("https://raw.githubusercontent.com/AlessandroPenco/LifeExpectancyAnalysis/main/data/Merge_line.csv").then(function (myData) {
    // List of subgroups = header of the csv files = soil condition here
    data = myData.filter((d) => d["YY"]==yy)
    console.log(data)
    
    // const subgroups = myData.columns.slice(1);
    const subgroups = ["M", "F", "T"]
    console.log(subgroups)
    // List of groups = species here = value of the first column called group -> I show them on the X axis
    const groups = data.map((d) => d.CC);
    console.log(groups)
    
    // console.log(groups);
    
    // Add X axis
    const x = d3.scaleBand().domain(groups).range([0, width]).padding([0.2]);
    svgbar
    .append("g")
    .attr("transform", `translate(0, ${height})`)
    .call(d3.axisBottom(x).tickSize(0));
    
    // Add Y axis
    const y = d3.scaleLinear().domain([40, 80]).range([height, 0]);
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
      .attr("class", (d) => d.key);
  });
}
 barChart1("2018");

