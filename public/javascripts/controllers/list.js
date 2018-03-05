module.exports = ['$scope', '$http', '$rootScope', '$translate', 'notie', function ($scope, $http, $rootScope, $translate, notie) {

    $http.get('/api/weather-data').success(function (data) {
        data.forEach(function (el) {
            for (var k in $rootScope.sensors) {
                if ($rootScope.sensors[k].ip == el.ip) {
                    $rootScope.sensors[k].attributed = true;
                    el.attributed = true;
                    el.name = $rootScope.sensors[k].name;
                }
            }
        });
        $rootScope.sensors.forEach(function (el) {
            if (el.type == 'weather-station' && !el.attributed) {
                data.push(el);
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

    $scope.forceTask = function (task) {
        $http.get('/api/force-tasks/' + task).success(function () {
            $translate('task_success').then(function (value) {
                notie.alert(1, value, 3);
            });
        }).error($rootScope.$error);
    }
}];