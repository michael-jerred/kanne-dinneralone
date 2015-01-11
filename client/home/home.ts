/// <reference path="../../typings/angularjs/angular.d.ts" />
/// <reference path="../../typings/angularjs/angular-route.d.ts" />

module App.Home {

    var module = angular.module('app.home', ['ngMaterial']);
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

        public test: string;

        constructor() {
            this.test = 'working!';
        }
    }
}
