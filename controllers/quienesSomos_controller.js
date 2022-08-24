var app = angular.module('MAJApp');

app.controller("QuienesSomosController", function($scope, $http) {

    $scope.imagenes = [];

    $http.get("https://back.rionegrocompralocal.com.co/quienes-somos")
    .then(function(response) {
        $scope.quienesSomos = response.data;
        
        $scope.imagenes = $scope.quienesSomos.GaleriaImagenes.reduce(function(res,current) {
            return res.concat([current, current, current]);
        }, []);

        $scope.imagenes = $scope.imagenes.sort(() => Math.random() - 0.5);
    });

});