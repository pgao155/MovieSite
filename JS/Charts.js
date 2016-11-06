createGenrePie();

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