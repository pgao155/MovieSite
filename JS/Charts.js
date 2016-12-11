var username = prompt("Please enter your name");
$('.user').html(username);

// Initialize tooltips

$('#grenrePieInfo').prop('title', 'Pie chart depicting the percentage of the genre of movies analyzed');
$('#budgetIMDBInfo').prop('title', 'Line chart showing the budget (x axis) and resulting IMDB score (y axis)');
$('#budgetIncomeInfo').prop('title', 'Bar chart showing the budget (x axis) and resulting gross income (y axis)');

// Change the CSS stylesheet based on the user's preference
var style = prompt("Would you prefer a light theme or a dark theme (light/dark):");
switch (style) {
    case 'light':
        $('head').append('<link rel="stylesheet" href="CSS/bootstrap.light.css" type="text/css" />');
        break;
    case 'dark':
        $('head').append('<link rel="stylesheet" href="CSS/bootstrap.dark.css" type="text/css" />');
        break;
    default:
        break;
}

// Show the page after the user decided the style
$('.container').show();

// CREATE BAR CHART FOR BUDGET TO GROSS

budgetGrossBar();

function budgetGrossBar() {


    // get the data
    d3.csv("CSV/budgetToGross.csv", function (error, data) {
        if (error) throw error;

        data.sort(function (a, b) {
            return a.key - b.key;
        });

        var margin = { top: 20, right: 20, bottom: 30, left: 40 },
        width = $('#budgetToGross').width() - margin.left - margin.right,
        height = $('#budgetToGross').height() - margin.top - margin.bottom;

        // set the ranges
        var x = d3.scale.ordinal().rangeRoundBands([0, width], 0);
        var y = d3.scale.linear().range([height, 0]);

        // append the svg object to the body of the page
        // append a 'group' element to 'svg'
        // moves the 'group' element to the top left margin
        var svg = d3.select("#budgetToGross").append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
          .append("g")
            .attr("transform",
                  "translate(" + margin.left + "," + margin.top + ")");


        // format the data
        data.forEach(function (d) {
            d.value = +d.value;
            d.key = +d.key;
        });

        var xMin = 0;
        var xMax = d3.max(data, function (d) { return d.key; });

        var ticks = [xMax];

        var xAxis = d3.svg.axis()
        .scale(x)
        .orient("bottom")
        .tickValues(ticks);

        var yAxis = d3.svg.axis()
        .scale(y)
        .orient("left");

        // Scale the range of the data in the domains
        x.domain(data.map(function (d) { return d.key; }));
        y.domain([0, d3.max(data, function (d) { return d.value; })]);

        // append the rectangles for the bar chart
        svg.selectAll(".bar")
            .data(data)
          .enter().append("rect")
            .attr("class", "bar")
            .attr("x", function (d) { if (d.key > xMax) { console.log(d.key); } return x(d.key); })
            .attr("width", x.rangeBand())
            .attr("y", function (d) { return y(d.value); })
            .attr("height", function (d) { return height - y(d.value); });

        // add the x Axis
        svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + y(0) + ")")
        .call(xAxis)
        .selectAll("text")
        .style("text-anchor", "end")
        .attr("dx", "-.8em")
        .attr("dy", "-.55em")
        .attr("transform", "rotate(-25)");

        svg.append("g")
            .attr("class", "y axis")
        .attr("transform", "translate(" + x(0) + ",0)")
            .call(yAxis);

    });
}




// CREATE BUDGET VS IMDB SCORE LINE CHART

budgetScoreLine();

