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

        var ticks = [0, xMax];

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
        .attr("transform", "rotate(-90)");

        svg.append("g")
            .attr("class", "y axis")
        .attr("transform", "translate(" + x(0) + ",0)")
            .call(yAxis);

    });



    return;




    var w = 600;
    var h = 250;

    console.log("Creating Budget Gross Bar");
    /*
    var dataset = [
        { key: 0, value: 5 },
        { key: 1, value: 10 },
        { key: 2, value: 13 },
        { key: 3, value: 19 },
        { key: 4, value: 21 },
        { key: 5, value: 25 },
        { key: 6, value: 22 },
        { key: 7, value: 18 },
        { key: 8, value: 15 },
        { key: 9, value: 13 },
        { key: 10, value: 11 },
        { key: 11, value: 12 },
        { key: 12, value: 15 },
        { key: 13, value: 20 },
        { key: 14, value: 18 },
        { key: 15, value: 17 },
        { key: 16, value: 16 },
        { key: 17, value: 18 },
        { key: 18, value: 23 },
        { key: 19, value: 25 }];
        */

    d3.csv("CSV/budgetToGross.csv", function (dataset) {
        var w = $("#budgetToGross").width() - 20;
        var h = $("#budgetToGross").height() - 40;

        for (var x = 0; x < dataset.length; x++) {
            dataset[x].value = parseInt(dataset[x].value);
            dataset[x].key = parseInt(dataset[x].key);
        }

        console.log(dataset);

        var xScale = d3.scale.ordinal()
                        .rangeRoundBands([0, w], 0.05);

        var yScale = d3.scale.linear()
                        .range([0, h]);

        var xAxis = d3.svg.axis()
        .scale(xScale)
        .orient("bottom")
        .ticks(0);

        var yAxis = d3.svg.axis()
            .scale(yScale)
            .orient("left")
            .ticks(10);

        xScale.domain(dataset.map(function (d) { return d.key; }));
        yScale.domain([0, d3.max(dataset, function (d) { return d.value; })]);

        var key = function (d) {
            return d.key;
        };

        //Create SVG element
        var svg = d3.select("#budgetToGross")
                    .append("svg")
                    .attr("width", w)
                    .attr("height", h + 20);

        svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + yScale(d3.max(dataset, function (d) { return d.value; })) + ")")
        .call(xAxis);

        svg.append("g")
        .attr("class", "y axis")
        .call(yAxis);

        //Create bars
        svg.selectAll("rect")
           .data(dataset, key)
           .enter()
           .append("rect")
           .attr("x", function (d, i) {
               return xScale(d.key);
           })
           .attr("y", function (d) {
               return h - yScale(d.value);
           })
           .attr("width", xScale.rangeBand())
           .attr("height", function (d) {
               return yScale(d.value);
           })
           .attr("fill", function (d) {
               return "blue";
           })

            //Tooltip
            .on("mouseover", function (d) {
                //Get this bar's x/y values, then augment for the tooltip
                var xPosition = parseFloat(d3.select(this).attr("x")) + xScale.rangeBand() / 2;
                var yPosition = parseFloat(d3.select(this).attr("y")) + 14;

                //Update Tooltip Position & value
                d3.select("#tooltip")
                    .style("left", xPosition + "px")
                    .style("top", yPosition + "px")
                    .select("#value")
                    .text(d.value);
                d3.select("#tooltip").classed("hidden", false)
            })
            .on("mouseout", function () {
                //Remove the tooltip
                d3.select("#tooltip").classed("hidden", true);
            });
    });
}




// CREATE BUDGET VS IMDB SCORE LINE CHART

budgetScoreLine();

