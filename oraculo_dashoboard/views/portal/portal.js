angular.module('oraculo.portal', [
  'ui.router',
])

.config(
	[   '$stateProvider', '$urlRouterProvider',
    	function ($stateProvider) {

			$stateProvider
				.state('portal', {
					url: '/portal',
					templateUrl: 'views/portal/portal.html',
					controller: function($rootScope){
						$rootScope.getMe();
					}
				})

				.state('portal.home', {
					url: '/home',
					views:{
						'':{
							templateUrl: 'views/portal/home/home.html',
							controller: 'homeController'
						},
						'sidebar':{
							templateUrl: 'views/portal/components/sidebar.html',
							controller: 'sidebarController'
						}
					}
				})

				.state('portal.settings', {
					url: '/settings',
					views:{
						'':{
							templateUrl: 'views/portal/settings/settings.html',
							controller: 'settingsController'
						},
						'sidebar':{
							templateUrl: 'views/portal/components/sidebar.html',
							controller: 'sidebarController'
						}
					}
				})
				
		}
	]
);