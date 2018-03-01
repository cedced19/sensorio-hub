module.exports = ['$scope', '$http', '$rootScope', '$location', '$routeParams', '$translate', function ($scope, $http, $rootScope, $location, $routeParams, $translate) {
    var getFormatedHours = function (date) {
        var d = new Date(date),
        h = d.getHours(),
        m = d.getMinutes();
        return (h < 10 ? '0' : '') + h + ':' + (m < 10 ? '0' : '') + m;
    };
    var getFormatedDate = function (date) {
        var d = new Date(date),
        j = d.getDate(),
        m = d.getMonth() + 1;
        return (j < 10 ? '0' : '') + j + '/' + (m < 10 ? '0' : '') + m;
    };
    $http.get('/api/weather-data/'+ $routeParams.ip + '/day/').success(function(data) {
        data = data.reverse();
        $scope.time = [];
        $scope.temperatures = [[], [], []];
        $scope.humidity = [[]];
        $translate(['temperature', 'heat_index', 'humidity']).then(function (translations) {
            $scope.seriesTemp = [translations.temperature + ' n°1', translations.heat_index,  translations.temperature + ' n°2'];
            $scope.seriesHum = [translations.humidity];
        });
        data.forEach(function(el) {
            $scope.time.push(getFormatedHours(el.createdAt));
            $scope.temperatures[0].push(el.temperature);
            $scope.temperatures[1].push(el.heat_index);
            $scope.temperatures[2].push(el.temperature2);
            $scope.humidity[0].push(el.humidity);
        });
    }).error($rootScope.$error);

    $scope.showWeekly = function () {
        $scope.view = 'weekly';
        $http.get('/api/weather-data/'+ $routeParams.ip + '/week/').success(function(data) {
            data = data.reverse();
            $scope.time = [];
            $scope.temperatures = [[], [], []];
            $scope.humidity = [[]];
            $translate(['temperature', 'heat_index', 'humidity']).then(function (translations) {
                $scope.seriesTemp = [translations.temperature + ' n°1', translations.heat_index,  translations.temperature + ' n°2'];
                $scope.seriesHum = [translations.humidity];
            });
            data.forEach(function(el) {
                $scope.time.push(getFormatedHours(el.createdAt) + ' ' +  getFormatedDate(el.createdAt));
                $scope.temperatures[0].push(el.temperature);
                $scope.temperatures[1].push(el.heat_index);
                $scope.temperatures[2].push(el.temperature2);
                $scope.humidity[0].push(el.humidity);
            });
        }).error($rootScope.$error);
    }
}];