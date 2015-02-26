'use strict';

angular.module('users').controller('AuthenticationController', ['$scope', '$http', 'Authentication', '$state',
	function($scope, $http, Authentication, $state) {
		$scope.authentication = Authentication;

		// If user is signed in then redirect back home
		if ($scope.authentication.user) $state.go('home');

		$scope.signup = function() {
			$http.post('/auth/signup', $scope.credentials).success(function(response) {
				// If successful we assign the response to the global user model
				$scope.authentication.user = response;

				// And redirect to the index page
                location.reload(true);  //Rafraichit la page
				$state.go('home');
			}).error(function(response) {
				$scope.error = response.message;
			});
		};

		$scope.signin = function() {
			$http.post('/auth/signin', $scope.credentials).success(function(response) {
				// If successful we assign the response to the global user model
				$scope.authentication.user = response;

				// And redirect to the index page
                location.reload(true);
                $state.go('home');
			}).error(function(response) {
				$scope.error = response.message;
			});
		};
	}
]);
