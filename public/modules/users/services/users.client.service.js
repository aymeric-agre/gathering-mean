'use strict';

// Users service used for communicating with the users REST endpoint
angular.module('users').factory('Users', ['$resource',
	function($resource) {
		return $resource('users', {}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);

/*	Permet de charger toutes les missions	*/
angular.module('users').factory('allUsersLoader', ['Users', '$q',
    function(Users, $q) {
        return function(){
            var delay = $q.defer();
            Users.query(function(users){
                delay.resolve(users);
            }, function(){
                delay.reject('Pas de missions trouvés');
            });
            return delay.promise;
        };
    }]);
