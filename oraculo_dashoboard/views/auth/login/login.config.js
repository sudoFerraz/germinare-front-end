angular.module('oraculo.login', [
  'ui.router',
])
  
.config([
   '$stateProvider', '$urlRouterProvider',
    function ($stateProvider, $urlRouterProvider) {
        $stateProvider
        .state('login', {
            url: '/login',
            templateUrl: 'views/auth/login/login.html',
            controller: 'loginController'
        })
    }
]);