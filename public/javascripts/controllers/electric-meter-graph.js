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

    $scope.kilo = false;

    $scope.changeUnit = function () {
        $scope.kilo = !$scope.kilo;
        $scope.numbers[0].forEach(function (element, k) {
            if ($scope.kilo) {
                $scope.numbers[0][k] = element / 1000
            } else {
                $scope.numbers[0][k] = element * 1000
            }
        });
        if ($scope.kilo) {
            $scope.count = $scope.count / 1000
        } else {
            $scope.count = $scope.count * 1000
        }
        $translate('consumption').then(function (translation) {
            $scope.seriesNum = [translation + ' ('+ ($scope.kilo ? 'k' : '')+'Wh)'];
        });
    }

    $scope.reload = function () {
        $scope.view = 'daily';
        $http.get('/api/electric-data/'+ $routeParams.ip + '/day/').success(function(data) {
            data = data.reverse();
            $scope.time = [];
            $scope.numbers = [[]];
            $scope.kilo = false;
            $translate('consumption').then(function (translation) {
                $scope.seriesNum = [translation + ' (Wh)'];
            });
            var s = 0
            data.forEach(function(el) {
                $scope.time.push(getFormatedHours(el.createdAt));
                $scope.numbers[0].push(el.number);
                s+=el.number
            });
            $scope.count=s;
        }).error($rootScope.$error);
    };

    $scope.showWeekly = function () {
        $scope.view = 'weekly';
        $http.get('/api/electric-data/'+ $routeParams.ip + '/week/').success(function(data) {
            data = data.reverse();
            $scope.time = [];
            $scope.numbers = [[]];
            $translate('consumption').then(function (translation) {
                $scope.seriesNum = [translation + ' (Wh)'];
            });
            data.forEach(function(el) {
                $scope.time.push(getFormatedDate(el.createdAt));
                $scope.numbers[0].push(el.number);
            });
        }).error($rootScope.$error);
    };
    
    $scope.reload();
}];