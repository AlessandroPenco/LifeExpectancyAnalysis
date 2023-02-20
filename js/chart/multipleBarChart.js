function multipleBarChart(YY) {
  d3.select("#multipleBar").selectAll("g").remove();
  d3.select("#barPar").selectAll("text").remove();

  var par = "Year: " + YY;
  d3.select("#barPar").append("text").text(par).style("font-size", "28px");
  const myMultipleBar = d3.select("#multipleBar").append("g");

  d3.csv(
    //"https://raw.githubusercontent.com/AlessandroPenco/LifeExpectancyAnalysis/main/data/number-of-deaths-by-age-group.csv"
    "../../data/MultiBar.csv"
  ).then(function (data) {
    widthSquares = 20;
    heightSquares = 5;
    data_year = data.filter((d) => d.Year == YY);

    const continents = data_year.map((d) => d.continent);
    const continentSet = new Set(continents);
    const arraycontinent = [...continentSet];
    const datum = Object.keys(data[0]).filter(
      (d) => (d != "continent") & (d != "Year")
    );

    for (
      let continent_1 = 0;
      continent_1 < arraycontinent.length;
      continent_1++
    ) {
      const filteredDataByContinent = arraycontinent.map((continent) => {
        return {
          name: arraycontinent[continent_1],
          data: data_year.filter(
            (d) => d.continent === arraycontinent[continent_1]
          ),
        };
      });
      console.log(filteredDataByContinent);
      /*
        var values = Object.values(data[continent]).splice(1);
      var prova = values.slice(7, 12);
      var values = prova.map((d) => Math.round(d * 100));
      // var sm_margin = 5;
      var sm_width = 150;
      // var sm_height = 170;
      var datumColor = d3.schemeTableau10;
      var squareDimension = 10;
      var squarePadding = 2;

      var svgBar = myMultipleBar
        .append("svg")
        .attr(
          "viewBox",
          `0 0 ${width + margin.left + margin.right - 250} ${
            height + margin.top + margin.bottom - 200
          }`
        )
        .attr("preserveAspectRatio", "xMinYMin meet")
        .attr("width", "30%")
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top + 20})`);

      svgBar
        .append("text")
        .attr("transform", "translate(" + sm_width / 2 + " ," + -10 + ")")
        .style("text-anchor", "middle")
        .style("font-size", "15")
        .text(continents[continent]); // + " " + values)

      // add tooltip
      const tooltipW = d3
        .select("body")
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
    */
      var svgBar = myMultipleBar
        .append("svg")
        .attr(
          "viewBox",
          `0 0 ${width + margin.left + margin.right - 250} ${
            height + margin.top + margin.bottom - 200
          }`
        )
        .attr("preserveAspectRatio", "xMinYMin meet")
        .attr("width", "30%")
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top + 20})`);

      // Add X axis
      const x = d3.scaleLinear().domain([0, 100]).range([0, width]);
      svgBar
        .append("g")
        .attr("transform", `translate(0, ${height})`)
        .call(d3.axisBottom(x))
        .selectAll("text")
        .attr("transform", "translate(-10,0)rotate(-45)")
        .style("text-anchor", "end");

      // Y axis
      const y = d3
        .scaleBand()
        .range([0, height])
        .domain(filteredDataByContinent.map((d) => d.data.entity))
        .padding(0.1);
      svgBar.append("g").call(d3.axisLeft(y));
      // build waffle

      svgBar
        .selectAll("myRect")
        .data(filteredDataByContinent[continent_1].data)
        .join("rect")
        .attr("x", (d) => x(0))
        .attr("y", (d) => y(d.entity))
        .attr("width", (d) => d.life)
        .attr("height", 10)
        .attr("fill", "#69b3a2");
    }
  });
}
multipleBarChart("2018");
