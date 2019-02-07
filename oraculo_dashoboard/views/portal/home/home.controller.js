app.controller("homeController", function($scope, $rootScope, $mdDialog, $sce, $mdMenu) {

  $scope.fixedPeriodHidden = false;
  //$rootScope.selectedContractMonths = [{"cbot_flag": 1, "dolar_fixated_percentage": 0.8125, "basis_quote": -8.0, "frame_quote": 1232.23, "end_date": "2019-03-28", "dolar_flag": 0, "base_contract": 1, "fixated_cbot": 700.0, "basis_flag": 0, "cbot_fixated_percentage": 0.4375, "basis_fixated_percentage": 0.1875, "fixated_dolar": 1300.0, "days_to_end": 63, "fixated_basis": 300.0, "dolar_quote": 3.75, "cbot_quote": 314.700012, "cbot_volume": 1600.0, "dolar_volume": 1600.0, "basis_volume": 1600.0, "id": 3, "reference_month": "March"}, {"cbot_flag": 1, "dolar_fixated_percentage": 0.1875, "basis_quote": -8.0, "frame_quote": 1111.23, "end_date": "2019-05-28", "dolar_flag": 0, "base_contract": 1, "fixated_cbot": 300.0, "basis_flag": 0, "cbot_fixated_percentage": 0.1875, "basis_fixated_percentage": 0.1875, "fixated_dolar": 300.0, "days_to_end": 124, "fixated_basis": 300.0, "dolar_quote": 3.75, "cbot_quote": 314.700012, "cbot_volume": 1600.0, "dolar_volume": 1600.0, "basis_volume": 1600.0, "id": 5, "reference_month": "May"}, {"cbot_flag": 1, "dolar_fixated_percentage": 0.25, "basis_quote": -8.0, "frame_quote": 1150.42, "end_date": "2019-07-28", "dolar_flag": 0, "base_contract": 1, "fixated_cbot": 400.0, "basis_flag": 0, "cbot_fixated_percentage": 0.25, "basis_fixated_percentage": 0.25, "fixated_dolar": 400.0, "days_to_end": 185, "fixated_basis": 400.0, "dolar_quote": 3.75, "cbot_quote": 321.799988, "cbot_volume": 1600.0, "dolar_volume": 1600.0, "basis_volume": 1600.0, "id": 7, "reference_month": "July"}, {"cbot_flag": 1, "dolar_fixated_percentage": 0.1875, "basis_quote": -8.0, "frame_quote": 1395.45, "end_date": "2019-08-28", "dolar_flag": 0, "base_contract": 1, "fixated_cbot": 300.0, "basis_flag": 0, "cbot_fixated_percentage": 0.1875, "basis_fixated_percentage": 0.1875, "fixated_dolar": 300.0, "days_to_end": 216, "fixated_basis": 300.0, "dolar_quote": 3.75, "cbot_quote": 323.5, "cbot_volume": 1600.0, "dolar_volume": 1600.0, "basis_volume": 1600.0, "id": 8, "reference_month": "August"}, {"cbot_flag": 1, "dolar_fixated_percentage": 0.208125, "basis_quote": -8.0, "frame_quote": 1350.23, "end_date": "2019-09-28", "dolar_flag": 0, "base_contract": 1, "fixated_cbot": 333.0, "basis_flag": 0, "cbot_fixated_percentage": 0.208125, "basis_fixated_percentage": 0.208125, "fixated_dolar": 333.0, "days_to_end": 247, "fixated_basis": 333.0, "dolar_quote": 3.75, "cbot_quote": 323.5, "cbot_volume": 1600.0, "dolar_volume": 1600.0, "basis_volume": 1600.0, "id": 9, "reference_month": "September"}, {"cbot_flag": 1, "dolar_fixated_percentage": 0.13875, "basis_quote": -8.0, "frame_quote": 1320.23, "end_date": "2019-10-28", "dolar_flag": 0, "base_contract": 1, "fixated_cbot": 222.0, "basis_flag": 0, "cbot_fixated_percentage": 0.13875, "basis_fixated_percentage": 0.13875, "fixated_dolar": 222.0, "days_to_end": 277, "fixated_basis": 222.0, "dolar_quote": 3.75, "cbot_quote": 325.5, "cbot_volume": 1600.0, "dolar_volume": 1600.0, "basis_volume": 1600.0, "id": 11, "reference_month": "October"}, {"cbot_flag": 1, "dolar_fixated_percentage": 0.13875, "basis_quote": -8.0, "frame_quote": 1310.65, "end_date": "2019-12-28", "dolar_flag": 0, "base_contract": 1, "fixated_cbot": 222.0, "basis_flag": 0, "cbot_fixated_percentage": 0.13875, "basis_fixated_percentage": 0.13875, "fixated_dolar": 222.0, "days_to_end": 338, "fixated_basis": 222.0, "dolar_quote": 3.75, "cbot_quote": 326.899994, "cbot_volume": 1600.0, "dolar_volume": 1600.0, "basis_volume": 1600.0, "id": 12, "reference_month": "December"}] 

  $scope.calculateFrame = function(){
    let params = {
      cbot: $rootScope.fast_query.cbot || null,
      basis: $rootScope.fast_query.basis || null,
      dolar: $rootScope.fast_query.dolar  || null
    }
    $rootScope.reqWithToken(
      '/users/contracts/month/getframe/'+$rootScope.fast_query.month,
      params, 'POST',
    function(success){
      $rootScope.fast_query.price = success.frame;
    }, function(error){
    }, false)
  }

  $scope.getFixedColor = function(value){
    if(value > 59) return 'green'
    else if(value > 29) return 'orange'
    else return 'red'
  }
  $scope.trustAsHtml = function(string) {
    const iframe = "<iframe scrolling='no' allowtransparency='true' frameborder='0' src='"+string+"' style='box-sizing: border-box; height: 350px; width: 100%; background: transparent'></iframe>"
    return $sce.trustAsHtml(iframe);
  };

  $rootScope.getMinValue = function(data) {
    return data.reduce((min, p) => p.frame_quote < min ? p.frame_quote : min, data[0].frame_quote);
  }
  $rootScope.getMaxValue = function(data) {
    return data.reduce((max, p) => p.frame_quote > max ? p.frame_quote : max, data[0].frame_quote);
  }

  $rootScope.initChart = function(){
    if(!$rootScope.selectedContractMonths || $rootScope.selectedContractMonths.length == 0) return;
    try {
      $rootScope.frameValues = [];
      $rootScope.frameSubValues = [];
      $rootScope.subDatas = [];

      for(data of $rootScope.selectedContractMonths) {
        $rootScope.frameValues.push(data.frame_quote)
  
        $rootScope.frameSubValues.push([
          data.reference_month,
          data.frame_quote,
          'CBOT: ' + data.cbot_quote
        ])
  
        $rootScope.subDatas.push({
          cbot_flag: data.cbot_flag,
          cbot_quote: data.cbot_quote,
          basis_flag: data.basis_flag,
          basis_quote: data.basis_quote,
          dolar_flag: data.dolar_flag,
          dolar_quote: data.dolar_quote
        })
      }

      let minValue = $rootScope.getMinValue($rootScope.selectedContractMonths);
      let maxValue = $rootScope.getMaxValue($rootScope.selectedContractMonths);
  
      const ctx = document.getElementById("frameChart");
      const frameChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: $rootScope.frameSubValues,
            defaultColor: 'white',
            fontColor: '#fff',
            datasets: [{
                label: 'label',
                data: $rootScope.frameValues,
                subdatas: $rootScope.subDatas,
                backgroundColor: ['rgba(87, 134, 83, 0.1)'],
                borderColor: ['#578653'],
                borderWidth: 2,
                lineTension: 0,
                pointBorderWidth: 6,
                fontColor: '#fff'
            }]
        },
        options: {
          legend: {
            display: false
          },
          tooltips: {
            enabled: true,
            backgroundColor: '#578653'
          },
          scales: {
              yAxes: [{
                  ticks: {
                    beginAtZero:false,
                    suggestedMin: minValue - (maxValue*0.2),
                    suggestedMax: maxValue + (maxValue*0.2),
                    padding: 20
                  }
              }],
              xAxes: [{
                ticks: {
                  beginAtZero:false,
                  padding: 5
                }
            }]
          }
        }
      });
    } catch (e) {
      console.log(e)
    }
  }

  $scope.initHome = function() {
    $rootScope.frameValues = []
    $rootScope.frameSubValues = []
    $rootScope.subDatas = []
    
    if($rootScope.selectedMonth == null || $rootScope.selectedMonth == ''){
      $rootScope.fast_query = {}
      $rootScope.widgets = []
    } 
    
    // INIT CHART
    setTimeout(function(){
      $rootScope.initChart()
    }, 1500)
  }
  $scope.initHome()

  $scope.openModalWidgets = function(){
    $mdDialog.show({
      controller: DialogController,
      templateUrl: '/views/portal/home/modal/widgets.html',
      parent: angular.element(document.body),
      clickOutsideToClose:true
    })
  }
  function DialogController($scope, $mdDialog) {
    $scope.widgets = $rootScope.widgets;
    $scope.cancel = function() {
      $mdDialog.cancel();
    };
  }

})
