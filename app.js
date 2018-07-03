var svgWidth = 800;
var svgHeight = 500;

var margin = {
    top: 30,
    right: 40,
    bottom: 60,
    left: 100
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Create an SVG wrapper and append an SVG group that will hold the chart
var svg = d3.select(".chart")
    .append("svg")
    .attr("width", svgWidth)
    .attr("height", svgHeight)

var chartGroup = svg.append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Import data
d3.csv("data.csv", function (err, newsData) {
    if (err) throw err;
    newsData.forEach(function (data) {
        data.poverty = +data.poverty;
        data.diabetes = +data.diabetes;
    });
    
    // Create scale functions
    var xLinearScale = d3.scaleLinear()
        .domain([5, d3.max(newsData, d => d.poverty)])
        .range([0, width]);
    
    var yLinearScale = d3.scaleLinear()
        .domain([5, d3.max(newsData, d => d.diabetes) + 0.9])
        .range([height, 0]);
    
    // Create axis functions
    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);
    
    // Append axes to chart
    chartGroup.append("g")
        .attr("transform", `translate(0, ${height})`)
        .call(bottomAxis);
    
    chartGroup.append("g")
        .call(leftAxis);
    
    // Create circles
    var circlesGroup = chartGroup.selectAll("circle")
        .data(newsData)
        .enter()
        .append("circle")
        .attr("cx", d => xLinearScale(d.poverty))
        .attr("cy", d => yLinearScale(d.diabetes))
        .attr("r", "10")
        .attr("fill", "brown")
        .attr("opacity", ".5");
    
    // Add text to circles
    chartGroup.append("text")
        .style("text-anchor", "middle")
        .style("font-size", "12px")
        .selectAll("tspan")
        .data(newsData)
        .enter()
        .append("tspan")
            .attr("x", function(data) {
                return xLinearScale(data.poverty - 0);
            })
            .attr("y", function(data) {
                return yLinearScale(data.diabetes - 0.1);
            })
            .text(function(data) {
                return data.abbr
            });
    
    // Create axes labels
    chartGroup.append("g")
        .attr("transform", `translate(0, ${height})`)
        .call(bottomAxis);
        
    chartGroup.append("g")
        .call(leftAxis);
    
    chartGroup.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0-margin.left + 40)
        .attr("x", 0-height/2)
        .attr("dy", "1em")
        .attr("class", "axis-text")
        .text("Has Diabetes (%)");
    
    chartGroup.append("text")
        .attr("transform", "translate(" + width/2 + " ," + (height + margin.top + 20) + ")"
        )
        .attr("class", "axis-text")
        .text("In Poverty (%)");
});