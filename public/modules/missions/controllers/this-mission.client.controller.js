'use strict';

angular.module('missions').controller('ThisMissionController', ['$scope','mission','$state',
	function($scope, mission, $state) {

        $scope.mission = mission;
        $scope.urlTemplate = 'modules/missions/views/templates/' + $scope.mission.template +'/' + $scope.mission.template + '.html';
        if($scope.mission.template !== ''){$scope.hasTemplate = true;}
        else {$scope.hasTemplate = false;}


        //Working with templates
        $scope.addTemplate = function() {
            if ($scope.mission.template === ''){
                $scope.mission.template = 'japanese_game';
                $scope.hasTemplate = !$scope.hasTemplate;
                $scope.urlTemplate = 'modules/missions/views/templates/' + $scope.mission.template +'/' + $scope.mission.template + '.html';
            }
        };


        // Update existing Mission
        $scope.update = function() {
            var mission = $scope.mission;

            mission.$update(function() {
                $state.go('thisMission.viewMission', {missionId : mission.id});
            }, function(errorResponse) {
                $scope.error = errorResponse.data.message;
            });
        };

        // Remove existing Mission
        $scope.remove = function() {
            mission.$remove(function() {
                $state.go('mission.listMissions', {}, {reload : true});
            });
        };
	}
]);