function budgetScoreLine() {

    console.log("KAJSDKLJAS");
    console.log($('#budgetToScore').width());

    // define dimensions of graph
    var m = [80, 80, 80, 80]; // margins
    var w = $('#budgetToScore').width() - m[1] - m[3]; // width
    var h = 400 - m[0] - m[2]; // height

    // Load the csv
    d3.csv("CSV/averageBudgetToScore.csv", function (data) {

        console.log(data);

        for (var x = 0; x < data.length; x++) {
            if (data[x].budget == null) {
                data[x].budget = 0;
            }
            if (data[x].score == null) {
                data[x].score = 0;
            }
        }

        // Get the min and max of range and domain
        var lineMaxX = d3.max(data, function (d) { return d.budget; });
        var lineMinX = d3.min(data, function (d) { return d.budget; });
        var lineMaxY = d3.max(data, function (d) { return d.score; });
        var lineMinY = d3.min(data, function (d) { return d.score; });

        console.log(lineMaxX);

        var xScale = d3.scale.linear().domain([0, lineMaxX]).range([0, w]);
        var yScale = d3.scale.linear().domain([0, lineMaxY]).range([h, 0]);

        // create a line function that can convert data[] into x and y points
        var line = d3.svg.line()
        // assign the X function to plot our line as we wish
        .x(function (d) {
            return xScale(d.budget);
        })
            .y(function (d) {
                return yScale(d.score);
            });

        // Add an SVG element with the desired dimensions and margin.
        var graph = d3.select("#budgetToScore").append("svg:svg")
            .attr("width", w + m[1] + m[3])
            .attr("height", h + m[0] + m[2])
            .append("svg:g")
            .attr("transform", "translate(" + m[3] + "," + m[0] + ")");


        var xAxis = d3.svg.axis().scale(xScale).tickSize(-h).tickSubdivide(true);

        // Define the overlay that will handle the mouseover
        var rect = graph.append("rect").attr({
            w: 0,
            h: 0,
            width: w,
            height: h,
            fill: "#ffffff"
        });

        graph.append("svg:g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + h + ")")
            .call(xAxis);

        var yAxisLeft = d3.svg.axis().scale(yScale).ticks(4).orient("left");

        graph.append("g")
            .attr("class", "y axis")
            .attr("transform", "translate(-25,0)")
            .call(yAxisLeft);

        // Create the line with the data
        var mainLine = graph.append("path").datum(data).attr("d", line);

        // Vertical lines that will follow the mouse hover
        var verticalLine = graph.append('line')
        .attr({
            'x1': 0,
            'y1': 0,
            'x2': 0,
            'y2': h
        })
            .attr("stroke", "steelblue")
            .attr('class', 'verticalLine');

        // Circle that will follow the mouseover
        circle = graph.append("circle")
            .attr("opacity", 0)
            .attr({
                r: 6,
                fill: 'darkred'

            });

        // Mouse move function for rectangle that is overlaid over the entire graph
        rect.on('mousemove', function () {

            // Get position
            var xPos = d3.mouse(this)[0];
            d3.select(".verticalLine").attr("transform", function () {
                return "translate(" + xPos + ",0)";
            });


            var pathLength = mainLine.node().getTotalLength();
            var x = xPos;
            var beginning = x,
                end = pathLength,
                target;

            // Find the position of the mouse
            while (true) {
                target = Math.floor((beginning + end) / 2);
                pos = mainLine.node().getPointAtLength(target);
                if ((target === end || target === beginning) && pos.x !== x) {
                    break;
                }
                if (pos.x > x) end = target;
                else if (pos.x < x) beginning = target;
                else break; //position found
            }

            // Show the circle
            circle.attr("opacity", 1)
                .attr("cx", x)
                .attr("cy", pos.y);

            // Debug loggin
            console.log("x and y coordinate where vertical line intersects graph: " + [pos.x, pos.y]);
            console.log("data where vertical line intersects graph: " + [xScale.invert(pos.x), yScale.invert(pos.y)]);


        });
    });
}




// CREATE PERCENT GENRE PIE

