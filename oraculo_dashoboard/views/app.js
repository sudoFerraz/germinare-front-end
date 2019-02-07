var app = angular.module('oraculo', [
  'oraculo.login',
  'oraculo.portal',
  'ngMaterial',
  'ngMask',
  'ngAnimate',
  'md.data.table',
  'angular-md5',
  'ui.router'
])

.run(function ($rootScope, $http, $mdDialog, $window, $state, $stateParams) {

  $rootScope.$state = $state;
  $rootScope.$stateParams = $stateParams;
  $rootScope.portalIsOpen = false;

  $rootScope.openSideBar = function(){
      $mdSidenav("left")
      .toggle()
  }

  $rootScope.reqApiURL = "http://3.17.12.210:5000";
  $rootScope.serverURL = "http://3.17.12.210:5000";

  $rootScope.req = function(service, params, type, success, error, loading){
    if(loading) $rootScope.isLoading = true;
    $http({
      url: $rootScope.reqApiURL + service,
      method: type,
      
      data: params
    })
    .success(function(data){
      if(loading) $rootScope.isLoading = false;
      success(data);
    })
    .error(function(err){
      if(loading) $rootScope.isLoading = false;
      error(err);
    });
  }

  $rootScope.reqWithToken = function(service, params, type, success, error, loading){
    if(loading) $rootScope.isLoading = true;
    $http({
      url: $rootScope.reqApiURL + service,
      method: type,
      data: params,
      headers: {
        'user_id': $window.localStorage.getItem("user_id"),
        'authorization': $window.localStorage.getItem("user_token")
      },
    })
    .success(function(data){
      if(loading) $rootScope.isLoading = false;
      success(data);
    })
    .error(function(err){
      if(loading) $rootScope.isLoading = false;
      if(err["token invalido"]) {
        $state.go('login');
        $window.localStorage.clear();
        $rootScope.mdAlert('Sessão expirada', 'Realize seu login novamente')
      } else {
        error(err);
      }
    });
  }

  $rootScope.mdAlert = function(title, text){
    $mdDialog.show(
      $mdDialog.alert()
        .parent(angular.element(document.querySelector('#popupContainer')))
        .clickOutsideToClose(true)
        .title(title)
        .textContent(text)
        .ok('OK')
        .targetEvent()
    );
  }

  $rootScope.mdErrorAlert = function(message){
    $mdDialog.show(
      $mdDialog.alert()
        .parent(angular.element(document.querySelector('#popupContainer')))
        .clickOutsideToClose(true)
        .title('Ops...')
        .textContent(message)
        .ok('OK')
        .targetEvent()
    );
  }

  $rootScope.mdConfirmDialog = function(title, text, button, callback) {
    let confirm = $mdDialog.confirm()
          .title(title)
          .textContent(text)
          .ariaLabel('Deseja realmente fazer isso?')
          .ok(button)
          .cancel('Cancelar');

    $mdDialog.show(confirm).then(function() {
        callback();
      }, function() {
    });
  }

  $rootScope.makeLogout = function(){
    let confirm = $mdDialog.confirm()
          .title('Você deseja realizar o logout?')
          .textContent('Vamos sentir sua falta :(')
          .ok('Confirmar')
          .cancel('Cancelar');
    $mdDialog.show(confirm).then(function() {
        $state.go('login');
        $window.localStorage.clear();
    }, function() {
    });
  }

  $rootScope.userData = null;
  $rootScope.getMe = function(){
    if(
      $window.localStorage.getItem("user_id") != null
      && $window.localStorage.getItem("user_id") != ''
      && $window.localStorage.getItem("user_token") != null
      && $window.localStorage.getItem("user_token") != ''
      ) {
      $rootScope.reqWithToken(
        '/users/' + $window.localStorage.getItem("user_id"),
        null, 'GET', function(suc){
          $rootScope.userData = suc;
        }, function(error) {
          $state.go('login');
          $window.localStorage.clear();
        }, true)
    } else {
     $state.go('login');
     $window.localStorage.clear();
    }
  }
  $rootScope.getMe()

  $rootScope.upWidget = function(priority) {
    if(priority == ($rootScope.widgets.length - 1)) return

    let itemA = $rootScope.widgets.findIndex(x => x.priority == priority);
    let itemB = $rootScope.widgets.findIndex(x => x.priority == (priority + 1));
    $rootScope.widgets[itemA].priority = priority + 1;
    $rootScope.widgets[itemB].priority = priority - 1;
  }
  $rootScope.downWidget = function(priority) {
    if(priority == 0) return

    let itemA = $rootScope.widgets.findIndex(x => x.priority == priority);
    let itemB = $rootScope.widgets.findIndex(x => x.priority == (priority - 1));
    $rootScope.widgets[itemA].priority = priority - 1;
    $rootScope.widgets[itemB].priority = priority + 1;
  }
  $rootScope.setWidgetSize = function(priority, size) {
    let item = $rootScope.widgets.findIndex(x => x.priority == priority);
    if(size == 1) {
      $rootScope.widgets[item].size = 33;
    } else if(size == 2) {
      $rootScope.widgets[item].size = 66;
    } else {
      $rootScope.widgets[item].size = 100;
    }
  }

  $rootScope.frameSelectMonth = function(month) {
    $rootScope.reqWithToken(
      '/month/widgets/getall/'+month,
      null, 'GET',
    function(success){
      if(success && success.length) {
        $rootScope.widgets = [];
        success.map(function(data, index) {
          data.size = 33;
          data.priority = index
          $rootScope.widgets.push(data)
        })
      }
    }, function(error){
      $rootScope.widgets = [];
    }, false)
  }

  $rootScope.initAlerts = function(){
    $rootScope.alert = {
      month: $rootScope.selectedMonth,
      month_id : $rootScope.selectedMonth.id,
      trigger_cbot : $rootScope.selectedMonth.cbot_quote,
      flag_cbot : false,
      direction_cbot : 0, 
      trigger_basis : $rootScope.selectedMonth.basis_quote,
      flag_basis : false,
      direction_basis : 0,
      trigger_dolar : $rootScope.selectedMonth.dolar_quote,
      flag_dolar : false,
      direction_dolar : 0
    }
  }

  $rootScope.initFixa = function(){
    $rootScope.fixa = {
      month: $rootScope.selectedMonth.id,
      month_base : $rootScope.selectedMonth.id,
      cbot: $rootScope.selectedMonth.cbot_quote,
      cbot_vol: $rootScope.selectedMonth.cbot_volume,
      fixated_cbot: $rootScope.selectedMonth.fixated_cbot,
      min_cbot: $rootScope.selectedMonth.fixated_cbot,
      cbot_flag: false,
      basis: $rootScope.selectedMonth.basis_quote,
      fixated_basis: $rootScope.selectedMonth.fixated_basis,
      basis_vol: $rootScope.selectedMonth.basis_volume, 
      min_basis: $rootScope.selectedMonth.fixated_basis,
      basis_flag: false,
      dolar: $rootScope.selectedMonth.dolar_quote,
      dolar_vol: $rootScope.selectedMonth.dolar_volume,
      min_dolar: $rootScope.selectedMonth.fixated_dolar + 0,
      fixated_dolar: $rootScope.selectedMonth.fixated_dolar,
      dolar_flag: false,
    }
  }

  $rootScope.selectedMonth = null;
  $rootScope.notifications = [];
  $rootScope.selectedContractMonths = [];
  $rootScope.widgets = [];
  $rootScope.selectedContract = null

  $rootScope.initFastQuery = function(){
    $rootScope.fast_query = {
      month: $rootScope.selectedMonth.id,
      cbot: $rootScope.selectedMonth.cbot_quote,
      basis: $rootScope.selectedMonth.basis_quote,
      dolar: $rootScope.selectedMonth.dolar_quote,
      price: $rootScope.selectedMonth.frame_quote
    }
  }
  $rootScope.selectMonth = function(month){
    if(typeof(month) === 'string')
      $rootScope.selectMonth = JSON.parse(month);
    else
      $rootScope.selectedMonth = month;

    //SETTINGS
    $rootScope.initAlerts();
    $rootScope.initFixa();

    //HOME
    $rootScope.frameSelectMonth($rootScope.selectedMonth.id);
    $rootScope.initFastQuery();
  }

  $rootScope.unreadNotification = false;
  $rootScope.getNofications = function() {
    if(!$window.localStorage.getItem("user_id")) return
    $rootScope.reqWithToken(
      '/users/notifications/'+ $window.localStorage.getItem("user_id"),
      null, 'GET',
    function(success){
      $rootScope.notifications = success;
      for(var i of success){
        if(i.status === 'unseen') $rootScope.unreadNotification = true;
      }
    }, function(error){
      $rootScope.notifications = [];
    }, false)
  }
  $rootScope.getNofications();

  function NotificationController($scope, $mdDialog) {
    $scope.selectedNotification = $rootScope.selectedNotification;
    $scope.closeNotificationModal = function() {
      $mdDialog.cancel();
    };
  }
  $rootScope.seenNotification = function(id, index) {
    $rootScope.selectedNotification = $rootScope.notifications[index];
    $mdDialog.show({
      controller: NotificationController,
      templateUrl: '/views/portal/components/notification.html',
      parent: angular.element(document.body),
      clickOutsideToClose:true
    })

    if($rootScope.notifications[index].status !== 'unseen') return
    $rootScope.reqWithToken(
      '/users/notifications/seen/'+id,
      null, 'GET',
    function(success){
      $rootScope.notifications[index].status = 'seen';
      $rootScope.unreadNotification = false;
      for(var i of $rootScope.notifications){
        if(i.status === 'unseen') $rootScope.unreadNotification = true;
      }
    }, function(error){
      $rootScope.notifications[index].status = 'seen';
    }, false)
  }

})

.config(function($stateProvider, $urlRouterProvider){
    $urlRouterProvider.otherwise('/login');
})

.config(function($locationProvider) {
   $locationProvider.html5Mode(true).hashPrefix('!')
});

angular.module('oraculo').directive('ngEnter', function () {
  return function (scope, element, attrs) {
    element.bind("keydown keypress", function (event) {
      if (event.which === 13) {
        scope.$apply(function () {
          scope.$eval(attrs.ngEnter, { 'event': event });
        });
        event.preventDefault();
      }
    });
  };
});
