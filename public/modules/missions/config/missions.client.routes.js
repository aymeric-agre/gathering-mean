'use strict';

//Setting up route
angular.module('missions').config(['$stateProvider',
	function($stateProvider) {
		// Missions state routing
		$stateProvider.
        state('mission',{
            abstract : true,
            template : '<ui-view/>',
            resolve: {missions: function (allMissionsLoader) {return allMissionsLoader();}},
            controller: 'MissionsController'
        }).
		state('mission.listMissions', {
			url: '/missions',
			templateUrl: 'modules/missions/views/list-missions.client.view.html'
		}).
		state('mission.createMission', {
			url: '/missions/create',
			templateUrl: 'modules/missions/views/create-mission.client.view.html'
		}).
		state('mission.viewMission', {
			url: '/missions/:missionId',
			templateUrl: 'modules/missions/views/view-mission.client.view.html',
            controller: 'MissionsController'    //Il faut recharger le controller sinon on ne récupère pas missionId
            /*resolve : {mission: ['Missions', '$stateParams', '$q',
                        function(Missions, $stateParams, $q) {
                        var delay = $q.defer();
                        Missions.get({missionId: $stateParams.missionId},
                            function(mission) {delay.resolve(mission);},
                            function() {delay.reject('Mission non trouve : ' + $stateParams.missionId);});
                        {return delay.promise;}	//A la fin on retourne le résultat
                }]
            }*/
		}).
		state('mission.editMission', {
			url: '/missions/:missionId/edit',
			templateUrl: 'modules/missions/views/edit-mission.client.view.html',
            controller: 'MissionsController'
		});
	}
]);
