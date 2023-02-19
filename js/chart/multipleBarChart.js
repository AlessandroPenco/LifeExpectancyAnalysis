d3.csv(
  "https://raw.githubusercontent.com/rikyeahh/rikyeahh.github.io/main/assets/data3.csv"
).then(function (data) {
  // reorganize data
  other = data.pop();
  lng = data.length - 5;
  for (let j = 0; j < lng; j++) {
    data.pop();
  }
  data.push(other);

  const tree_name = data.map((d) => d["tree_name"]);

  const neighborhood = data.columns.slice(1);

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

  const y = d3.scaleBand().domain(neighborhood).range([height, 0]).padding(0.1);

  // build small multiples, 1 for each tree name
  for (let index = 0; index < tree_name.length; index++) {
    var sm_margin = index == 0 ? 150 : 0; // to show scale only on the first one
    var sm_width = 175;
    const svg3 = d3
      .select("#multipleScatter")
      .append("svg")
      .attr("width", sm_width + sm_margin + 10)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", `translate(${sm_margin},${margin.top + 50})`);

    // title of each small multiple, tree name
    svg3
      .append("text")
      .attr("transform", "translate(" + sm_width / 2 + " ," + -margin.top + ")")
      .style("text-anchor", "middle")
      .text(tree_name[index]);

    var values = [];
    for (let i = 0; i < Object.entries(data[index]).length; i++) {
      values[i] = Object.entries(data[index])[i][1];
    }

    values = values.slice(1); // without 'circoscrizione'
    const neighborhood_val = zip(neighborhood, values);

    const x = d3
      .scaleLinear()
      .domain([0, Math.max(...values)])
      .nice()
      .range([0, sm_width]);
    svg3.append("g").call(d3.axisTop(x).ticks(5, "~s"));

    if (index >= 0) {
      svg3.append("g").call(d3.axisLeft(y));
    }

    var plantColor = d3.schemeTableau10[index];

    svg3
      .selectAll("myG")
      .data(neighborhood_val)
      .join("rect")
      .attr("x", x)
      .attr("y", (d) => y(d[0]))
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
