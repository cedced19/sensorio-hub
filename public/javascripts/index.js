require('angular'); /*global angular*/
require('angular-route');
require('ng-notie');
require('angular-translate');
require('angular-translate-loader-static-files');
require('angular-translate-loader-url');
require('angular-local-storage');

var app = angular.module('Sensorio', ['ngNotie', 'ngRoute',  'LocalStorageModule', 'pascalprecht.translate']);
app.config(['$routeProvider', '$translateProvider', 'localStorageServiceProvider',  function($routeProvider, $translateProvider, localStorageServiceProvider) {
        // Route configuration
        $routeProvider
        .when('/', {
            templateUrl: '/views/list.html',
            controller: 'ListCtrl'
        })
        .when('/add-sensor', {
            templateUrl: '/views/add-sensor.html',
            controller: 'AddSensorCtrl'
        })
        .otherwise({
            redirectTo: '/'
        });

        // Localstorage configuration
        localStorageServiceProvider.setPrefix('sensorio');

        // i18n configuration
        $translateProvider
        .useStaticFilesLoader({
            prefix: '/langs/locale-',
            suffix: '.json'
        })
        .registerAvailableLanguageKeys(['en', 'fr'], {
          'fr_*': 'fr',
          'en_*': 'en',
          '*': 'en'
        })
        .useSanitizeValueStrategy(null)
        .determinePreferredLanguage()
        .fallbackLanguage('en');
}]);
app.run(['$rootScope', '$location', '$http', 'notie', '$translate', 'localStorageService', function ($rootScope, $location, $http, notie, $translate, localStorageService) {
    $rootScope.$error = function () { // Send message error
        $translate('error_occured').then(function (error) {
          notie.alert(3, error , 3);
        });
    };
    $rootScope.$goTo = function (path) {
        $location.path(path);
    }
}]);
app.controller('ListCtrl', require('./controllers/list.js'));
app.controller('AddSensorCtrl', require('./controllers/add-sensor.js'));