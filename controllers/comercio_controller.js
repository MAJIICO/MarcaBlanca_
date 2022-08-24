var app = angular.module('MAJApp');

app.controller("ComercioController", function($scope, $http, $routeParams) {
    $scope.id = $routeParams.id;
    $scope.telefonosArray = [];
    $scope.facebook = {};
    $scope.instagram = {};
    $scope.twitter = {};
    $scope.tiktok = {};
    $scope.comentario = {};
    $scope.puntajeVacio = false;

    //paginacion comentarios
    $scope.filteredpagination = []
    $scope.curPage = 1;
    $scope.itemsPerPage = 3;
    $scope.maxSize = 5;

    var map, comercio, persona, comercioMarker;
    var directionsService = new google.maps.DirectionsService();
    var directionsDisplay = new google.maps.DirectionsRenderer();

    window.scrollTo(0, 0);

    $http.get(`https://back.rionegrocompralocal.com.co/comercios/${$scope.id}`)
    .then(function(response) {
        $scope.comercio = response.data;
    });
    const query = Qs.stringify({
            _where: [{id_commerce_eq: $scope.id}]
        });

    $http.get(`https://back.rionegrocompralocal.com.co/telefonos?${query}`)
    .then(function(response) {
        $scope.comercioTelefonos = response.data;

        $scope.comercioTelefonos.forEach(element => {
            $scope.telefonosArray.push(element.phone);
        });
    });
    $http.get(`https://back.rionegrocompralocal.com.co/imagenes-comercios?${query}`)
    .then(function(response) {
        if(response.data.length <= 5){
            $scope.comercioImagenes = response.data.reduce(function(res,current) {
                return res.concat([current, current, current]);
            }, []);

            $scope.comercioImagenes = $scope.comercioImagenes.sort(() => Math.random() - 0.5);
        }else {
            $scope.comercioImagenes = response.data;
        }  
    });
    $http.get(`https://back.rionegrocompralocal.com.co/geolocations?${query}`)
    .then(function(response) {
        $scope.geolocation = response.data;

        if($scope.geolocation[0].length != 0){

            let lat = parseFloat($scope.geolocation[0].latitud);
            let lng = parseFloat($scope.geolocation[0].longitud);

            map = new google.maps.Map(document.getElementById('map'), {
                center: {lat: lng, lng: lat},
                zoom: 15
            });

            var comercio = new google.maps.LatLng(lng, lat);

            comercioMarker = new google.maps.Marker({
                position: {lat: lng, lng: lat},
                title: "Comercio"
            });
            comercioMarker.setMap(map);
        }else{
            map = new google.maps.Map(document.getElementById('map'), {
                center: {lat: 6.15515, lng: -75.37371},
                zoom: 15
            });
        }

        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(function(position) {
             persona = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
                directionsDisplay.setMap(map);

                var request = {
                    origin: persona,
                    destination: comercio,
                    travelMode: google.maps.TravelMode.DRIVING
                };

                directionsService.route(request, function(response, status) {
                    if (status == google.maps.DirectionsStatus.OK) {
                      directionsDisplay.setDirections(response);
                      directionsDisplay.setMap(map);
                    }
                });
            });
        } 
    });
    $http.get(`https://back.rionegrocompralocal.com.co/redes-sociales?${query}`)
    .then(function(response) {
        $scope.redesSociales = response.data;

        $scope.redesSociales.forEach(x => {

            switch (x.type_social_media) {
                case "Facebook":
                    $scope.facebook = x;
                    break;
                case "Instagram":
                    $scope.instagram = x;
                    break;
                case "Twitter":
                    $scope.twitter = x;
                    break;
                case "Tiktok":
                    $scope.tiktok = x;
                    break;
            }
            
        });

    });
    $scope.getComentarios = function(){
        $http.get(`https://back.rionegrocompralocal.com.co/comentarios?${query}`)
        .then(function(response) {
            $scope.comentarios = response.data;

            let total = $scope.comentarios.reduce((a, b) => a + b.puntaje, 0);
            let promedio = total / $scope.comentarios.length;
            $scope.puntajePromedio = Math.round(promedio);
        });
    }
    $scope.getComentarios();

    $scope.calificar = function(puntaje){
        $scope.comentario.puntaje = puntaje;
        $scope.puntajeVacio = false;
    };

    $scope.RedesSociales = function(url){
        window.open(url, '_blank');
    };

    $scope.comentar = function(){
        if($scope.comentario.puntaje == undefined){
            $scope.puntajeVacio = true;
        }else{
            $scope.comentario.id_commerce = $scope.id;
            $http.post("https://back.rionegrocompralocal.com.co/comentarios", $scope.comentario)
            .then(function (response) {
                    if(response.status = 200){
                        $scope.enviado = true;
                        $scope.comentario = {};
                        $scope.frm.$setUntouched();
                        $scope.getComentarios(); 0

                        setTimeout(function(){
                            $scope.enviado = false;
                        }, 3000);
                    }
                }, 
                function (response) {
                    console.log(response);
                });            
        }
    };
}); 