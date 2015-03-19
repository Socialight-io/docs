'use strict';

/**
 * @ngdoc directive
 * @name analyticsApp.directive:chart.dotsizes.js
 * @description
 * # chart.dotsizes.js
 */
angular.module('analyticsApp')
  .directive('chart.dotsizes.js', function () {
    return {
      template: '<div></div>',
      restrict: 'E',
      link: function postLink(scope, element, attrs) {
        element.text('this is the chart.dotsizes.js directive');
      }
    };
  });
