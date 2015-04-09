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
				$state.go('thisMission.viewMission', {missionId : response._id});
				// Clear form fields
                $scope.missionForm = new Missions();
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

	}
]);
