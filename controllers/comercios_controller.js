var app = angular.module('MAJApp');

app.controller("ComerciosController", function($scope, $http, $routeParams) {
    $scope.key = $routeParams.key;
    $scope.palabra = null;
    $scope.category = 0;
    $scope.comercios = [];

    
    $scope.currentPage = 1;
    $scope.numPerPage = 50;

    var validate = $scope.key.split('.')

    switch (validate[0]) {
        case 'category':
            $scope.category = parseInt(validate[1],10);
            break;

        case 'search':
            $scope.palabra = validate[1];
            break;
        case 'subcategory':
            $scope.subcategory = validate[1];
    }

    if(validate[2] != undefined)
        $scope.subcategory = validate[3];


    $scope.buscar = function(){
        var query;

        if($scope.subcategory != null){
            query = Qs.stringify({
                _where: { class_commerce_contains: $scope.subcategory },
                _limit: -1
            });

            $http.get(`https://back.rionegrocompralocal.com.co/filtro-sub-categorias?${query}`)
            .then(function(response) {
                $scope.filtrosCategorias = response.data;
                $scope.llamarFiltrados();
            });

            $scope.llamarFiltrados = function(){
                $scope.filtrosCategorias.forEach((x, i, a) => {
                    $http.get(`https://back.rionegrocompralocal.com.co/comercios/${parseInt(x.id_commerece,10)}}`)
                    .then(function(response) {
                        $scope.comercios.push(response.data);
                        if($scope.comercios.length === a.length){
                            $scope.FindGeolocation();
                            $scope.findImage();
                            $scope.SocialMedia();
                            $scope.Phone();
                            $scope.totalItems = $scope.comercios.length;
                        }
                    });
                });
            }

            $scope.subcategory = null;
        }else{

            if($scope.category != 0 && $scope.palabra == null){
                query = Qs.stringify({
                    _where: { id_class_commerce_eq: $scope.category },
                    _limit: -1
                });
            }
            if($scope.palabra != null && $scope.category == 0){
                query = Qs.stringify({
                    _where: {
                        _or: [{name_contains: $scope.palabra}, {description_contains: $scope.palabra}, {top_productos_contains: $scope.palabra},
                            {neighborhood_contains: $scope.palabra}, {comuna_contains: $scope.palabra}]
                    },
                    _limit: -1
                });
            }
            if($scope.category != 0 && $scope.palabra != null){
                query = Qs.stringify({
                    _where: {
                        _or: [
                            [{name_contains: $scope.palabra}, {id_class_commerce_eq: $scope.category}], 
                            [{description_contains: $scope.palabra}, {id_class_commerce_eq: $scope.category}], 
                            [{top_productos_contains: $scope.palabra},{id_class_commerce_eq: $scope.category}],
                            [{neighborhood_contains: $scope.palabra},{id_class_commerce_eq: $scope.category}],
                            [{comuna_contains: $scope.palabra},{id_class_commerce_eq: $scope.category}]
                        ]
                    },
                    _limit: -1
                });
            }
            
            $http.get(`https://back.rionegrocompralocal.com.co/comercios?${query}`)
            .then(function(response) {
                $scope.comercios = response.data;
                $scope.FindGeolocation();
                $scope.findImage();
                $scope.SocialMedia();
                $scope.Phone();
                $scope.totalItems = $scope.comercios.length;
            });

        }
        
        $scope.category = 0;
    }
    $scope.findImage = function(){
        $scope.comercios.forEach(x => {

            const query = Qs.stringify({
                _where: [{id_commerce_eq: x.id}]
            });

            $http.get(`https://back.rionegrocompralocal.com.co/imagenes-comercios?${query}`)
            .then(function(response) {
                if(response.data.length > 0){
                    x.imagen = `https://majii.co${response.data[0].url + response.data[0].img_commerce}`;
                } 
            });
        })
    }
    $scope.FindGeolocation = function(){
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(function(position) {

                $scope.comercios.forEach(x => {

                    let persona = 
                    {
                        lat: position.coords.latitude, 
                        lng: position.coords.longitude
                    };

                    const query = Qs.stringify({
                        _where: [{id_commerce_eq: x.id}]
                    });

                    $http.get(`https://back.rionegrocompralocal.com.co/geolocations?${query}`)
                    .then(function(response) {
                        if(response.data.length > 0){
                            let lat = parseFloat(response.data[0].latitud);
                            let lng = parseFloat(response.data[0].longitud);

                            let comercio = { lat: lng, lng: lat };

                            x.distancia = Math.round($scope.getDistance(persona, comercio));
                        }
                        $scope.comercios.sort(function(a,b){return a.distancia - b.distancia; });
                    });
                })
                
            }); 
        }
    }
    $scope.SocialMedia = function(){
        $scope.comercios.forEach(x => {

            const query = Qs.stringify({
                _where: [{id_commerce_eq: x.id}]
            });

            $http.get(`https://back.rionegrocompralocal.com.co/redes-sociales?${query}`)
            .then(function(response) {
                $scope.redesSociales = response.data;

                $scope.redesSociales.forEach(j => {

                    switch (j.type_social_media) {
                        case "Facebook":
                            x.facebook = j.social_media;
                            break;
                        case "Instagram":
                            x.instagram = j.social_media;
                            break;
                        case "Twitter":
                            x.twitter = j.social_media;
                            break;
                        case "Tiktok":
                            x.tiktok = j.social_media;
                            break;
                    }
                    
                });
            });
        })
    }
    $scope.Phone = function(){
        $scope.comercios.forEach(x => {

            const query = Qs.stringify({
                _where: [{id_commerce_eq: x.id}]
            });

            $http.get(`https://back.rionegrocompralocal.com.co/telefonos?${query}`)
            .then(function(response) {
                x.telefono = response.data[0].phone;
            });
        })
    }
    $scope.selectOnlyThis = function(id) {
        if($scope.category == id){
            document.getElementById("Cat" + id).checked = false;
            $scope.category = 0;
        }else {
            for (var i = 1;i <= 6; i++)
            {
                document.getElementById("Cat" + i).checked = false;
            }
            document.getElementById("Cat" + id).checked = true;
            $scope.category = id;
        }
    }
    var rad = function(x) {
        return x * Math.PI / 180;
    };
    $scope.getDistance = function(p1, p2) {
        var R = 6378137; // Earth’s mean radius in meter
        var dLat = rad(p2.lat - p1.lat);
        var dLong = rad(p2.lng - p1.lng);
        var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(rad(p1.lat)) * Math.cos(rad(p2.lat)) *
            Math.sin(dLong / 2) * Math.sin(dLong / 2);
        var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        var d = R * c;
        return d; // returns the distance in meter
    };
    $scope.RedesSociales = function(url){
        window.open(url, '_blank');
    };

    $scope.paginate = function(value) {
        var begin, end, index;
        begin = ($scope.currentPage - 1) * $scope.numPerPage;
        end = begin + $scope.numPerPage;
        index = $scope.comercios.indexOf(value);
        return (begin <= index && index < end);
      };
});


