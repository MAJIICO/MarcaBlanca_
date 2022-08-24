var app = angular.module('MAJApp');

app.controller("CapacitacionController", function($scope, $http) {

    $http.get("https://back.rionegrocompralocal.com.co/capacitacion-formacions")
        .then(function(response) {
            $scope.capacitaciones = response.data;
        });
});