function budgetScoreLine() {
    // define dimensions of graph
    var m = [80, 80, 80, 80]; // margins
    var w = $('#budgetToScore').width() - m[1] - m[3]; // width
    var h = 400 - m[0] - m[2]; // height

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

        var lineMaxX = d3.max(data, function (d) { return d.budget; });
        var lineMinX = d3.min(data, function (d) { return d.budget; });
        var lineMaxY = d3.max(data, function (d) { return d.score; });
        var lineMinY = d3.min(data, function (d) { return d.score; });

        console.log(lineMaxX);

        // X scale will fit all values from data[] within pixels 0-w
        var xScale = d3.scale.linear().domain([0, lineMaxX]).range([0, w]);
        // Y scale will fit values from 0-10 within pixels h-0 (Note the inverted domain for the y-scale: bigger is up!)
        var yScale = d3.scale.linear().domain([0, lineMaxY]).range([h, 0]);
        // automatically determining max range can work something like this
        // var y = d3.scale.linear().domain([0, d3.max(data)]).range([h, 0]);

        // create a line function that can convert data[] into x and y points
        var line = d3.svg.line()
        // assign the X function to plot our line as we wish
        .x(function (d) {
            // verbose logging to show what's actually being done
            //  console.log('Plotting X value for data point: ' + d + ' using index: ' + i + ' to be at: ' + x(i) + ' using our xScale.');
            // return the X coordinate where we want to plot this datapoint
            console.log(d);
            return xScale(d.budget);
        })
            .y(function (d) {
                // verbose logging to show what's actually being done
                //  console.log('Plotting Y value for data point: ' + d + ' to be at: ' + y(d) + " using our yScale.");
                // return the Y coordinate where we want to plot this datapoint
                return yScale(d.score);
            });

        // Add an SVG element with the desired dimensions and margin.
        var graph = d3.select("#budgetToScore").append("svg:svg")
            .attr("width", w + m[1] + m[3])
            .attr("height", h + m[0] + m[2])
            .append("svg:g")
            .attr("transform", "translate(" + m[3] + "," + m[0] + ")");

        // create yAxis
        var xAxis = d3.svg.axis().scale(xScale).tickSize(-h).tickSubdivide(true);
        // Add the x-axis.

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


        var mainLine = graph.append("path").datum(data).attr("d", line);

        //console.log(line(data));        


        var verticalLine = graph.append('line')
        // .attr('transform', 'translate(100, 50)')
        .attr({
            'x1': 0,
            'y1': 0,
            'x2': 0,
            'y2': h
        })
            .attr("stroke", "steelblue")
            .attr('class', 'verticalLine');

        circle = graph.append("circle")
            .attr("opacity", 0)
            .attr({
                r: 6,
                fill: 'darkred'

            });

        rect.on('mousemove', function () {

            var xPos = d3.mouse(this)[0];
            d3.select(".verticalLine").attr("transform", function () {
                return "translate(" + xPos + ",0)";
            });


            var pathLength = mainLine.node().getTotalLength();
            var x = xPos;
            var beginning = x,
                end = pathLength,
                target;
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
            circle.attr("opacity", 1)
                .attr("cx", x)
                .attr("cy", pos.y);


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

    var getCatNames = function (dataset) {
        var catNames = new Array();

        for (var i = 0; i < dataset[0].data.length; i++) {
            catNames.push(dataset[0].data[i].cat);
        }

        return catNames;
    }

    var createLegend = function (catNames) {
        var legends = charts.select('.legend')
                        .selectAll('g')
                            .data(catNames)
                        .enter().append('g')
                            .attr('transform', function (d, i) {
                                return 'translate(' + (i * 150 + 10) + ', 10)';
                            });

        legends.append('circle')
            .attr('class', 'legend-icon')
            .attr('r', 6)
            .style('fill', function (d, i) {
                return color(i);
            });

        legends.append('text')
            .attr('dx', '1em')
            .attr('dy', '.3em')
            .text(function (d) {
                return d;
            });
    }

    var createCenter = function (pie) {

        var eventObj = {
            'mouseover': function (d, i) {
                d3.select(this)
                    .transition()
                    .attr("r", chart_r * 0.65);
            },

            'mouseout': function (d, i) {
                d3.select(this)
                    .transition()
                    .duration(500)
                    .ease('bounce')
                    .attr("r", chart_r * 0.6);
            },

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

        donuts.append('text')
                .attr('class', 'center-txt type')
                .attr('y', chart_r * -0.16)
                .attr('text-anchor', 'middle')
                //.style('font-weight', 'bold')
                .text(function (d, i) {
                    return d.type;
                });
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
        var sum = d3.sum(thisDonut.selectAll('.clicked').data(), function (d) {
            return d.data.val;
        });

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

    var resetAllCenterText = function () {
        charts.selectAll('.value')
            .text(function (d) {
                return d.total.toFixed(1) + d.unit;
            });
        charts.selectAll('.percentage')
            .text('');
    }

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
                    return color(i);
                })
                .style('stroke', '#FFFFFF')
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
        chart_m = $charts.innerWidth() / dataset.length / 5 * 0.14; // dataset.length / 2 * 0.14;
        chart_r = $charts.innerWidth() / dataset.length / 5 * 0.65; // dataset.length / 2 * 0.85;
        labelr = chart_r + 20;

        /*
        charts.append('svg')
            .attr('class', 'legend')
            .attr('width', '100%')
            .attr('height', 50)
            .attr('transform', 'translate(0, -100)');
            */

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

    d3.csv("CSV/topGenres.csv", function (genreTotals) {
        var total = 0;
        console.log(genreTotals);

        for (var x = 0; x < genreTotals.length; x++) {
            total += parseInt(genreTotals[x].val);
            genreTotals[x].val = parseInt(genreTotals[x].val)
        }
        console.log("Genre Total: " + total);

        var newData = [{
            "type": "Genre",
            "unit": "Num Movies",
            "data": genreTotals,
            "total": total
        }];

        var donuts = new DonutCharts();
        donuts.create(newData);
    });
}

/*
function createGenrePie() {

    console.log("Creating Genre Pie");

    d3.csv("CSV/topGenres.csv", function (genreTotals) {

        console.log(genreTotals);

        var widthDiv = $('#genrePie').width();
        var margin = { top: 20, right: 20, bottom: 40, left: 80 },
        width = widthDiv - margin.left - margin.right,
        height = 350 - margin.top - margin.bottom,
        radius = height / 2;
        var total = 0;
        for (var x = 0; x < genreTotals.length; x++) {
            total += genreTotals[x].count;
        }

        var color = d3.scale.category20b();

        var svg = d3.select("#genrePie").append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
          .append('g')
            .attr('transform', 'translate(' + (width / 2) + ',' + (height / 2) + ')');

        var arc = d3.svg.arc()
          .innerRadius(0)
          .outerRadius(radius);

        var pie = d3.layout.pie()
          .value(function (d) { return d.count; })
          .sort(null);

        var path = svg.selectAll('path')
          .data(pie(genreTotals))
          .enter()
          .append('path')
          .attr('d', arc)
          .attr('fill', function (d, i) {
              return color(d.data.genres);
          })
        .append('svg:title')
            .text(function (d) {
                return d.data.genres + "-" + d.value + " movies - " + (d.value / total * 100) + "%";
            });

    });
}
*/