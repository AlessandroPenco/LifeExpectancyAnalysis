


  
function waffleChart(YY){
  d3.select("#waffleChart").selectAll('g').remove();
  d3.select("#wafflePar").selectAll('text').remove();

  var par = "Year: " + YY;
  d3.select("#wafflePar").append("text").text(par).style("font-size", "28px");
  const myWaffleChart = d3.select("#waffleChart").append("g");
  

// d3.csv("https://raw.githubusercontent.com/AlessandroPenco/LifeExpectancyAnalysis/main/data/number-of-deaths-by-age-group.csv").then(function (data) {
d3.csv("../../data/number-of-deaths-by-age-group.csv").then(function (data) {
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

                let className = "circ" + continent + datum[i].replaceAll(" ", "_");

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
        }
    }
});

}
waffleChart("2018");