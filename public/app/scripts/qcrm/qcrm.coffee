qcrm = angular.module("qcrm", [])

qcrm.factory "bootbox", [()->
    bootbox
]


window.ucfirst = (input) ->
    input.charAt(0).toUpperCase() + input.slice 1
