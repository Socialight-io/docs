'use strict';

/**
 * @ngdoc overview
 * @name analyticsApp
 * @description
 * # analyticsApp
 *
 * Main module of the application.
 */
angular
  .module('analyticsApp', [
    'ngAnimate',
    'ngCookies',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngTouch',
  ])
  .config(function ($routeProvider, $sceDelegateProvider) {
    $routeProvider
      .when('/', {
        templateUrl: _appConfig.templatePath + 'accounts.html',
        controller: 'AccountsCtrl'
      })
      .when('/audience', {
        templateUrl: _appConfig.templatePath + 'audience.html',
        controller: 'AudienceCtrl'
      })
      .when('/content', {
        templateUrl: _appConfig.templatePath + 'content.html',
        controller: 'ContentCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });

      $sceDelegateProvider.resourceUrlWhitelist([
          // Allow same origin resource loads.
          'self',
          // Allow loading from our assets domain.
          'http://static.socialight.io/**',
          'https://api.instagram.com/**'
      ]);
  });
