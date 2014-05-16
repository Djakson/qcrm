angular.module("qcrm")
.controller "customerListCtrl", ['$scope', 'Customer', '$rootScope', '$filter', ($scope, Customer, $rootScope, $filter) ->
  $scope.customers = Customer.find()

  $scope.filteredCustomers = []

  $scope.row = ''

  $scope.select = (page) ->
    start = (page - 1) * $scope.numPerPage
    end = start + $scope.numPerPage
    $scope.currentPageCustomers = $scope.filteredCustomers.slice(start, end)

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
    $scope.filteredCustomers = $filter('filter')($scope.customers, $scope.searchKeywords)
    $scope.onFilterChange()

  # orderBy
  $scope.order = (rowName)->
    if $scope.row == rowName
      return
    $scope.row = rowName
    $scope.filteredCustomers = $filter('orderBy')($scope.customers, rowName)
    # console.log $scope.filteredStores
    $scope.onOrderChange()

    ###@TODO Редактирование пользователя ###
  $scope.edit = (user) ->
    console.log user

  # pagination
  $scope.numPerPageOpt = [3, 5, 10, 20]
  $scope.numPerPage = $scope.numPerPageOpt[2]
  $scope.currentPage = 1
  $scope.currentPageCustomers = []

  # init
  init = ->
    $scope.search()
    $scope.select($scope.currentPage)

  init()

  $scope.$watchCollection 'customers', (value) ->
    init()

]