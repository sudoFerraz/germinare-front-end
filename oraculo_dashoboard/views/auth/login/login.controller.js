app.controller("loginController", function($scope, $state, $rootScope, $window, md5){

	$scope.userLogin = {
		email: '',
		password: ''
	}

	if($window.localStorage.getItem("user_id") != null
		&& $window.localStorage.getItem("user_id") != '') {
		$rootScope.reqWithToken('/users/' + $window.localStorage.getItem("user_id"), null, 'GET', function(successData){
			$rootScope.userData = successData;
			$state.go('portal.home');
		}, function(e){
			$window.localStorage.clear();
		}, true);
	}

	$scope.makeLogin = function(){

		if($scope.userLogin.email == '' || $scope.userLogin.email == null
		|| $scope.userLogin.password == '' || $scope.userLogin.password == null){
			$rootScope.mdAlert('Login', 'Preencha todos os dados corretamente.');
			return;
		}

		$scope.params = {
			email: $scope.userLogin.email.toLowerCase(),
			password: md5.createHash($scope.userLogin.password.toLowerCase())
		}
		
		$rootScope.req('/login', $scope.params, 'POST', function(successData){
			$window.localStorage.setItem('user_id', successData.id);
			$window.localStorage.setItem('user_token', successData.token);
			$rootScope.userData = successData;
			$state.go('portal.home');
		}, function(errorData){
			$rootScope.mdErrorAlert('Usuário e/ou senha incorretos');
		});
	}
    
})
