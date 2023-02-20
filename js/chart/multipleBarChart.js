function multipleBarChart(YY) {
  d3.select("#multipleBar").selectAll("g").remove();
  d3.select("#multipleBarPar").selectAll("text").remove();

  var par = "Year: " + YY;
  d3.select("#multipleBarPar").append("text").text(par).style("font-size", "28px");
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

    for (
      let continent_1 = 0;
      continent_1 < arraycontinent.length-1;
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
          `0 0 ${width + margin.left + margin.right - 270} ${
            height + margin.top + margin.bottom - 200
          }`
        )
        .attr("preserveAspectRatio", "xMinYMin meet")
        .attr("width", "50%")
        .append("g")
        .attr("transform", `translate(${margin.left+10},${margin.top + 40})`);

      // Add X axis
      const x = d3.scaleLinear().domain([20,100]).nice().range([0, (width/3)-10]);
      svgBar
        .append("g")
        .attr("transform", `translate(0, ${0})`)
        .call(d3.axisTop(x))
        .selectAll("text")
        .attr("transform", "translate(13,-15)rotate(-60)")
        .style("text-anchor", "end");

      var country = [];
      for (let index = 0; index < 6; index++) {
        country.push((filteredDataByContinent.map((d) => d.data)[0])[index].Entity);
      }
      country[0] = "Others";
      svgBar.append("text")
      .attr("transform", "translate(" + (width/3)/3 + " ," + -29 + ")")
      .style("text-anchor", "middle")
      .style("font-size", "15")
      .text(filteredDataByContinent[0].name)

      svgBar.append("text")
          .attr("transform", "translate(" + (width/3)/3 + " ," + -30 + ")")
          .style("text-anchor", "middle")
          .style("font-size", "15")
          .style("fill", colors[filteredDataByContinent[0].name])
          .text(filteredDataByContinent[0].name)

      // Y axis
      const y = d3
        .scaleBand()
        .range([0, height/3])
        .domain(country)
        .padding(0.4);

      svgBar.append("g").call(d3.axisLeft(y)).selectAll("text").attr("font-size", "7px");
      // build waffle

      svgBar
        .selectAll("myRect")
        .data(filteredDataByContinent[continent_1].data)
        .join("rect")
        .attr("x", (d) => x(20))
        .attr("y", (d) => y(d.Entity=="" ? "Others" : d.Entity))
        .attr("width", (d) => d.life)
        .attr("class", (d) => (d.Entity=="" ? "Others" : d.Entity))
        .attr("height", 10)
        .attr("fill", (d) => colors[d.continent])
        .on("mouseover", function (d, j) {
            tooltipW.html("Life Expectancy: "+Math.round(j.life) +" years old")
            .style("visibility", "visible");
            d3.select(this).attr("fill", "red");attr("fill", "red");
        })
        // move tooltip on move
        .on("mousemove", function () {
          tooltipW
                .style("top", (event.pageY - 10) + "px")
                .style("left", (event.pageX + 10) + "px");
        })
        // on mouseout: increase opacity and hide tooltip
        .on("mouseout", function (d,j) {
          tooltipW.html(``).style("visibility", "hidden");
          d3.select(this).attr("fill", (d) => colors[d.continent]);
        });
    }
  });

   // add tooltip
   const tooltipW = d3.select("body")
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



}
multipleBarChart("2018");
