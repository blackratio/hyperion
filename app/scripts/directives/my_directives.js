directives.directive('anchorClick', function() {
   return function(scope, element, attrs) {
      $(element).click(function(event) {
         event.preventDefault();
         var target = this.hash;
         var $target = $(target);

         $('html, body').stop().animate({
            'scrollTop': $target.offset().top - 50
         }, 600);
      });
   };
});


directives.directive('myDomDirective', function() {
   return {
      link: function($scope, element, attrs) {
         element.bind('click', function() {
            element.html('You clicked me!');
         });
         element.bind('mouseenter', function() {
            element.css('background-color', 'yellow');
         });
         element.bind('mouseleave', function() {
            element.css('background-color', 'white');
         });
      }
   };
});

directives.directive('popupMap', ['$http', '$compile',
  function($http, $compile) {
    return {
        restrict: 'EA',
        scope: {
            loc: "="
        },
        templateUrl: 'partials/popup.html'
    };
}]);

directives.directive('visGraph', ['$timeout', function($timeout) {
   return {
      restrict: 'E',
      scope: {
         data: '=data',
         options: '=options'
      },
      replace: true,
      link: function(scope, element, attrs) {

         // assign null to timeline
         var timeline = null;

         scope.$watchCollection('data', function(newValue, oldValue) {

            if (newValue === null) {
               return;
            }

            if (timeline !== null) {
               timeline.destroy();
            }

            if (newValue) {


               var max = newValue[0].start;
               var min = newValue[0].start;
               for (var i = 0; i < newValue.length; i++) {
                 if (newValue[i].start > max) {
                  max = newValue[i].start;
               } else if (newValue[i].start < min) {
                  min = newValue[i].start;
                 }
               }
               console.log(max);
               console.log(min);

            }

            var container = element[0];
            var now = moment().minutes(0).seconds(0).milliseconds(0);

            var options = {
               editable: false,
               stack: true,
               align: 'center',
               width: '100%',
               height: '190px',
               start: now.clone().add(-10, 'days'),
               end: now
            };


            if (newValue) {

               var datas = new vis.DataSet();
               datas.clear();
               datas.add(newValue);
               /*
               var names = ['html', 'css', 'js', 'git', 'apple'];
               var groups = new vis.DataSet();
               for (var g = 0; g < newValue.length; g++) {
                  groups.add({ id: names[g], content: names[g]});
               }*/
               timeline = new vis.Timeline(container, datas, options);

            }

         });

      }
   };
}]);

directives.directive('d3Graph', ['$timeout', function($timeout) {
   return {
      restrict: 'E',
      scope: {
         data: '=data'
      },
      replace: true,
      link: function(scope, element, attrs) {

         scope.$watchCollection('data', function(newValue, oldValue) {
            if(newValue) {

               _maleLength = [];
               _femaleLength = [];

               var test = scope.data;

               for (var i = 0; i < test.length; i++) {
                  if(test[i].gender === 'male') {
                     _maleLength.push(i);
                  }
                  else {
                     _femaleLength.push(i);
                  }
               }

               var seedData = [{
                  "label": "Male",
                  "value": _maleLength.length,
                  "link": "https://facebook.github.io/react/"
               }, {
                  "label": "Female",
                  "value": _femaleLength.length,
                  "link": "http://d3js.org"
               }];

               // Define size & radius of donut pie chart
               var width = 300,
                  height = 300,
                  radius = Math.min(width, height) / 2;

               // Define arc colours
               var colour = d3.scale.category20();

               // Define arc ranges
               var arcText = d3.scale.ordinal()
                  .rangeRoundBands([0, width], 0.1, 0.3);

               // Determine size of arcs
               var arc = d3.svg.arc()
                  .innerRadius(radius - 60)
                  .outerRadius(radius - 10);

               // Create the donut pie chart layout
               var pie = d3.layout.pie()
                  .value(function(d) {
                     return d.value;
                  })
                  .sort(null);

               // Append SVG attributes and append g to the SVG
               var svg = d3.select("#donut-chart")
                  .attr("width", width)
                  .attr("height", height)
                  .append("g")
                  .attr("transform", "translate(" + radius + "," + radius + ")");

               // Define inner circle
               svg.append("circle")
                  .attr("cx", 0)
                  .attr("cy", 0)
                  .attr("r", 100)
                  .attr("fill", "#fff");

               // Calculate SVG paths and fill in the colours
               var g = svg.selectAll(".arc")
                  .data(pie(seedData))
                  .enter().append("g")
                  .attr("class", "arc")

               // Make each arc clickable
               .on("click", function(d, i) {
                  window.location = seedData[i].link;
               });

               // Append the path to each g
               g.append("path")
                  .attr("d", arc)
                  .attr("fill", function(d, i) {
                     return colour(i);
                  });

               // Append text labels to each arc
               g.append("text")
                  .attr("transform", function(d) {
                     return "translate(" + arc.centroid(d) + ")";
                  })
                  .attr("dy", ".35em")
                  .style("text-anchor", "middle")
                  .attr("fill", "#fff")
                  .text(function(d, i) {
                     return seedData[i].label;
                  });

               g.selectAll(".arc text")
                  .call(wrap, arcText.rangeBand());

               // Append text to the inner circle
               svg.append("text")
                  .attr("dy", "-0.5em")
                  .style("text-anchor", "middle")
                  .attr("class", "inner-circle")
                  .attr("fill", "#36454f")
                  .text(function(d) {
                     return 'Gender';
                  });

               svg.append("text")
                  .attr("dy", "1.0em")
                  .style("text-anchor", "middle")
                  .attr("class", "inner-circle")
                  .attr("fill", "#36454f")
                  .text(function(d) {
                     return 'chart pie';
                  });

               // Wrap function to handle labels with longer text
               function wrap(text, width) {
                  text.each(function() {
                     var text = d3.select(this),
                        words = text.text().split(/\s+/).reverse(),
                        word,
                        line = [],
                        lineNumber = 0,
                        lineHeight = 1.1, // ems
                        y = text.attr("y"),
                        dy = parseFloat(text.attr("dy")),
                        tspan = text.text(null).append("tspan").attr("x", 0).attr("y", y).attr("dy", dy + "em");
                     console.log("tspan: " + tspan);
                     while (word = words.pop()) {
                        line.push(word);
                        tspan.text(line.join(" "));
                        if (tspan.node().getComputedTextLength() > 90) {
                           line.pop();
                           tspan.text(line.join(" "));
                           line = [word];
                           tspan = text.append("tspan").attr("x", 0).attr("y", y).attr("dy", ++lineNumber * lineHeight + dy + "em").text(word);
                        }
                     }
                  });
               }
            }

         });


      }
   };
}]);
