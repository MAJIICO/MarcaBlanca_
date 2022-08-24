var app = angular.module('MAJApp');

app.controller("PromocionController", function($scope, $http) {

    $http.get("https://back.rionegrocompralocal.com.co/promocions")
        .then(function(response) {
            $scope.promociones = response.data;
        });
});