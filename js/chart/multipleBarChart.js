//Scatter plot small multiples
d3.csv("https://raw.githubusercontent.com/rikyeahh/rikyeahh.github.io/main/assets/data5.csv").then(function (data) {

    // set the dimensions and margins of the graph
    const margin = { top: 10, right: 20, bottom: 30, left: 30 },
        width = 300,
        height = 300;

    //console.log(data);
    const names = data.map(d => d.name);
    const names_uniq = [...new Set(names)];
    const name_counts = [];
    const sortable = [];

    for (const num of names) { //get the count of trees
        name_counts[num] = name_counts[num] ? name_counts[num] + 1 : 1;
    }
    //Get a sortable version of count of trees
    names_uniq.forEach(e => {
        sortable.push([e, name_counts[e]]);
    });

    const name_count_ordered = sortable.sort((a, b) => b[1] - a[1]).slice(0, 6);
    const names_ordered = name_count_ordered.sort((a, b) => a[0].localeCompare(b[0]));

    // Add X axis
    var x = d3.scaleLinear()
        .domain([0, Math.max(...data.map(e => parseFloat(e.height)))]) //Math.max(...values) of treeSize
        .range([0, width]);

    // Add Y axis
    var y = d3.scaleLinear()
        .domain([0, Math.max(...data.map(e => parseFloat(e.co2_absorption)))]) //Math.max(...values) of CO2
        .range([height, 0]);

    const color = d3.scaleOrdinal()
        .domain(names_ordered)
        .range(d3.schemeTableau10);

    // small multiples: for each specie, build a plot
    names_ordered.map(d => d[0]).forEach(e => {
        const svg4 = d3.select("#multipleScatter")
            .append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top * 2 + margin.bottom * 2)
            .append("g")
            .attr("transform",
                "translate(" + margin.left * 2 + "," + margin.top * 3 + ")")
            .style("margin-bottom", "50px");

        svg4.append("g")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(x));

        svg4.append("g")
            .call(d3.axisLeft(y));


        svg4.append("text")
            .attr("transform", "translate(" + (width / 2) + " ," + (-margin.top) + ")")
            .style("text-anchor", "middle")
            .text(e)

        svg4.append('g')
            .selectAll("dot")
            .data(data.filter(d => d.name == e))
            .enter()
            .append("circle")
            .attr("cx", function (d) { return x(d.height); })
            .attr("cy", function (d) { return y(d.co2_absorption); })
            .attr("r", 1.5)
            .style("fill", function (d) { return color(d.name) })

        svg4.append("text")
            .attr("text-anchor", "end")
            .attr("x", (width / 2) + 50)
            .attr("y", height + 35)
            .text("Tree height (m)");

        svg4.append("text")
            .attr("text-anchor", "end")
            .attr("x", (width / 2) - 230)
            .attr("y", height - 330)
            .text("CO2 absorption (kg/year)")
            .attr("transform", "rotate(-90)");


        // create regression line
        var yval = data.filter(d => d.name == e).map(function (d) { return parseFloat(d.co2_absorption); });
        var xval = data.filter(d => d.name == e).map(function (d) { return parseFloat(d.height); });

        var lr = linearRegression(yval, xval);

        var max = d3.max(data, function (d) { return parseFloat(d.height); });

        svg4.append("svg:line")
            .attr("x1", x(0))
            .attr("y1", y(lr.intercept))
            .attr("x2", x(max))
            .attr("y2", y((max * lr.slope) + lr.intercept))
            .style("stroke", "gray")
            .style("opacity", 0.5);
    });

    // computes the regression line (slope, intercept) from data
    function linearRegression(y, x) {

        var lr = {};
        var n = y.length;
        var sum_x = 0;
        var sum_y = 0;
        var sum_xy = 0;
        var sum_xx = 0;
        var sum_yy = 0;

        for (var i = 0; i < y.length; i++) {

            sum_x += x[i];
            sum_y += y[i];
            sum_xy += (x[i] * y[i]);
            sum_xx += (x[i] * x[i]);
            sum_yy += (y[i] * y[i]);
        }

        lr['slope'] = (n * sum_xy - sum_x * sum_y) / (n * sum_xx - sum_x * sum_x);
        lr['intercept'] = (sum_y - lr.slope * sum_x) / n;
        lr['r2'] = Math.pow((n * sum_xy - sum_x * sum_y) / Math.sqrt((n * sum_xx - sum_x * sum_x) * (n * sum_yy - sum_y * sum_y)), 2);

        return lr;

    };
})