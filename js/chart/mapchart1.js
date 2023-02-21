function mapChart1(yy) {
  d3.select("#mapchart1").selectAll("svg").remove();
  d3.select("#mapchart1").selectAll("g").remove();
  // Map and projection
  const projection = d3
    .geoMercator()
    .scale(70)
    .center([0, 20])
    .translate([width / 2, height / 2]);
  const path = d3.geoPath().projection(projection);

  var legendMapchart1 = d3
    .select("#mapchart1")
    .append("svg")
    .attr(
      "viewBox",
      `0 0 ${width + margin.left + margin.right - 170} ${
        height + margin.top + margin.bottom - 365
      }`
    )
    .attr("preserveAspectRatio", "xMinYMin meet")
    .attr("width", "100%")
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

  // Set up the SVG elements for the map
  var svgmapchart1 = d3
    .select("#mapchart1")
    .append("svg")
    .attr(
      "viewBox",
      `0 0 ${width + margin.left + margin.right} ${
        height + margin.top + margin.bottom - 80
      }`
    )
    .attr("preserveAspectRatio", "xMinYMin meet")
    .attr("width", "100%")
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top + 10})`);

  var par = "Year: " + yy;
  svgmapchart1.append("text").text(par);

  // Load the world map data and life expectancy data
  Promise.all([
    d3.json("https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json"),
    d3.csv(
      "https://raw.githubusercontent.com/AlessandroPenco/LifeExpectancyAnalysis/main/data/lifeExpectancyByCountry.csv"
    ),
  ]).then(function ([world, data]) {
    // Map the life expectancy data to the world map features
    var mappedData = world.objects.countries.geometries.map(function (d) {
      var countryData = data.find(function (e) {
        return e.Entity === d.properties.name && e.Year === yy;
      });
      if (countryData)
        return {
          country: d.properties.name,
          year: +countryData.Year,
          lifeExpectancy: +countryData.lifeExpectancy,
          geometry: d.geometry,
        };
      else
        return {
          country: "unknown",
          year: 0,
          lifeExpectancy: 0,
        };
    });

    // Set up the color scale for life expectancy
    var colorScale = d3.scaleSequential(d3.interpolateSpectral).domain(
      d3.extent(mappedData, function (d) {
        return d.lifeExpectancy;
      })
    );

    var step = [];
    for (let index = 1; index <= 8; index++) {
      step.push(
        Math.round(
          ((d3.extent(mappedData, function (d) {
            return d.lifeExpectancy;
          })[1] *
            index) /
            8 +
            Number.EPSILON) *
            100
        ) / 100
      );
    }
    Legend(d3.scaleThreshold(step, d3.schemeSpectral[8]), legendMapchart1);

    const tooltip = d3
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

    // Draw the country shapes
    svgmapchart1
      .selectAll("path")
      .data(topojson.feature(world, world.objects.countries).features)
      .enter()
      .append("path")
      .attr("d", path)
      .style("fill", function (d) {
        var countryData = mappedData.find(function (e) {
          return e.country === d.properties.name;
        });
        return countryData ? colorScale(countryData.lifeExpectancy) : "grey";
      })
      .style("stroke", "transparent")
      .attr("class", function (d) {
        return d.properties.name;
      })
      .style("opacity", 0.8)
      .on("mouseover", function (event, d) {
        var countryData = mappedData.find(function (e) {
          return e.country === d.properties.name;
        });
        // make all regions' color duller and delete stroke
        svgmapchart1
          .selectAll("path")
          .style("stroke", "transparent")
          .style("fill-opacity", "0.5");

        // make hovered ragion (id corresponding to hovered element) color normal
        svgmapchart1
          .selectAll(`.${d.properties.name.replace(/\s+/g, ".")}`)
          .style("fill-opacity", "1")
          .style("stroke", "black")
          .style("stroke-width", "2px");
        // and show tooltip
        tooltip
          .html(
            `${d.properties.name}<br>
          Life Expectancy: ${countryData.lifeExpectancy}<br>
          Year: ${countryData.year}<br>
          `
          )
          .style("visibility", "visible");
      })
      .on("mousemove", function () {
        // move tooltip
        tooltip
          .style("top", event.pageY - 10 + "px")
          .style("left", event.pageX + 10 + "px");
      })
      .on("mouseout", function (event, d) {
        // reset stroke and color
        svgmapchart1
          .selectAll("path")
          .style("stroke", "trasparent")
          .style("stroke-width", "1")
          .style("fill-opacity", "1");
        tooltip.html(``).style("visibility", "hidden");
      });
    // Add the slider element and set up the event listener
  });
}
mapChart1("2018");
