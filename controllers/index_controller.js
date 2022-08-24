var app = angular.module('MAJApp');

app.controller("IndexController", function($scope, $http) {
    $scope.index = {};

    $http.get("https://back.rionegrocompralocal.com.co/pie-de-pagina")
    .then(function (response) {

        $scope.index = response.data;

    });
});