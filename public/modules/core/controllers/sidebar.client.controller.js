'use strict';

angular.module('core').controller('SidebarController', ['$scope', 'Authentication',
    function($scope, Authentication) {
        $scope.authentication = Authentication;
        console.log($scope.authentication);
	}
]);