function DonutCharts() {

    var charts = d3.select('#genrePie');

    var chart_m,
        chart_r,
        labelr,
        color = d3.scale.category20();

    var margin = {
        "left": 20,
        "right": 20
    };

    // Get the categories
    var getCatNames = function (dataset) {
        var catNames = new Array();

        for (var i = 0; i < dataset[0].data.length; i++) {
            catNames.push(dataset[0].data[i].cat);
        }

        return catNames;
    }

    // Center of the pie
    var createCenter = function (pie) {

        var eventObj = {
            // When you mouseover the center of the pie the circle expands
            'mouseover': function (d, i) {
                d3.select(this)
                    .transition()
                    .attr("r", chart_r * 0.65);
            },
            // When you mouseout the circle returns to original size
            'mouseout': function (d, i) {
                d3.select(this)
                    .transition()
                    .duration(500)
                    .ease('bounce')
                    .attr("r", chart_r * 0.6);
            },
            // Click to reset selections
            'click': function (d, i) {
                var paths = charts.selectAll('.clicked');
                pathAnim(paths, 0);
                paths.classed('clicked', false);
                resetAllCenterText();
            }
        }

        var donuts = d3.selectAll('.donut');

        // The circle displaying total data.
        donuts.append("svg:circle")
            .attr("r", chart_r * 0.6)
            .style("fill", "#E7E7E7")
            .on(eventObj);

        // Text in the middle
        donuts.append('text')
                .attr('class', 'center-txt type')
                .attr('y', chart_r * -0.16)
                .attr('text-anchor', 'middle')
                //.style('font-weight', 'bold')
                .text(function (d, i) {
                    return d.type;
                });
        // Text that will be updated based on the selections
        donuts.append('text')
                .attr('class', 'center-txt value')
                .attr('text-anchor', 'middle');
        donuts.append('text')
                .attr('class', 'center-txt percentage')
                .attr('y', chart_r * 0.16)
                .attr('text-anchor', 'middle')
                .style('fill', '#A2A2A2');
    }

    var setCenterText = function (thisDonut) {
        // Get all of the selected data
        var sum = d3.sum(thisDonut.selectAll('.clicked').data(), function (d) {
            return d.data.val;
        });
        // Set values based on the selections
        thisDonut.select('.value')
            .text(function (d) {
                return (sum) ? sum.toFixed(1) + d.unit
                            : d.total.toFixed(1) + d.unit;
            });
        thisDonut.select('.percentage')
            .text(function (d) {
                return (sum) ? (sum / d.total * 100).toFixed(2) + '%'
                            : '';
            });
    }
    // Clear the center text and reset the number of movies to total
    var resetAllCenterText = function () {
        charts.selectAll('.value')
            .text(function (d) {
                return d.total.toFixed(1) + d.unit;
            });
        charts.selectAll('.percentage')
            .text('');
    }
    // Defines the animation of the pie slices when they are selected and deselected
    var pathAnim = function (path, dir) {
        switch (dir) {
            case 0:
                path.transition()
                    .duration(500)
                    .ease('bounce')
                    .attr('d', d3.svg.arc()
                        .innerRadius(chart_r * 0.7)
                        .outerRadius(chart_r)
                    );
                break;

            case 1:
                path.transition()
                    .attr('d', d3.svg.arc()
                        .innerRadius(chart_r * 0.7)
                        .outerRadius(chart_r * 1.08)
                    );
                break;
        }
    }

    var updateDonut = function () {

        var eventObj = {
            // Pulls the piece of the pir out when moused over
            'mouseover': function (d, i, j) {
                pathAnim(d3.select(this), 1);

                var thisDonut = charts.select('.type' + j);
                thisDonut.select('.value').text(function (donut_d) {
                    return d.data.val.toFixed(1) + donut_d.unit;
                });
                thisDonut.select('.percentage').text(function (donut_d) {
                    return (d.data.val / donut_d.total * 100).toFixed(2) + '%';
                });

                thisDonut.selectAll('text')
                    .style("font-weight", function (d) {
                        if (d3.select(this).classed('clicked')) {
                            return "bold";
                        }
                    })
            },
            // Returns the piece of the pie to the original position when mouse leaves
            'mouseout': function (d, i, j) {
                var thisPath = d3.select(this);
                var user = d.data.cat;
                var thisDonut = charts.select('.type' + j);
                if (!thisPath.classed('clicked')) {
                    pathAnim(thisPath, 0);
                    thisDonut.selectAll('text')
                    .style("font-weight", function (d) {
                        if (d3.select(this).classed('clicked')) {
                            return "bold";
                        }
                        if (d.data.cat == user) {
                            return "";
                        }
                    })
                }
                setCenterText(thisDonut);
            },
            // Keeps the piece of the pie out when it is clicked and begins to add data together for the center text if multiple are clicked
            'click': function (d, i, j) {
                var thisDonut = charts.select('.type' + j);

                if (0 === thisDonut.selectAll('.clicked')[0].length) {
                    thisDonut.select('circle').on('click')();
                }

                var thisPath = d3.select(this);
                var clicked = thisPath.classed('clicked');
                console.log(clicked);
                if (!clicked) {
                    thisDonut.selectAll('text')
                    .style("font-weight", function (d) {
                        if (d3.select(this).classed('clicked')) {
                            return "bold";
                        }
                    })
                } else {
                    thisDonut.selectAll('text')
                    .style("font-weight", function (d) {
                        if (d3.select(this).classed('clicked')) {
                            return "bold";
                        }
                    })
                }
                pathAnim(thisPath, ~~(!clicked));
                thisPath.classed('clicked', !clicked);

                setCenterText(thisDonut);
            }
        };

        var pie = d3.layout.pie()
                        .sort(null)
                        .value(function (d) {
                            return d.val;
                        });

        var arc = d3.svg.arc()
                        .innerRadius(chart_r * 0.7)
                        .outerRadius(function () {
                            try {
                                return (d3.select(this).classed('clicked')) ? chart_r * 1.08
                                                                           : chart_r;
                            } catch (ex) {
                                return chart_r;
                            }
                        });

        // Start joining data with paths
        var paths = charts.selectAll('.donut')
                        .selectAll('path')
                        .data(function (d, i) {
                            return pie(d.data);
                        });

        paths
            .transition()
            .duration(1000)
            .attr('d', arc);

        paths.enter()
            .append('svg:path')
                .attr('d', arc)
                .style('fill', function (d, i) {
                    // Creates a d3 color set and assigns categories to individual colors
                    return color(i);
                })
                .style('stroke', '#FFFFFF')
                // Attach the mouse events
                .on(eventObj);

        paths.exit().remove();

        // Add labels to paths
        var labels = charts.selectAll('.donut')
                        .selectAll('g')
                        .data(function (d, i) {
                            console.log("Creating labels");
                            console.log(pie(d.data));
                            return pie(d.data);
                        });

        paths.enter()
            .append('text')
                .attr("transform", function (d) {
                    var c = arc.centroid(d),
                        x = c[0],
                        y = c[1],
                        // pythagorean theorem for hypotenuse
                        h = Math.sqrt(x * x + y * y);
                    return "translate(" + (x / h * labelr) + ',' +
                       (y / h * labelr) + ")";
                })
                .attr("dy", ".35em")
                .attr("text-anchor", function (d) {
                    // are we past the center?
                    return (d.endAngle + d.startAngle) / 2 > Math.PI ?
                        "end" : "start";
                })
            .attr("fill", "lightgrey")
                .text(function (d) {
                    return d.data.cat;
                });

        resetAllCenterText();
    }

    this.create = function (dataset) {
        console.log("Creating Pies");
        console.log(dataset);
        var $charts = $('#genrePie');
        // Dimensions
        chart_m = $charts.innerWidth() / dataset.length / 5 * 0.14; // dataset.length / 2 * 0.14;
        chart_r = $charts.innerWidth() / dataset.length / 5 * 0.65; // dataset.length / 2 * 0.85;
        labelr = chart_r + 20;

        var donut = charts.selectAll('.donut')
                        .data(dataset)
                    .enter().append('svg:svg')
                        .attr('width', (chart_r + chart_m) * 2 + 150 + +$charts.width() / 3)
                        .attr('height', (chart_r + chart_m) * 2 + 10)
                    .append('svg:g')
                        .attr('class', function (d, i) {
                            return 'donut type' + i;
                        })
                        .attr('transform', 'translate(' + (chart_r + chart_m + 75 + $charts.width() / 4) + ',' + (chart_r + chart_m + 10) + ')');

        //createLegend(getCatNames(dataset));
        createCenter();

        updateDonut();
    }

    this.update = function (dataset) {
        // Assume no new categ of data enter
        var donut = charts.selectAll(".donut")
                    .data(dataset);

        updateDonut();
    }
}

createGenrePie();

function createGenrePie() {
    console.log("Creating Genre Pie");

    // Get CSV data
    d3.csv("CSV/topGenres.csv", function (genreTotals) {
        var total = 0;
        console.log(genreTotals);

        for (var x = 0; x < genreTotals.length; x++) {
            total += parseInt(genreTotals[x].val);
            genreTotals[x].val = parseInt(genreTotals[x].val)
        }
        console.log("Genre Total: " + total);

        // Format the data
        var newData = [{
            "type": "Genre",
            "unit": " Num Movies",
            "data": genreTotals,
            "total": total
        }];

        // Create a new donut object and pass the data to it
        var donuts = new DonutCharts();
        donuts.create(newData);
    });
}