



function waffleChart(YY){
  d3.select("#waffleChart").selectAll('g').remove();
  d3.select("#wafflePar").selectAll('text').remove();

  var par = "Year: " + YY;
  const leg = d3.select("#wafflePar").append("text").text(par).style("font-size", "28px");
  const myWaffleChart = d3.select("#waffleChart").append("g");


d3.csv("https://raw.githubusercontent.com/AlessandroPenco/LifeExpectancyAnalysis/main/data/number-of-deaths-by-age-group.csv").then(function (data) {
    widthSquares = 20;
    heightSquares = 5;
    data = data.filter(d => d.Year==YY)

    const continents = data.map(d => d.continent);
    const datum = Object.keys(data[0]).filter(d => d != "continent" & d != "Year");

    for (let continent = 0; continent < continents.length; continent++) {

        var values = Object.values(data[continent]).splice(1);
        var prova = values.slice(7,12)
        var values = prova.map(d => (Math.round(d* 100)))
        // var sm_margin = 5;
        var sm_width = 150;
        // var sm_height = 170;
        var datumColor = d3.schemeTableau10
        var squareDimension = 10
        var squarePadding = 2

        var svgWaffle = myWaffleChart
        .append("svg")
        .attr(
          "viewBox",
          `0 0 ${width + margin.left + margin.right-250} ${
            height + margin.top + margin.bottom-200
          }`
          )
          .attr("preserveAspectRatio", "xMinYMin meet")
          .attr("width", "30%")
          .append("g")
          .attr("transform", `translate(${margin.left},${margin.top+20})`);



        svgWaffle.append("text")
            .attr("transform", "translate(" + (sm_width / 2) + " ," + -10 + ")")
            .style("text-anchor", "middle")
            .style("font-size", "15")
            .text(continents[continent])// + " " + values)

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


        // build waffle
        var x = 0
        var y = 0
        for (let i = 0; i < values.length; i++) {
            for (let n_deaths = 0; n_deaths < values[i]; n_deaths++) {

                let className = "c" + continent + datum[i].replaceAll(" ", "_");
                console.log(className)
                svgWaffle.append("rect")
                    .attr("width", squareDimension)
                    .attr("height", squareDimension)
                    .attr("x", x)
                    .attr("y", y)
                    .attr("transform", `translate(${15},0)`)
                    .attr("fill", datumColor[i])
                    .attr("class", className)
                    // on mouseover: decrease opacity and show tooltip
                    .on("mouseover", function (d, j) {
                      tooltipW.html(datum[i])
                            .style("visibility", "visible");
                        d3.selectAll("." + className).style("opacity", 0.7);
                    })
                    // move tooltip on move
                    .on("mousemove", function () {
                      tooltipW
                            .style("top", (event.pageY - 10) + "px")
                            .style("left", (event.pageX + 10) + "px");
                    })
                    // on mouseout: increase opacity and hide tooltip
                    .on("mouseout", function () {
                      tooltipW.html(``).style("visibility", "hidden");
                        d3.selectAll("." + className).style("opacity", 1);
                    });

                // x as modulus to wrap around after 10 blocks, and y increased accordingly
                x += squareDimension + squarePadding
                if (x != x % ((squareDimension + squarePadding) * 10))
                    y += squareDimension + squarePadding
                x %= (squareDimension + squarePadding) * 10
            }
        };
    }
    let labels = [["70+","deaths_Over_70_years_old"],
                  ["50-69", "deaths_bewteen_50-69_years_old"],
                  ["15-49", "deaths_bewteen_15-49_years_old"],
                  ["5-14", "deaths_bewteen_5-14_years_old"],
                  ["5-","deaths_Under_5_years_old"]];

    myWaffleChart.append("svg")
    .attr("class","mySVG")
    .attr(
      "viewBox",
      `0 0 ${300} ${
        70
      }`
      )
      .attr("preserveAspectRatio", "xMinYMin meet")
      .attr("width", "70%")
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top+20})`);;
    for (let i = 0; i < labels.length; i++) {
      var datumColor = d3.schemeTableau10
      myWaffleChart.select(".mySVG").append("circle")
          .attr("cx", 10+((width)/6)*i)
          .attr("cy", 12)
          .attr("r", 6)
          .style("fill", datumColor[i])
          .attr("class", "line " + (labels[i][0]))
          .on("mouseover", function (d, j) {
            d3.selectAll("rect").style("opacity", 0.2);
            d3.selectAll(".c0" + labels[i][1]).style("opacity", 1);
            d3.selectAll(".c1" + labels[i][1]).style("opacity", 1);
            d3.selectAll(".c2" + labels[i][1]).style("opacity", 1);
            d3.selectAll(".c3" + labels[i][1]).style("opacity", 1);
            d3.selectAll(".c4" + labels[i][1]).style("opacity", 1);
            d3.selectAll(".c5" + labels[i][1]).style("opacity", 1);
            d3.selectAll(".c6" + labels[i][1]).style("opacity", 1);
          })
          .on("mouseout", function () {
            d3.selectAll("rect").style("opacity", 1);
          });
      console.log(i)
      myWaffleChart.select(".mySVG").append("text")
          .attr("x", 10+(((width)/6)*i)+10)
          .attr("y", 12)
          .text(labels[i][0])
          .style("font-size", "12px")
          .style("fill", datumColor[i])
          .attr("alignment-baseline", "middle")
          .attr("class", "line " + labels[i][0])
          .on("mouseover", function (d, j) {
            d3.selectAll("rect").style("opacity", 0.2);
            d3.selectAll(".c0" + labels[i][1]).style("opacity", 1);
            d3.selectAll(".c1" + labels[i][1]).style("opacity", 1);
            d3.selectAll(".c2" + labels[i][1]).style("opacity", 1);
            d3.selectAll(".c3" + labels[i][1]).style("opacity", 1);
            d3.selectAll(".c4" + labels[i][1]).style("opacity", 1);
            d3.selectAll(".c5" + labels[i][1]).style("opacity", 1);
            d3.selectAll(".c6" + labels[i][1]).style("opacity", 1);
          })
          .on("mouseout", function () {
            d3.selectAll("rect").style("opacity", 1);
          });
      };
});

}
waffleChart("2018");