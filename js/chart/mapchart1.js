// Set up the SVG elements for the map
var svgmapchart1 = d3.select("#mapchart1")
  .append("svg")
  .attr("viewBox", `0 0 ${width} ${height}`)
  .attr("preserveAspectRatio", "xMinYMin meet")
  .attr("width", "100%");

var projection = d3.geoMercator()
  .scale(130)
  .translate([width / 2, height / 1.4]);

var path = d3.geoPath()
  .projection(projection);

// Load the world map data and life expectancy data
Promise.all([
  d3.json("https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json"),
  d3.csv("../../data/lifeExpectancyByCountry.csv")
]).then(function([world, data]) {
  // Map the life expectancy data to the world map features
  console.log(world.objects.countries.geometries[0].properties.name)
  console.log(data.Entity[0])
  var mappedData = world.objects.countries.geometries.map(function(d) {
    var countryData = data.find(function(e) {
      return e.Entity === d.properties.name;
    });
    return {
      country: d.properties.name,
      year: +countryData.Year,
      lifeExpectancy: +countryData.lifeExpectancy,
      geometry: d.geometry
    };
  });

  // Set up the color scale for life expectancy
  var colorScale = d3.scaleSequential(d3.interpolateYlGn)
    .domain(d3.extent(mappedData, function(d) { return d.lifeExpectancy; }));

  // Draw the country shapes
  svgmapchart1.selectAll("path")
    .data(topojson.feature(world, world.objects.countries).features)
    .enter()
    .append("path")
    .attr("d", path)
    .style("fill", function(d) {
      var countryData = mappedData.find(function(e) {
        return e.country === d.properties.name;
      });
      return countryData ? colorScale(countryData.lifeExpectancy) : "grey";
    });

  // Add the slider element and set up the event listener
  var slider = d3.select("#year-slider");

  slider.on("input", function() {
    var year = +this.value;
    var filteredData = mappedData.filter(function(d) {
      return d.year === year;
    });
    svgmapchart1.selectAll("path")
      .data(filteredData, function(d) { return d.country; })
      .style("fill", function(d) { return colorScale(d.lifeExpectancy); });
  });
});
