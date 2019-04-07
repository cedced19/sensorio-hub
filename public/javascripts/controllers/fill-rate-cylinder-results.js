module.exports = ['$scope', '$http', '$rootScope', '$routeParams', '$translate', 'notie', function ($scope, $http, $rootScope, $routeParams, $translate, notie) {
    
    $scope.sensor = {};
    $scope.calculate = function (el) {
        el.V_empty = Number((Math.PI*el.radius*el.radius*(el.value-el.error)*1e-6).toFixed(3))
        el.V_empty_L = el.V_empty*1000
        el.V_tot = Number((Math.PI*el.radius*el.radius*el.height*1e-6).toFixed(3))
        el.V_tot_L = el.V_tot*1000
        el.V_full = Number((el.V_tot - el.V_empty).toFixed(3))
        el.V_full_L = el.V_full*1000
        el.percentage = Math.round(el.V_empty/el.V_tot*100);
        el.units = Math.round(el.V_full_L / el.divideunit);
        $scope.sensor = el
    }
    $scope.change = function () {
        $scope.sensor.units = Math.round($scope.sensor.V_full_L / $scope.sensor.divideunit);
    }

    $scope.update = function () {
        $http.get('/api/sensors/'+ $routeParams.ip).success(function(data) {
            $scope.calculate(data);
        }).error($rootScope.$error);
    }
    

    if(Array.isArray($rootScope.sensors)){
        var exists = false;
        for(var k in $rootScope.sensors) {
            if (k.ip == $routeParams.ip) {
                exists = true;
                $scope.calculate(k);
                break;
            }
        }
        if (!exists) {
            $scope.update()
        }
    } else {
        $scope.update()
    }
}];