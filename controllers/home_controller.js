var app = angular.module('MAJApp');
app.directive('onFinishRender', function ($timeout) {
  return {
    restrict: 'A',
    link: function (scope, element, attr) {
      if (scope.$last === true) {
        $timeout(function () {
          scope.$emit('ngRepeatFinished');
        });
      }
    }
  }
});
app.controller("HomeController", function($scope, $http, $interval) {
        $scope.palabra = "";
        $scope.top10 = [];
        $scope.top10Filter = [65,136,1000,454,1254,1160,314,165,405,99]
        var slideIndex = 1;
        $scope.maxSub = 10;
        $scope.MenuSub = [];

        $scope.buscar = function() {
            if ($scope.palabra != "") {
                window.location.href = '#!/comercios/search.' + $scope.palabra;

            }
        }

        $http.get("https://back.rionegrocompralocal.com.co/sub-categorias")
        .then(function(response) {
            $scope.subcategorias = response.data;
        });

        $http.get("https://back.rionegrocompralocal.com.co/inicio")
        .then(function(response) {
            $scope.inicio = response.data;
        });

        $scope.findImage = function(){
          $scope.top10.forEach(x => {

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

        $scope.getTop10 = function(){
          $scope.top10Filter.forEach(x => {
            $http.get(`https://back.rionegrocompralocal.com.co/comercios/${x}`)
            .then(function(response) {
                $scope.top10.push(response.data);
                if($scope.top10.length == 10) $scope.findImage();
            });
          })
        }

        $scope.getTop10();

        $scope.$on('ngRepeatFinished', function(ngRepeatFinishedEvent){
            
          const buttonPrev = document.getElementById('button-prev');
          const buttonNext = document.getElementById('button-next');
          const track = document.getElementById('track');
          const slickList = document.getElementById('slick-list');
          const slick = document.querySelectorAll('.slick');
          const slickWidth = slick[0].offsetWidth;

          buttonPrev.onclick = () => Move(1);
          buttonNext.onclick = () => Move(2);

          $scope.showSlides(slideIndex += 0);

          function Move (value){
              const trackWidth = track.offsetWidth;
              const listWidth = slickList.offsetWidth;

              track.style.left == "" ? leftPosition = track.style.left = 0 : leftPosition = parseFloat(track.style.left.slice(0, -2) *-1);
              
              if(leftPosition < (trackWidth - listWidth) && value == 2){
                  track.style.left = `${-1 * (leftPosition + slickWidth)}px`;
              }else if (leftPosition > 0 && value == 1){
                  track.style.left = `${-1 * (leftPosition - slickWidth)}px`;
              }
          }
        });

        $scope.showSlides = function(n) {
          
          var i;
          var slides = document.getElementsByClassName("mySlides");
          if (n > slides.length) {slideIndex = 1}
          if (n < 1) {slideIndex = slides.length}

          $(".mySlides").css( 'display', 'none');
          slides[slideIndex-1].style.display = "block";
        }

        // Next/previous controls
        $scope.plusSlides = function(n) {
          $scope.showSlides(slideIndex += n);
        }

        $interval(function(){
            $scope.plusSlides(1);
          }, 8000, 1000);
    });