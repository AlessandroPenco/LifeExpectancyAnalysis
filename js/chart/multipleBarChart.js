function multipleBarChart(YY) {
  //   d3.select("#multipleBar").selectAll("g").remove();
  const myBarChart = d3
    .select("#multipleBar")
    .append("g")
    .attr("class", "standard");

  d3.csv("../../data/MultiBar.csv").then(function (data) {
    // reorganize data
    data_year = data.filter((d) => d["Year"] == YY);

    const continent = data_year.map((d) => d["continent"]);
    const continentSet = new Set(continent);
    const arraycontinent = [...continentSet];
    console.log(data_year);

    console.log(arraycontinent);

    const filteredDataByContinent = arraycontinent.map((continent) => {
      return {
        name: continent,
        data: data_year.filter((d) => d.continent === continent),
      };
    });
    console.log(filteredDataByContinent);

    const tooltip3 = d3
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

    const zip = (a, b) => a.map((k, i) => [k, b[i]]);

    // build small multiples, 1 for each tree name
    for (let index = 0; index < arraycontinent.length; index++) {
      var sm_margin = index == 0 ? 150 : 0; // to show scale only on the first one
      var sm_width = 175;
      //   const svg3 = d3
      //     .select("#multipleScatter")
      //     .append("svg")
      //     .attr("width", sm_width + sm_margin)
      //     .attr("height", height + margin.top + margin.bottom)
      //     .append("g")
      //     .attr("transform", `translate(${sm_margin + 50},${margin.top + 50})`);

      //   // title of each small multiple, tree name
      //   svg3
      //     .append("text")
      //     .attr(
      //       "transform",
      //       "translate(" + sm_width / 2 + " ," + -margin.top + ")"
      //     )
      //     .style("text-anchor", "middle")
      //     .text(arraycontinent[index]);

      //   const x = d3.scaleLinear().domain([0, 100]).nice().range([0, sm_width]);
      //   svg3.append("g").call(d3.axisTop(x).ticks(5, "~s"));

      var plantColor = d3.schemeTableau10[index];
    }

    for (let element = 0; element < filteredDataByContinent.length; element++) {
      console.log(filteredDataByContinent[element].data);
      var svgBar = d3
        .select("#multipleBar")
        .append("svg")
        .attr("class", "standard")
        .attr(
          "viewBox",
          `0 0 ${width + margin.left + margin.right} ${
            height + margin.top + margin.bottom
          }`
        )
        .attr("preserveAspectRatio", "xMinYMin meet")
        .attr("width", "30%")
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top + 20})`);

      country = filteredDataByContinent[element].data.map((d) => d.Entity);
      console.log(country);
      country[0] = "Others";
      console.log(country);

      console.log(filteredDataByContinent[element].data);
      const y = d3.scaleBand().domain(country).range([height, 0]);
      const x = d3.scaleLinear().domain([0, 100]).nice().range([0, sm_width]);
      svgBar.append("g").call(d3.axisTop(x).ticks(5, "~s"));
      svgBar.select("svg").append("g").call(d3.axisLeft(y));
      svgBar
        .selectAll("myG")
        .data(filteredDataByContinent[element].data)
        .join("rect")
        .attr("x", (d) => x(d.life))
        .attr("y", (d) => y(d.Entity))
        .attr("width", (d) => x(d[1]))
        .attr("height", y.bandwidth())
        .attr("fill", plantColor)
        .on("mouseover", function (d, i) {
          tooltip3.html(`Count : ${i[1]}`).style("visibility", "visible");
          d3.select(this).attr("fill", "red");
        })
        .on("mousemove", function () {
          tooltip3
            .style("top", event.pageY - 10 + "px")
            .style("left", event.pageX + 10 + "px");
        })
        .on("mouseout", function () {
          tooltip3.html(``).style("visibility", "hidden");
          d3.select(this).attr("fill", function () {
            return "" + d3.schemeTableau10[index] + "";
          });
        });
    }
  });
}
multipleBarChart("2018");
