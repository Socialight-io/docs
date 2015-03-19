'use strict';

/**
 * @ngdoc directive
 * @name analyticsApp.directive:chart.posts
 * @description
 * # chart.posts
 */
angular.module('analyticsApp')
  .directive('chart.posts', function () {
    return {
      template: '<div></div>',
      restrict: 'E',
      link: function postLink(scope, element, attrs) {
        element.text('this is the chart.posts directive');
      }
    };
  });
