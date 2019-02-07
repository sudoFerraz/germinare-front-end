app.controller('sidebarController', function($scope, $rootScope, $state, $window){

	$scope.logout = function() {
		$rootScope.makeLogout()
	}

	$rootScope.selectedView = $state.$current.name
	$scope.goTo = function(route) {
		$state.go(route)
		$rootScope.selectedView = route;
	}

	$rootScope.optionsContract = {
		frame: ''
	}
	$scope.contracts = []

	$scope.getAllContracts = function(){
		$rootScope.reqWithToken(
			'/users/contracts/getall/' + $window.localStorage.getItem("user_id"),
			null, 'GET', function(success){
				$scope.contracts = success;
				//$rootScope.optionsContract.frame = success[0].id;
				//$scope.getSingleContract(success[0].id);
		}, function(error) {
			$rootScope.mdAlert('Ops', 'Ocorreu um erro ao buscar contratos, verifique sua conexão com a internet e tente novamente!');
		}, true)
	}
	$scope.getAllContracts();

	$scope.getSingleContract = function(id){
		if(id == null || id == '')
			return $rootScope.mdAlert('Ops', 'Informe um contrato!');
		$rootScope.reqWithToken(
			'/users/contracts/' + id,
			null, 'GET', function(success){
				$rootScope.selectedContract = success;
				$scope.getContractMonths(id)
				localStorage.setItem("all_contracts", success)
		}, function(error) {
			$rootScope.mdAlert('Ops', 'Ocorreu um erro ao buscar esse contrato, verifique sua conexão com a internet e tente novamente!');
		}, true)
	}

	$scope.getContractMonths = function(id){
		$rootScope.reqWithToken(
			'/users/contracts/getallmonths/' + id,
			null, 'GET', function(success){
				$rootScope.selectedContractMonths = success;
				$rootScope.selectMonth(success[0]);
				$rootScope.initChart();
		}, function(error) {
			$rootScope.mdAlert('Ops', 'Ocorreu um erro ao buscar esse contrato, verifique sua conexão com a internet e tente novamente!');
		}, false)
	}

})
