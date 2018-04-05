var height = 600;
var width = 600;
var minYear = d3.min(birthData, d => d.year);
var maxYear = d3.max(birthData, d => d.year);
var yearData = getYearData(birthData, minYear);
var months = getMonths(yearData);
var svg = d3.select("svg")

svg
    .attr("width", width)
    .attr("height", height)
  .append("g")
    .attr("transform", `translate(${width/2}, ${height/2})`)
    .classed("outer-chart", true);


svg
    .attr("width", width)
    .attr("height", height)
  .append("g")
    .attr("transform", `translate(${width/2}, ${height/2})`)
    .classed("inner-chart", true);

svg
  .append("text")
    .classed("title", true)
    .attr("x", width / 2)
    .attr("y", 20)
    .style("text-anchor", "middle")
    .style("font-size", "1.3em")

d3.select("input")
  .property("min", minYear)
  .property("max", maxYear)
  .property("value", minYear)
  .on("input", function(){
    makePieChart(+d3.event.target.value)
  })

function quarterlyChart(yearInputValue) {
  yearData = getYearData(birthData, yearInputValue);
  var quarterlyBirths = getBirthsByQuarter(yearData)

  var qtrColorScale = d3.scaleOrdinal()
                    .domain(quarterlyBirths.map(item => item.quarter))
                    .range(["#f0ece9", "#d65279", "#72707c", "#d3d1e3"]);

  var qtrArcs = d3.pie()
               .value(d => d.births)
               .sort((a, b) => a.quarter - b.quarter)
               (quarterlyBirths);

  var qtrPath = d3.arc()
               .outerRadius(width / 4)
               .innerRadius(0);

  var qtrUpdate = d3.select(".inner-chart")
                 .selectAll(".arc")
                 .data(qtrArcs);

  qtrUpdate
    .exit()
    .remove();

  qtrUpdate
    .enter()
    .append("path")
      .classed("arc", true)
    .merge(qtrUpdate)
      .attr("fill", d => qtrColorScale(d.data.quarter))
      .attr("stroke", "black")
      .attr("d", qtrPath);
}

function monthlyChart(yearInputValue) {
  yearData = getYearData(birthData, yearInputValue);
  var monthColorScale = d3.scaleOrdinal()
                     .domain(months)
                     .range(d3.schemeCategory20);

  var monthArcs = d3.pie()
                    .value(d => d.births)
                    .sort((a, b) => {
                      return months.indexOf(a.month) - months.indexOf(b.month);
                    })
                    (yearData);

  var monthPath = d3.arc()
               .outerRadius(width / 2 - 50)
               .innerRadius(width / 4);

  var monthUpdate = d3.select(".outer-chart")
                 .selectAll(".arc")
                 .data(monthArcs);

  monthUpdate
    .exit()
    .remove();

  monthUpdate
    .enter()
    .append("path")
      .classed("arc", true)
    .merge(monthUpdate)
      .attr("fill", d => monthColorScale(d.data.month))
      .attr("stroke", "black")
      .attr("d", monthPath);
}

function makePieChart(yearInputValue) {
  updateTitle(yearInputValue);
  monthlyChart(yearInputValue);
  quarterlyChart(yearInputValue);
}


makePieChart(minYear);

// Helper Functions
function getMonths(array) {
  var monthSet = new Set()
  array.forEach(item => monthSet.add(item.month))
  return Array.from(monthSet)
}

function getBirthsByQuarter(data) {
  var quarterlyTotal = [
    { quarter: 1, births: 0},
    { quarter: 2, births: 0},
    { quarter: 3, births: 0},
    { quarter: 4, births: 0}
]

  for(let monthData of data){
    var { month, births } = monthData
    quarterlyTotal[Math.floor(months.indexOf(month) / 3)].births += births
  }
  return quarterlyTotal
}

function updateTitle(year) {
  d3.select(".title")
    .text(`Birth by Month and Quarter for ${year}`)
}

function getYearData(data, findYear) {
  return data.filter(d => d.year === findYear);
}
