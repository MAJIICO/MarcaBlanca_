var app = angular.module('MAJApp', ['ngRoute','ui.bootstrap'])
    .config(function($routeProvider, $locationProvider) {
        $routeProvider
            .when("/", {
                controller: "HomeController",
                templateUrl: "views/Home.html"
            })
            .when("/quienesSomos", {
                controller: "QuienesSomosController",
                templateUrl: "views/QuienesSomos.html"
            })
            .when("/comercio/:id", {
                controller: "ComercioController",
                templateUrl: "views/Comercio.html"
            })
            .when("/comercios/:key", {
                controller: "ComerciosController",
                templateUrl: "views/RdoBusqueda.html"
            })
            .when("/terminosycondiciones", {
                controller: "IndexController",
                templateUrl: "views/TerminosyCondiciones.html"
            })
            .otherwise({
                redirectTo: "/"
            });

    });