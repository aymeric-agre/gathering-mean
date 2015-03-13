'use strict';

// Missions controller
angular.module('missions').controller('MissionsController', ['$scope', '$stateParams', '$state', 'Authentication', 'Missions', 'missions',
	function($scope, $stateParams, $state, Authentication, Missions, missions) {

        $scope.authentication = Authentication;
        $scope.missions = missions;

		// Create new Mission
        $scope.missionForm = new Missions();
		$scope.create = function() {
			// Redirect after save
            console.log($scope.missionForm);
            $scope.missionForm.$save(function(response) {
				$state.go('mission.viewMission', {missionId : response._id});
				// Clear form fields
                $scope.missionForm = new Missions();
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
					$state.go('missions', {}, {reload : true});
				});
			}
		};

		// Update existing Mission
		$scope.update = function() {
			var mission = $scope.mission;

			mission.$update(function() {
				$state.go('missions/' + mission._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find existing Mission
		$scope.findOne = function() {
			$scope.mission = Missions.get({missionId: $stateParams.missionId});
		};
	}
]);
