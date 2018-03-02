module.exports = ['$scope', '$http', '$rootScope', '$translate', 'notie', function ($scope, $http, $rootScope, $translate, notie) {

    $http.get('/api/weather-data').success(function (data) {
        data.forEach(function (el) {
            for (var k in $rootScope.sensors) {
                if ($rootScope.sensors[k].ip == el.ip) {
                    el.name = $rootScope.sensors[k].name;
                }
            }
        });
        $scope.weatherData = data;
    }).error($rootScope.$error);

    $scope.deleteSensor = function (ip) {
        $translate(['delete_it', 'delete_sensor_question', 'sensor_deleted', 'cancel']).then(function (translations) {
            notie.confirm(translations['delete_sensor_question'], translations['delete_it'], translations['cancel'], function () {
                $http.delete('/api/sensors/' + ip).success(function () {
                    $scope.weatherData.forEach(function (el, key) {
                        if (el.ip == ip) {
                            $scope.weatherData.splice(key, 1);
                        }
                    });
                    notie.alert(1, translations['sensor_deleted'], 3);
                }).error($rootScope.$error);
            });
        });
    };
}];