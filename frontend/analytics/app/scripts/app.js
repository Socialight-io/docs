'use strict';

/**
 * @ngdoc overview
 * @name analyticsApp
 * @description
 * # analyticsApp
 *
 * Main module of the application.
 */

$.get(_config.api + "/accounts", { token: _config.group.token, uid: _config.group.id }, function (d) { 
  if (d.length > 0) { 
    app_init();
  } else { 
    window.location = "accountant";
  }
});

function app_init() { 
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
}