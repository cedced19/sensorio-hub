require('angular'); /*global angular*/
require('chart.js');
require('angular-chart.js');
require('angular-route');
require('ng-notie');
require('angular-translate');
require('angular-translate-loader-static-files');
require('angular-translate-loader-url');

var app = angular.module('Sensorio', ['ngNotie', 'ngRoute', 'pascalprecht.translate', 'chart.js']);
app.config(['$routeProvider', '$translateProvider', function($routeProvider, $translateProvider) {
        // Route configuration
        $routeProvider
        .when('/', {
            templateUrl: '/views/list.html',
            controller: 'ListCtrl'
        })
        .when('/add-sensor', {
            templateUrl: '/views/form-sensor.html',
            controller: 'AddSensorCtrl'
        })
        .when('/update-sensor/:ip', {
            templateUrl: '/views/form-sensor.html',
            controller: 'UpdateSensorCtrl'
        })
        .when('/weather-station/graph/:ip', {
            templateUrl: '/views/weather-station-graph.html',
            controller: 'WeatherStationGraphCtrl'
        })
        .when('/electric-meter/graph/:ip', {
            templateUrl: '/views/electric-meter-graph.html',
            controller: 'ElectricMeterGraphCtrl'
        })
        .when('/fill-rate-cylinder/results/:ip', {
            templateUrl: '/views/fill-rate-cylinder-results.html',
            controller: 'FillRateCylinderResultCtrl'
        })
        .otherwise({
            redirectTo: '/'
        });

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
app.run(['$rootScope', '$location', '$http', 'notie', '$translate', function ($rootScope, $location, $http, notie, $translate) {
    $rootScope.$error = function () { // Send message error
        $translate('error_occured').then(function (error) {
          notie.alert(3, error , 3);
        });
    };
    $rootScope.$goTo = function (path) {
        $location.path(path);
    }
    $http.get('/api/sensors').success(function (data) {
        $rootScope.sensors = data;
    }).error($rootScope.$error);
}]);
app.controller('ListCtrl', require('./controllers/list.js'));
app.controller('AddSensorCtrl', require('./controllers/add-sensor.js'));
app.controller('UpdateSensorCtrl', require('./controllers/update-sensor.js'));
app.controller('WeatherStationGraphCtrl', require('./controllers/weather-station-graph.js'));
app.controller('ElectricMeterGraphCtrl', require('./controllers/electric-meter-graph.js'));
app.controller('FillRateCylinderResultCtrl', require('./controllers/fill-rate-cylinder-results.js'));