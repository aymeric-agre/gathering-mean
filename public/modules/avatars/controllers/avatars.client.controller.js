'use strict';

// Avatars controller
angular.module('avatars').controller('AvatarsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Avatars',
	function($scope, $stateParams, $location, Authentication, Avatars) {
		$scope.authentication = Authentication;

		// Create new Avatar
		$scope.create = function() {
			// Create new Avatar object
			var avatar = new Avatars ({
				name: this.name
			});

			// Redirect after save
			avatar.$save(function(response) {
				$location.path('avatars/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Avatar
		$scope.remove = function(avatar) {
			if ( avatar ) { 
				avatar.$remove();

				for (var i in $scope.avatars) {
					if ($scope.avatars [i] === avatar) {
						$scope.avatars.splice(i, 1);
					}
				}
			} else {
				$scope.avatar.$remove(function() {
					$location.path('avatars');
				});
			}
		};

		// Update existing Avatar
		$scope.update = function() {
			var avatar = $scope.avatar;

			avatar.$update(function() {
				$location.path('avatars/' + avatar._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Avatars
		$scope.find = function() {
			$scope.avatars = Avatars.query();
		};

		// Find existing Avatar
		$scope.findOne = function() {
			$scope.avatar = Avatars.get({ 
				avatarId: $stateParams.avatarId
			});
		};
	}
]);