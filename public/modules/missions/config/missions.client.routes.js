'use strict';

//Setting up route
angular.module('missions').config(['$stateProvider',
	function($stateProvider) {
		// Missions state routing
		$stateProvider.
		state('listMissions', {
			url: '/missions',
			templateUrl: 'modules/missions/views/list-missions.client.view.html'
		}).
		state('createMission', {
			url: '/missions/create',
			templateUrl: 'modules/missions/views/create-mission.client.view.html'
		}).
		state('viewMission', {
			url: '/missions/:missionId',
			templateUrl: 'modules/missions/views/view-mission.client.view.html'
		}).
		state('editMission', {
			url: '/missions/:missionId/edit',
			templateUrl: 'modules/missions/views/edit-mission.client.view.html'
		});
	}
]);