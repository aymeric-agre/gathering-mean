'use strict';

// Missions controller
angular.module('missions').controller('MissionsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Missions',
	function($scope, $stateParams, $location, Authentication, Missions) {
		$scope.authentication = Authentication;

		// Create new Mission
		$scope.create = function() {
			// Create new Mission object
			var mission = new Missions ({
				name: this.name
			});

			// Redirect after save
			mission.$save(function(response) {
				$location.path('missions/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Mission
		$scope.remove = function(mission) {
			if ( mission ) { 
				mission.$remove();

				for (var i in $scope.missions) {
					if ($scope.missions [i] === mission) {
						$scope.missions.splice(i, 1);
					}
				}
			} else {
				$scope.mission.$remove(function() {
					$location.path('missions');
				});
			}
		};

		// Update existing Mission
		$scope.update = function() {
			var mission = $scope.mission;

			mission.$update(function() {
				$location.path('missions/' + mission._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Missions
		$scope.find = function() {
			$scope.missions = Missions.query();
		};

		// Find existing Mission
		$scope.findOne = function() {
			$scope.mission = Missions.get({ 
				missionId: $stateParams.missionId
			});
		};
	}
]);