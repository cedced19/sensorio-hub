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

app.controller('ListCtrl', require('./controllers/list.js'));