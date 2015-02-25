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

/*	Permet de charger toutes les missions	*/
angular.module('missions').factory('allMissionsLoader', ['Missions', '$q',
    function(Missions, $q) {
        return function(){
            var delay = $q.defer();
            Missions.query(function(missions){
                delay.resolve(missions);
            }, function(){
                delay.reject('Pas de missions trouvés');
            });
            return delay.promise;
        };
    }]);
