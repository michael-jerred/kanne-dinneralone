/// <reference path="../../typings/angularjs/angular.d.ts" />
/// <reference path="../../typings/angularjs/angular-route.d.ts" />

module App.Home {

    var module = angular.module('app.home', ['ngRoute']);
    module.controller('homeCtrl', Controller);
    module.config([
        '$routeProvider',
        ($routeProvider: ng.route.IRouteProvider) => {
            $routeProvider
                .when('/', {
                    controller: Controller,
                    controllerAs: 'home',
                    templateUrl: 'home/home.html'
                });
        }]);

    class Controller {

        public imageHeight: number;
        private imageNumber: number;

        static $inject = ['$scope', '$window'];
        constructor(private $scope: any,
                    private $window: any) {

            $($window).resize(() => {

                this.calculateImageHeight();
                $scope.$apply();
            });

            this.calculateImageHeight();

            // get random image.
            this.imageNumber = 1;
        }

        public imageName(): string {

          return this.imageHeight > 450
            ? 'img_' + this.imageNumber + '-2x.jpg'
            : 'img_' + this.imageNumber + '.jpg'
        }

        private calculateImageHeight(): void {

            var top = $('body>div>div').position().top;
            var fullheight = this.$window.innerHeight;

            var h = fullheight - top - 2;
            if (h > 300)
                this.imageHeight = h;
        }
    }
}
