d3.json('https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/cyclist-data.json', function(err, data) {


    var date = new Date();
    date.setMinutes(0);
    date.setHours(0);
    var margin = {
            top: 20,
            right: 20,
            bottom: 50,
            left: 60
        },
        width = 895 - margin.left - margin.right,
        height = 550 - margin.top - margin.bottom;

    var radius = height / (2 * data.length);

    var y = d3.scaleLinear().range([0, height]);
    var startTime = new Date(date.getTime())
    startTime.setSeconds(0);
    var endTime = new Date(date.getTime());
    endTime.setSeconds(data[data.length - 1].Seconds - data[0].Seconds + 10);

    var x = d3.scaleTime().domain([endTime, startTime]).range([0, width]).nice();

    var chart = d3.select("#chart")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.left + margin.right)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    y.domain([0, data[data.length - 1].Place + 4]);

    var tooltip = d3.select("#tooltip")
        .style("visibility", "hidden");

    var circle = chart.selectAll("circle")
        .data(data)
        .enter().append("circle")
        .attr("cx", function(d, i) {
            var newDate = new Date(date.getTime());
            newDate.setSeconds(d.Seconds - data[0].Seconds);
            return x(newDate);
        })
        .attr("cy", function(d, i) {
            return y(d.Place);
        })
        .attr("r", function(d) {
            return Math.floor(radius - 1);
        })
        .attr("fill", function(d) {
            if (d.Doping.length > 0) {
                return "#E74C3C";
            } else {
                return "#3498DB";
            }
        })
        .on("mouseover", function(d) {
            tooltip.select("#name span").text(d.Name);
            tooltip.select("#nation span").text(d.Nationality);
            tooltip.select("#time span").text(d.Time);
            tooltip.select("#year span").text(d.Year);
            tooltip.select("#doping").text(d.Doping);
            tooltip.style("visibility", "visible");
            return;
        })
        .on("mousemove", function(d) {
            if (d.Doping.length > 0) {
                d3.select(this).attr("fill", "#d62c1a");
            } else {
                d3.select(this).attr("fill", "#217dbb");
            }
            return tooltip.style("top", (d3.event.pageY - 10) + "px")
                .style("left", (d3.event.pageX + 10) + "px");
        })
        .on("mouseout", function(d) {
            if (d.Doping.length > 0) {
                d3.select(this).attr("fill", "#E74C3C");
            } else {
                d3.select(this).attr("fill", "#3498DB");
            }
            return tooltip.style("visibility", "hidden");
        });

    var xAxis = d3.axisBottom(x).ticks(d3.timeSecond.every(30)).tickFormat(d3.timeFormat("%M:%S"));

    chart.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0, " + height + ")")
        .call(xAxis);


    d3.select("#chart").append("text")
        .text("Ranking")
        .attr("fill", "#000")
        .attr('transform', 'translate(' + 20 + ',' + (height / 2 + 20) + ') rotate(-90)');

    var yAxis = d3.axisLeft(y);

    chart.append("g")
        .attr("class", "y axis")
        .call(yAxis);

    d3.select("#chart").append("text")
        .text("Minutes Behind Fastest Time")
        .attr("fill", "#000")
        .attr('transform', 'translate(' + (width / 2 - 50) + ',' + (height + 70) + ')');
});
