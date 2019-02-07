app.controller("settingsController", function($scope, $rootScope, $mdDialog, $window) {
  
  // NEW ALERT
  $scope.newAlert = function(){
    let params = {
      month_id : $rootScope.selectedMonth.id,
      trigger_cbot : $rootScope.alert.trigger_cbot,
      flag_cbot : $rootScope.alert.flag_cbot,
      direction_cbot : $rootScope.alert.direction_cbot,
      trigger_basis : $rootScope.alert.trigger_basis,
      flag_basis : $rootScope.alert.flag_basis,
      direction_basis : $rootScope.alert.direction_basis,
      trigger_dolar : $rootScope.alert.trigger_dolar,
      flag_dolar : $rootScope.alert.flag_dolar,
      direction_dolar : $rootScope.alert.direction_dolar
    }
    $rootScope.reqWithToken(
      '/users/alerts/add/'+$window.localStorage.getItem("user_id"),
      params, 'POST',
    function(success){
      $scope.activedAlerts.push(success);
      $rootScope.mdAlert('Sucesso!', "O novo alerta cadastrado com sucesso!")
    }, function(error){
      $rootScope.mdErrorAlert('Ocorreu um erro no cadastro do alerta.')
    }, true)
  }

  //ALERTAS ATIVOS
  $scope.activedAlerts = []
  $rootScope.getActivedAlerts = function() {
    $rootScope.reqWithToken(
      '/users/alerts/get_all/'+$window.localStorage.getItem("user_id"),
      null, 'GET',
    function(success){
      $scope.activedAlerts = success;
    }, function(error){
      $scope.activedAlerts = [];
    }, false)
  }
  $scope.deleteActiveAlert = function(id, index) {
    $rootScope.mdConfirmDialog(
    'Deseja deletar esse Alerta?',
    'Todos os dados seram apagados.',
    'Deletar', function(){
      $rootScope.reqWithToken(
        '/users/alerts/cancel/'+id,
        null, 'POST',
      function(success){
        $rootScope.getActivedAlerts();
        $rootScope.mdAlert('Sucesso!', "O alerta foi deletado com sucesso!")
      }, function(error){
        if(error.error == 'You are unauthorized to make this request')
          $rootScope.mdErrorAlert('Você não possui permissão para deletar essa alerta.')
        else 
          $rootScope.mdErrorAlert('Ocorreu um erro ao deletar essa alerta.')
      }, false)
    })
  }
  $scope.openActiveAlertEdit = function(activedAlert){
    $rootScope.selectedActivedAlert = activedAlert
    $mdDialog.show({
      controller: DialogController,
      templateUrl: '/views/portal/settings/modal/editAlert.html',
      parent: angular.element(document.body),
      clickOutsideToClose:true
    })
  }
  function DialogController($scope, $mdDialog) {
    $scope.selectedActivedAlertEdit = Object.assign({}, $rootScope.selectedActivedAlert);

    $scope.cancel = function() {
      $mdDialog.cancel();
    };
    
    $scope.updateActiveAlert = function(){
      $rootScope.reqWithToken(
        '/users/alerts/update/'+$window.localStorage.getItem("user_id"),
        $scope.selectedActivedAlertEdit, 'POST',
      function(success){
        $rootScope.getActivedAlerts();
        $rootScope.mdAlert('Sucesso!', "Alerta atualizado com sucesso!")
      }, function(error){
        $rootScope.mdErrorAlert('Ocorreu um erro na editação do alerta.')
      }, true)
    }
  }

  //ORDERS
  $scope.ordersPendents = []
  $scope.getOrders = function(){
    $rootScope.reqWithToken(
      '/users/orders/get_all_pendent/'+$window.localStorage.getItem("user_id"),
      null, 'GET',
    function(success){
      $scope.ordersPendents = success;
    }, function(error){
      $scope.ordersPendents = [];
    }, false)
  }
  $scope.responseOrder = function(id, type, index){
    if(type === 1) {
      $rootScope.reqWithToken(
        '/users/orders/accept_order/'+id,
        { id, accept: true }, 'POST',
      function(success){
        $scope.ordersPendents.splice(index, 1);
      }, function(error){
        if(error.error == 'You are unauthorized to make this request')
          $rootScope.mdErrorAlert('Você não possui permissão para deletar essa alerta.')
        else 
          $rootScope.mdErrorAlert('Ocorreu um erro inesperado.')
      }, false)
    } else {
      $rootScope.mdConfirmDialog(
      'Deseja recusar essa ordem?',
      'Essa ação não poderá ser revertida.',
      'Confirmar', function(){
        $rootScope.reqWithToken(
          '/users/orders/accept_order/'+id,
          { id, accept: false }, 'POST',
        function(success){
          $scope.ordersPendents.splice(index, 1);
        }, function(error){
          if(error.error == 'You are unauthorized to make this request')
            $rootScope.mdErrorAlert('Você não possui permissão para deletar essa alerta.')
          else 
            $rootScope.mdErrorAlert('Ocorreu um erro inesperado.')
        }, false)
      })
    }
  }

  //FIXA
  $scope.newFixa = function(){
    let d = new Date();
    let params = {
      contract_id: $rootScope.selectedContract.id, //TODO ROTA DEVE RETORNAR O ID
      month_id: $rootScope.selectedMonth.id,
      cbot: $rootScope.fixa.cbot_flag ? $rootScope.fixa.cbot : null,
      cbot_vol: $rootScope.fixa.cbot_flag ? $rootScope.fixa.fixated_cbot : null,
      basis: $rootScope.fixa.basis_flag ? $rootScope.fixa.basis : null,
      basis_vol: $rootScope.fixa.basis_flag ? $rootScope.fixa.fixated_basis : null,
      dolar: $rootScope.fixa.dolar_flag ? $rootScope.fixa.dolar : null,
      dolar_vol: $rootScope.fixa.dolar_flag ? $rootScope.fixa.fixated_dolar : null,
      date: d.getDate() + '-' + (d.getMonth()+1) + '-' + d.getFullYear()
    }
    $rootScope.reqWithToken(
      '/users/orders/add_order/'+$window.localStorage.getItem("user_id"),
      params, 'POST',
    function(success){
      $scope.getOrders();
      $rootScope.mdAlert('Sucesso!', "Nova ordem cadastrada com sucesso!")
    }, function(error){
      $rootScope.mdErrorAlert('Ocorreu um erro no cadastro da ordem.')
    }, true)
  }

  $scope.noficationDatas = [];
  $scope.getNoficationsData = function(){
    $rootScope.reqWithToken(
      '/users/activation/getall/'+$window.localStorage.getItem("user_id"),
      null, 'GET',
    function(success){
      $scope.noficationDatas = success;
    }, function(error){
      $scope.noficationDatas = [];
    }, false)
  }
  $scope.updateNotificationsDatas = function(){
    $rootScope.reqWithToken(
      '/users/activation/change/'+$window.localStorage.getItem("user_id"),
      $scope.noficationDatas, 'POST',
    function(success){
    }, function(error){
    }, false)
  }

  $scope.dataSwings = []
  $scope.getSwingsData = function(){
    $rootScope.reqWithToken(
      '/users/strategy/swing/'+$window.localStorage.getItem("user_id"),
      null, 'GET',
    function(success){
      $scope.dataSwings = success;
    }, function(error){
      $scope.dataSwings = [];
    }, false)
  }


  $scope.initSettings = function(){
    $scope.activedAlerts = [];
    $scope.ordersPendents = [];

    if($rootScope.selectedMonth == null || $rootScope.selectedMonth == ''){
      $rootScope.alert = {}
      $rootScope.fixa = {}
    }

    $rootScope.getActivedAlerts();
    $scope.getOrders();
    $scope.getNoficationsData();
    $scope.getSwingsData();
  }
  $scope.initSettings();
})
