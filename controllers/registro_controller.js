var app = angular.module('MAJApp');

app.controller("RegistroController", function($scope, $http) {
    $scope.registro = {};
    $scope.enviado = false;

   $scope.enviar = function(){

       $http.post("https://back.rionegrocompralocal.com.co/registros", $scope.registro)
       .then(function (response) {
            if(response.status = 200){
                $scope.enviado = true;
                $scope.registro = {};
                $scope.registroForm.$setUntouched();
            }   
        }, 
        function (response) {
            console.log(response);
        });
   }
});