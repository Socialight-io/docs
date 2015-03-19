'use strict';

/**
 * @ngdoc directive
 * @name analyticsApp.directive:chart.voice
 * @description
 * # chart.voice
 */
angular.module('analyticsApp')
	.directive('voice', function() {
		return {
			template: '<div id="{{ id }}"></div>',
			restrict: 'E',
			scope: {
				data: "=",
				options: "=",
				selected: "=",
				modal: "=",
				label: "="
			},
			link: function postLink(scope, element, attrs) {

				scope.$watch('data', function() {
					if (scope.data && scope.data.length > 0) {
						scope.init(scope.data);
					}
				});

				scope.id = "chart-" + Math.round(Math.random() * 1000000);

				scope.init = function() {

					var margin = {
							top: 30,
							right: 0,
							bottom: 150,
							left: 0
						},

					width = element.parent().width() - margin.left - margin.right,
					height = width * .7;
					var radius = width > height ? height / 2 : width / 2;

					var color = d3.scale.linear()
						.range([.1, 1])
						.domain([0, scope.data.length]);

					var pie = d3.layout.pie()
					    .value(function(d) { return d.engagement; })
					    .sort(null);

					var arc = d3.svg.arc()
					    .innerRadius(radius - 40)
					    .outerRadius(radius - 0);

					var pie2 = d3.layout.pie()
					    .value(function(d) { return d.count; })
					    .sort(null);

					var arc2 = d3.svg.arc()
					    .innerRadius(0)
					    .outerRadius(radius - 30);

					d3.select("#" + scope.id + " svg").remove();
					
					var svg = d3.select("#" + scope.id).append("svg")
						.attr("class", "pie")
					    .attr("width", width)
					    .attr("height", height)
					  .append("g")
					    .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

					var path1 = svg.datum(scope.data).selectAll(".slice-large")
					  .data(pie2)
					.enter().append("path")
					  .attr("class", "slice-large")
					  .attr("fill", function(d, i) { return "#006699"; })
					  .attr("opacity", function (d, i) { return color(i); })
					  .attr("d", arc)
						.on("mouseover", function(d) {

						})
						.on("mouseout", function(d) {

						})
						.on("mousedown", function(d) {

						});

					var text = svg.datum(scope.data).selectAll("text")
						.data(pie);

					text.enter()
						.append("text")
						.attr("dy", ".25em")
						.attr("class", function (d) { })
						.style("text-anchor", "middle")
						.text(function(d) {
							return scope.label ? scope.label(d) : (_.reduce(_.values(d.data._id), function (z, y) { return z + " " + y; }, "")).toUpperCase();
						});
					
					function midAngle(d){
						return d.startAngle + (d.endAngle - d.startAngle)/2;
					}

					text.transition().duration(1000)
						.attrTween("transform", function(d) {
							this._current = this._current || d;
							var interpolate = d3.interpolate(this._current, d);
							this._current = interpolate(0);
							return function(t) {
								var d2 = interpolate(t);
								var pos = arc.centroid(d2);

								return "translate("+ pos +")";
							};
						})
						.styleTween("text-anchor", function(d){
							this._current = this._current || d;
							var interpolate = d3.interpolate(this._current, d);
							this._current = interpolate(0);
							return function(t) {
								var d2 = interpolate(t);
								return midAngle(d2) < Math.PI ? "middle":"middle";
							};
						});

					text.exit()
						.remove();


				}
			}
		};
	});
