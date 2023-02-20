function radarChart(yy) {
  d3.select("#radarChart").select("svg").remove();
  d3.select("#radarChart").select("text").remove();
  var par = "Year: " + yy;
  d3.select("#radarChart").append("text").text(par).style("font-size", "28px");
  var svgRadar = d3
    .select("#radarChart")
    .append("svg")
    .attr(
      "viewBox",
      `0 0 ${width + margin.left + margin.right + 200} ${
        height + margin.top + margin.bottom + 200
      }`
    )
    .attr("preserveAspectRatio", "xMinYMin meet")
    .attr("width", "100%")
    .append("g")
    .attr("transform", `translate(${margin.left + 100},${margin.top + 100})`);

  d3.csv("../../data/rad.csv").then(function (myData) {
    console.log(myData);
    let features = ["All", "Male", "Female", "GDP", "Health"];

    data = myData.filter((d) => d["Year"] == yy);

    let radialScale = d3.scaleLinear().domain([0, 10]).range([0, 250]);
    let ticks = [2, 4, 6, 8, 10];

    svgRadar
      .selectAll("circle")
      .data(ticks)
      .join((enter) =>
        enter
          .append("circle")
          .attr("cx", width / 2)
          .attr("cy", height / 2)
          .attr("fill", "none")
          .attr("stroke", "gray")
          .attr("r", (d) => radialScale(d))
      );

    svgRadar
      .selectAll(".ticklabel")
      .data(ticks)
      .join((enter) =>
        enter
          .append("text")
          .attr("class", "ticklabel")
          .attr("x", width / 2 + 5)
          .attr("y", (d) => height / 2 - radialScale(d))
          .text((d) => d.toString())
      );

    function angleToCoordinate(angle, value) {
      let x = Math.cos(angle) * radialScale(value);
      let y = Math.sin(angle) * radialScale(value);
      return { x: width / 2 + x, y: height / 2 - y };
    }

    let featureData = features.map((f, i) => {
      let angle = Math.PI / 2 + (2 * Math.PI * i) / features.length;
      return {
        name: f,
        angle: angle,
        line_coord: angleToCoordinate(angle, 10),
        label_coord: angleToCoordinate(angle, 10.5),
      };
    });

    // draw axis line
    svgRadar
      .selectAll("line")
      .data(featureData)
      .join((enter) =>
        enter
          .append("line")
          .attr("x1", width / 2)
          .attr("y1", height / 2)
          .attr("x2", (d) => d.line_coord.x)
          .attr("y2", (d) => d.line_coord.y)
          .attr("stroke", "black")
      );

    // draw axis label
    svgRadar
      .selectAll(".axislabel")
      .data(featureData)
      .join((enter) =>
        enter
          .append("text")
          .attr("x", (d) => d.label_coord.x)
          .attr("y", (d) => d.label_coord.y)
          .text((d) => d.name)
      );

    let line = d3
      .line()
      .x((d) => d.x)
      .y((d) => d.y);
    // color palette
    const colors = {
      AF: "#fc7979",
      Africa: "#fc7979",

      AS: "#fae078",
      Asia: "#fae078",

      EU: "#80fc79",
      Europe: "#80fc79",

      NA: "#77f7ea",
      "NNorth AmericaA": "#77f7ea",

      OC: "#6380f2",
      Oceania: "#6380f2",

      SA: "#955ffa",
      "South America": "#955ffa",
    };

    function getPathCoordinates(data_point) {
      let coordinates = [];
      for (var i = 0; i < features.length; i++) {
        let ft_name = features[i];
        let angle = Math.PI / 2 + (2 * Math.PI * i) / features.length;
        coordinates.push(angleToCoordinate(angle, data_point[ft_name]));
      }
      return coordinates;
    }
    let continents = [
      ["AF", "Africa"],
      ["NA", "North America"],
      ["SA", "South America"],
      ["EU", "Europe"],
      ["AS", "Asia"],
      ["OC", "Oceania"],
    ];

    // draw the path element
    svgRadar
      .selectAll("path")
      .data(data)
      .join((enter) =>
        enter
          .append("path")
          .attr("stroke", (d) => colors[d.continent])
          .attr("fill", (d) => colors[d.continent])
          .attr("class", (d) => "lowOpacityOnHover " + d.continent)
          .datum((d) => getPathCoordinates(d))
          .attr("d", line)
          .attr("stroke-width", 3)
          .attr("stroke-opacity", 1)
          .attr("opacity", 0.3)
      );

    // Legend
    function onMouseOverLegend(event) {
      var radarClass = event.target.classList[1];
      d3.selectAll(".lowOpacityOnHover").style("opacity", "0.1");
      d3.selectAll("." + radarClass).style("opacity", "1");
    }

    function onMouseOutLegend(event) {
      d3.selectAll(".lowOpacityOnHover").style("opacity", "0.3");
    }
    // legend
    for (let i = 0; i < continents.length; i++) {
      svgRadar
        .append("circle")
        .attr("cx", width + margin.left + margin.right - 60)
        .attr("cy", -100 + i * 18)
        .attr("r", 6)
        .style("fill", colors[continents[i][0]])
        .attr("class", ".lowOpacityOnHover " + continents[i][0])
        .on("mouseover", onMouseOverLegend)
        .on("mouseout", onMouseOutLegend);
      svgRadar
        .append("text")
        .attr("x", width + margin.left + margin.right - 50)
        .attr("y", -100 + i * 18)
        .text(continents[i][1])
        .style("font-size", "9px")
        .attr("alignment-baseline", "middle")
        .attr("class", ".lowOpacityOnHover " + continents[i][0])
        .on("mouseover", onMouseOverLegend)
        .on("mouseout", onMouseOutLegend);
    }
  });
}
radarChart("2018");
