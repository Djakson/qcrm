# @todo Сделать вывод списка заказов
angular.module("qcrm")
.controller "OrderListCtrl", [
    "$scope",
    "$rootScope",
    "$filter",
    "$modal",
    "Order",
    ($scope, $rootScope, $filter, $modal, Order) ->
        $scope.filteredOrders = []
        # pagination
        $scope.numPerPageOpt = [3, 5, 10, 20]
        $scope.numPerPage = $scope.numPerPageOpt[2]
        $scope.currentPage = 1
        $scope.currentPageOrders = []

        $scope.row = ''
        $scope.orders = []

        $scope.select = (page) ->
          start = (page - 1) * $scope.numPerPage
          end = start + $scope.numPerPage
          if 'undefined' != typeof $scope.filteredOrders
            $scope.currentPageOrders = $scope.filteredOrders.slice(start, end)

        # on page change: change numPerPage, filtering string
        $scope.onFilterChange = ->
          $scope.select(1)
          $scope.currentPage = 1
          $scope.row = ''

        $scope.onNumPerPageChange = ->
          $scope.select(1)
          $scope.currentPage = 1

        $scope.onOrderChange = ->
          $scope.select(1)
          $scope.currentPage = 1


        $scope.search = ->
          $scope.filteredOrders = $filter('filter')($scope.orders, $scope.searchKeywords)
          $scope.onFilterChange()


        # orderBy
        $scope.order = (rowName)->
          if $scope.row == rowName
            return
          $scope.row = rowName
          $scope.filteredOrders = $filter('orderBy')($scope.orders, rowName)
          $scope.onOrderChange()

          ###@TODO Редактирование заказа ###
        $scope.edit = (order) ->
          $scope.orderObj = order
          $scope.openDialog()

        $scope.add = () ->
          $scope.orderObj = {}
          $scope.openDialog()

        $scope.openDialog = () ->
          modalInstance = $modal.open
                            templateUrl: 'views/qcrm/shared/order/form.html'
                            controller: ModalOrderCtrl
                            size: 'lg',
                            resolve: {
                              order: () -> $scope.orderObj
                            }
          modalInstance.result.then (order) ->
            load_orders()

        # Modal Controller
        ModalOrderCtrl = ($scope, $modalInstance, order) ->
          $scope.order = order || {};
          $scope.canSubmit = () -> true

          $scope.today = ->
            $scope.dt = order.order_date
          $scope.today()

          $scope.showWeeks = true
          $scope.toggleWeeks = ->
              $scope.showWeeks = ! $scope.showWeeks

          # Disable weekend selection
          $scope.disabled = (date, mode) ->
              return ( mode is 'day' && ( date.getDay() is 0 || date.getDay() is 6 ) )

          $scope.toggleMin = ->
              $scope.minDate = ( $scope.minDate ) ? null : new Date()

          $scope.dateOptions = {
              'year-format': "'yy'"
              'starting-day': 1
          }

          $scope.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'shortDate']
          $scope.format = $scope.formats[0]


          $scope.order = order || {};

          # Disable weekend selection
          $scope.disabled = (date, mode) ->
              return ( mode is 'day' && ( date.getDay() is 0 || date.getDay() is 6 ) )

          $scope.submitForm = () ->
            $modalInstance.close $scope.order

          $scope.cancel = () ->
            $modalInstance.dismiss 'cancel'

        # init
        init = ->
          $scope.search()
          $scope.select($scope.currentPage)

        load_orders = () ->
          Order.find().$promise.then(
            (orders) ->
              $scope.orders = orders
              init()
          )

        load_orders()
    ]
