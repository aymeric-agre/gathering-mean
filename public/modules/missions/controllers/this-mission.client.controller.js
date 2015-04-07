'use strict';

angular.module('missions').controller('ThisMissionController', ['$scope','mission',
	function($scope, mission) {

        $scope.mission = mission;
        if($scope.mission.template !== ''){$scope.hasTemplate = true;}
        else {$scope.hasTemplate = false;}


        //Working with templates
        $scope.addTemplate = function() {
            console.log('before ' + $scope.mission.template);
            if ($scope.mission.template === ''){
                $scope.mission.template = 'japanese_game';
                $scope.hasTemplate = !$scope.hasTemplate;
                console.log('after ' + $scope.mission.template);
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
	}
]);
