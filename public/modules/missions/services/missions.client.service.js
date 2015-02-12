'use strict';

//Missions service used to communicate Missions REST endpoints
angular.module('missions').factory('Missions', ['$resource',
	function($resource) {
		return $resource('missions/:missionId', { missionId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);