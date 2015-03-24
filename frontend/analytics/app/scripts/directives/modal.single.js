'use strict';

/**
 * @ngdoc directive
 * @name analyticsApp.directive:modal.single.js
 * @description
 * # modal.single.js
 */
angular.module('analyticsApp')
  .directive('modal', function () {
    return {
      templateUrl: _appConfig.templatePath + 'includes/modal.single.html',
      restrict: 'E',
      scope: { 
      	data: "=",
      	show: "=",
      },
      link: function postLink(scope, element, attrs) {
      	scope.id = "modal-" + Math.round(Math.random() * 1000000);

      	scope.$watch("show", function () { 
      		if (scope.show == true) { 
      			$("#"+scope.id).modal({show: true, background: 'static'});
      		} else { 
      			$("#"+scope.id).modal('hide');
      		}
      	});

      	element.find(".modal-backdrop").on("click", function (d) { 
      		$("#"+scope.id).modal('hide');
      		console.log("THIS SIHS");
      		scope.show = false;
      	});
      }
    };
  });
