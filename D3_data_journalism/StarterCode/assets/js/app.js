// @TODO: YOUR CODE HERE!
var svgWidth = 900;
var svgHeight = 600;

var margin = {
    top: 40,
    bottom: 100,
    right: 40,
    left: 100
};

var height = svgHeight - margin.top - margin.bottom;
var width = svgWidth - margin.left - margin.right;

// Create SVG wrapper, append 
var svg = d3.select("#scatter")
    .append("svg")
    .attr("width", svgWidth)
    .attr("height", svgHeight);

var chartGroup = svg.append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

// parameters
var chosenXAxis = "poverty";
var chosenYAxis = "healthcare";

// Create scales. Function used for updating x-scale variable upon click on axis label.
function xScale(paperData, chosenXAxis) {
    var xLinearScale = d3.scaleLinear()
        .domain([d3.min(paperData, d => d[chosenXAxis]) * .8,
            d3.max(paperData, d => d[chosenXAxis]) * 1.2
        ])
        .range([0, width]);

    return xLinearScale;

}

// Create scales. Function used for updating y-scale variable upon click on axis label
function yScale(paperData, chosenYAxis) {
    var yLinearScale = d3.scaleLinear()
        .domain([d3.min(paperData, d => d[chosenYAxis]) * .8,
            d3.max(paperData, d => d[chosenYAxis]) * 1.2
        ])
        .range([height, 0]);

    return yLinearScale;
}


// If wanting to include other selection, use function.
// Function used for updating circles group for other.
function updateToolTip(chosenXAxis, chosenYAxis, circlesGroup) {

    // Conditional for X  and y Axis
    if (chosenXAxis === "poverty") {
        var xlabel = "In Poverty: ";
    }
    if (chosenYAxis === "healthcare") {
        var ylabel = "Lacks Healthcare: ";
    }

}

// Import csv
d3.csv("assets/data/data.csv")
    .then(function(paperData) {

    // Cast numbers
    paperData.forEach(function(data) {
        data.poverty = +data.poverty;
        data.healthcare = +data.healthcare;
        console.log(data);
    });

    // Create x / y scale axis function
    var xLinearScale = xScale(paperData, chosenXAxis);
    var yLinearScale = yScale(paperData, chosenYAxis);
    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);
    
    var xAxis = chartGroup.append("g")
        .classed("x-axis", true)
        .attr("transform", `translate(0, ${height})`)
        .call(bottomAxis);

    var yAxis = chartGroup.append("g")
        .classed("y-axis", true)
        .call(leftAxis);

    // create circles
    var circlesGroup = chartGroup.selectAll("circle")
        .data(paperData)
        .enter()
        .append("circle")
        .attr("cx", d => xLinearScale(d[chosenXAxis]))
        .attr("cy", d => yLinearScale(d[chosenYAxis]))
        .attr("r", "15")
        //couldnt figure out the right blue! 
        .attr("fill", "blue")
        .attr("opacity", ".3");

    // State abbrreviations 
    var circletextGroup = chartGroup.selectAll()
        .data(paperData)
        .enter()
        .append("text")
        .text(d => (d.abbr))
        .attr("x", d => xLinearScale(d[chosenXAxis]))
        .attr("y", d => yLinearScale(d[chosenYAxis]))
        .style("font-size", "12px")
        .style("text-anchor", "middle")
        .style("background-color", 'blue')
        .style('fill', 'white');

    var labelsGroup = chartGroup.append("g")
        .attr("transform", `translate(${width / 2}, ${height + 20})`);

    var povertyLabel = labelsGroup.append("text")
        .attr("x", 0)
        .attr("y", 20)
        .attr("value", "poverty")
        .classed("active", true)
        .text("In Poverty (%)");


    var healthcareLabel = labelsGroup.append("text")
        .attr("transform", "rotate(-90)")
        .attr("x", (margin.left) * 2.5)
        .attr("y", 0 - (height - 20))
        .attr("value", "healthcare")
        .classed("active", true)
        .text("Lacks Healthcare (%)");
        

});